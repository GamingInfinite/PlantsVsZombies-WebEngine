// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = "@font-face{font-family:\"CafeteriaBlack\";src:url(\"fonts/Cafeteria-Black.otf\")}#game.svelte-1fyqfil{height:100%;width:100%}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}