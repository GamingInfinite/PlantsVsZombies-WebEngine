<script>
  import Game from "./Components/Game.svelte";
</script>

<div id="app">
  <svelte:component this={Game} boardType="frontLawn" sunCount=50 />
</div>

<style>
</style>
