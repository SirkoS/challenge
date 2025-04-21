<div class="container">
  <header>
    <h1>I-ADOPT Variable Modelling Challenge</h1>
    <p>Current state of canonical solutions.</p>

  </header>

  <main>
    <slot></slot>
  </main>

  <footer>
    <p>&copy; 2025 I-ADOPT. All rights reserved.</p>
  </footer>
</div>

<style>
.container {
  height: 100%;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  color: #333;
  line-height: 1.6;
  display: grid;
  grid-template-rows: 150px calc( 100% - 210px ) 60px;
  grid-template-areas: "top" "center" "bottom";
}

header {
  background-color: #333;
  color: #fff;
  text-align: center;
  grid-area: top;
}

main {
  grid-area: center;
  padding: 1em;
  overflow: auto;
}

footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 10px 0;
  grid-area: bottom;
}
</style>