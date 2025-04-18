
import { QueryEngine } from '@comunica/query-sparql-rdfjs';
import Mustache from 'mustache';
import { promises as Fs } from 'node:fs';
import Path from 'node:path';
import { fileURLToPath } from 'node:url';
import extract from './util/extract.js';


// important paths
// https://stackoverflow.com/a/55944697/1169798
const PATH_ROOT = Path.resolve( Path.dirname( fileURLToPath(import.meta.url) ), '..', '..' );
const PATH_DIST = Path.join( PATH_ROOT, 'dist' );
const PATH_TMPL = Path.join( PATH_ROOT, '.code', 'templates' );
try{
  await Fs.access( PATH_DIST );
  await Fs.rm( PATH_DIST, {recursive: true } );
} catch {}
await Fs.mkdir( PATH_DIST );



/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX SCAN XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// results of scanning phase
const data = [];

// scan for RDF files
for await(const rawFilePath of Fs.glob( '**/*.ttl', { cwd: PATH_ROOT} ) ) {

  // skip templates
  if( rawFilePath.includes( 'template' ) ) {
    continue;
  }

  // parse
  const raw = await Fs.readFile( Path.join( PATH_ROOT, rawFilePath ), 'utf8' );
  const entries = await extract( raw );
  const entry = entries[0];
  const pathComponents = rawFilePath.split( Path.sep );
  entry.file = pathComponents.pop(),
  entry.path = pathComponents;
  entry.issue = raw.match( /ex:issue "([^"]+)"/ )[1];

  // create makeshift JSON-LD representation
  entry.jsonLD = {
    '@context': 'https://w3id.org/iadopt/Variable.context.jsonld',

    '@type':  'https://w3id.org/iadopt/ont/Variable',
    '@id':    entry.getIri(),
    label:    entry.getLabel(),
    comment:  entry.getComment(),

    property: {
      '@type': [ 'https://w3id.org/iadopt/ont/Property' ],
      '@id':    entry.getProperty()?.getIri(),
      label:    entry.getProperty()?.getLabel(),
      comment:  entry.getProperty()?.getComment(),
    },

    ooi: {
      '@type': [ 'https://w3id.org/iadopt/ont/Entity' ],
      '@id':    entry.getObjectOfInterest()?.getIri(),
      label:    entry.getObjectOfInterest()?.getLabel(),
      comment:  entry.getObjectOfInterest()?.getComment(),
    },

    context: [],
    constraint: [],

  };
  if( entry.getMatrix() ) {
    const matrix = entry.getMatrix();
    entry.jsonLD.matrix = {
      '@type': [ 'https://w3id.org/iadopt/ont/Entity' ],
      '@id':    matrix?.getIri(),
      label:    matrix?.getLabel(),
      comment:  matrix?.getComment(),
    };
  }
  if( entry.getStatisticalModifier() ) {
    const mod = entry.getStatisticalModifier();
    entry.jsonLD.statisticalModifier = {
      '@type': [ 'https://w3id.org/iadopt/ont/Entity' ],
      '@id':    mod?.getIri(),
      label:    mod?.getLabel(),
      comment:  mod?.getComment(),
    };
  }
  for( const c of entry.getContextObjects() ) {
    entry.jsonLD.context.push({
      '@type': [ 'https://w3id.org/iadopt/ont/Entity' ],
      '@id':    c.getIri(),
      label:    c.getLabel(),
      comment:  c.getComment(),
    });
  }
  for( const c of entry.getConstraints() ) {
    entry.jsonLD.constraint.push({
      '@type': [ 'https://w3id.org/iadopt/ont/Entity' ],
      '@id':    c.getIri(),
      label:    c.getLabel(),
      comment:  c.getComment(),
      constrains: c.getEntities().map( (e) => e.getIri() ),
    });
  }
  entry.rdf = raw;

  // add to result if valid entry
  data.push( entry );

}


