(function(){

  // schedule update of filter
  let filterTimer = null;
  document.querySelector( '#filter' )
   ?.addEventListener( 'input', () => {
    if ( filterTimer ) {
      clearTimeout( filterTimer );
    }
    filterTimer = setTimeout( triggerFilter, 200 );
  } );


  function triggerFilter() {

    // get filter term
    const term = document.querySelector( '#filter' )?.value?.toLowerCase() || null;

    for( const entry of document.querySelectorAll( '.variable-item') ) {

      if( term ) {

        // only show, if filter term is included
        if( ! entry.textContent?.toLowerCase().includes( term ) ) {
          entry.classList.add( 'hidden' );
        } else {
          entry.classList.remove( 'hidden' );
        }

      } else {

        // if no filter term is set, show all entries
        entry.classList.remove( 'hidden' );

      }
    }
  }

})();
