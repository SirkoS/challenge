import{c as N,b as d,t as y}from"../chunks/DPI9c3w9.js";import{a3 as v,a7 as O,a4 as t,a6 as e,a8 as C,n as a,a0 as U,a1 as A}from"../chunks/gBt90wYd.js";import{s as h}from"../chunks/CNCZbiop.js";import{e as k,i as D,s as x}from"../chunks/B02JU1mm.js";var E=y("<li><a> </a></li>"),V=N(`<div class="navBox svelte-1p0x8pv"><div class="navBoxHead">Filter</div> <div class="navBoxBody filterBody svelte-1p0x8pv"><input type="text" id="filter" placeholder="Filter Variables ..." class="svelte-1p0x8pv"> <script>
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
    <\/script></div></div> <div class="navBox svelte-1p0x8pv"><div class="navBoxHead">Navigation</div> <div class="navBoxBody"><ul></ul></div></div>`,1);function z(_,o){var n=V(),c=v(O(n),2),s=v(t(c),2),m=t(s);k(m,21,()=>o.nav,D,(f,r)=>{var i=E(),l=t(i),b=t(l,!0);e(l),e(i),C(()=>{x(l,"href",a(r).link),h(b,a(r).label)}),d(f,i)}),e(m),e(s),e(c),d(_,n)}var G=y('<li class="variable-item svelte-14s58y4"><article><h3 class="svelte-14s58y4"><a> </a></h3> <p class="svelte-14s58y4"> </p> <a class="download svelte-14s58y4" title="Download RDF"><img src="rdf.svg" alt="Download RDF" class="svelte-14s58y4"></a></article></li>'),J=y('<section><h2> </h2> <ul class="variable-list svelte-14s58y4"></ul></section>'),K=y("<nav><!></nav> <main></main>",1);function X(_,o){U(o,!0);const n=[];for(const[r,i]of Object.entries(o.data.variables))n.push({label:r,link:`#${encodeURIComponent(r)}`});var c=K(),s=O(c),m=t(s);z(m,{nav:n}),e(s);var f=v(s,2);k(f,21,()=>Object.entries(o.data.variables),D,(r,i)=>{let l=()=>a(i)[0],b=()=>a(i)[1];var g=J(),p=t(g),S=t(p,!0);e(p);var R=v(p,2);k(R,21,b,D,(w,u)=>{var B=G(),q=t(B),F=t(q),L=t(F),j=t(L,!0);e(L),e(F);var T=v(F,2),H=t(T,!0);e(T);var I=v(T,2);e(q),e(B),C(()=>{x(L,"href",a(u).path+".html"),h(j,a(u).title),h(H,a(u).comment),x(I,"href",a(u).path)}),d(w,B)}),e(R),e(g),C(w=>{x(p,"id",w),h(S,l())},[()=>encodeURIComponent(l())]),d(r,g)}),e(f),d(_,c),A()}export{X as component};
