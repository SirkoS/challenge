<script lang="ts">
  import type { VariableList } from "$lib/store/variable";


  let {
    selected,
    variables,
   } : {
    selected: string,
    variables: { [index: string]: Array<VariableList> },
  } = $props();

  // determine base path
  const toBase = selected
    .split( '/' )
    .slice( 0, -1 )
    .map( () => '..' )
    .join( '/')
</script>

<div class="navBox">
  <div class="navBoxHead">Navigation</div>
  <div class="navBoxBody">
    <ul>
      {#each Object.keys(variables) as section}
        <li>
          <i>{section}</i>
          <ul>
          {#each variables[section] as variable}
          <a href={(toBase ? `${toBase}/${variable.path}` : variable.path) + '.html'}>
            <li class:selected={selected == variable.path}>
                {variable.title}
            </li>
          </a>
          {/each}
          </ul>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
ul ul {
  font-size: 90%;
}
.selected {
  font-weight: bold;
}

.navBox {
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.navBoxBody {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>