/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX PUBLISH XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// reformat data
const renderView = { sections: [] };
const lookup = {};
for( const entry of data ) {

  // make sure the respective section exists
  const path = entry.path.join( Path.sep );
  if( !(path in lookup) ) {
    lookup[ path ] = {
      folder: path,
      entries: [],
    };
    renderView.sections.push( lookup[ path ] );
  }

  // add variable
  const renderedView = JSON.parse( JSON.stringify( entry.jsonLD ) );
  renderedView.details  = Path.join( ... entry.path, entry.file + '.html' );
  renderedView.download = entry.path + '/' + entry.file;
  lookup[ path ].entries.push( renderedView );

}


// sort entries
renderView.sections.sort( (a,b) => a.folder.localeCompare( b.folder ) );
renderView.sections.forEach( (section) => section.entries.sort( (a,b) => a.label.localeCompare( b.label ) ) );

// create overview
let template = await Fs.readFile( Path.join( PATH_TMPL, 'index.mustache' ), 'utf8' );
let rendered = Mustache.render( template, renderView );
await Fs.writeFile( Path.join( PATH_DIST, 'index.html' ), rendered );

// render details document for each file
template = await Fs.readFile( Path.join( PATH_TMPL, 'details.mustache' ), 'utf8' );
for( const entry of data ) {

  // need a flat structure for mustache
  const renderedEntry = JSON.parse( JSON.stringify( entry.jsonLD ) );
  renderedEntry.jsonLD = entry.jsonLD;

  // add constraints to the respective entries
  const compLookup = {
    [ renderedEntry.property['@id'] ]: renderedEntry.property,
    [ renderedEntry.ooi['@id'] ]: renderedEntry.ooi,
  };
  if( renderedEntry.matrix ) {
    compLookup[ renderedEntry.matrix['@id'] ] = renderedEntry.matrix;
  }
  if( renderedEntry.statisticalModifier ) {
    compLookup[ renderedEntry.statisticalModifier['@id'] ] = renderedEntry.statisticalModifier;
  }
  for( const el of renderedEntry.context ) {
    compLookup[ el['@id'] ] = el;
  }
  for( const constraint of renderedEntry.constraint ) {
    // TODO this is due to constrains on system components; need to be represented as well
    if( !(constraint.constrains in compLookup) ) {
      continue;
    }
    if( !('constraints' in compLookup[ constraint.constrains ])) {
      compLookup[ constraint.constrains ].constraints = [];
    }
    compLookup[ constraint.constrains ].constraints.push( constraint );
  }
  renderedEntry.jsonLDencoded = encodeURIComponent( JSON.stringify( entry.jsonLD ) );
  renderedEntry.rdf = encodeURIComponent(entry.rdf.replace( /\s+/g, ' ' ));
  renderedEntry.issue = entry.issue;

  // make sure we got the relative paths right
  renderedEntry.relativePath = new Array( entry.path.length ).fill( '..' ).join( '/' );

  // render
  rendered = Mustache.render( template, renderedEntry );

  // write to file
  const folder = Path.join( PATH_DIST, ... entry.path );
  try{
    await Fs.access( folder );
  } catch {
    await Fs.mkdir( folder, { recursive: true } );
  }
  const path =  Path.join( folder, entry.file + '.html' );
  await Fs.writeFile( path, rendered );
  console.log( `written ${path}` );

}

// copy files
for await(const filePath of Fs.glob( '**/!(*.mustache)', { cwd: PATH_TMPL } ) ) {
  const target = Path.join( PATH_DIST, filePath );
  try {
    await Fs.access( Path.dirname(target) );
  } catch {
    await Fs.mkdir( Path.dirname( target ), { recursive: true } );
  }
  await Fs.copyFile(
    Path.join( PATH_TMPL, filePath ),
    target
  );
}

for( const entry of data ) {
  await Fs.copyFile(
    Path.join( PATH_ROOT, ... entry.path, entry.file ),
    Path.join( PATH_DIST, ... entry.path, entry.file ),
  );
}
