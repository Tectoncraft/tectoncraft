export const LOADER_FLAG = "tc-loader";

/** Inline script (runs before paint): flag <html> on the first visit of a session. `?loader` forces it. */
export const loaderFlagScript = `try{if((location.search.indexOf("loader")>-1||!sessionStorage.getItem("${LOADER_FLAG}"))&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("data-loader","")}catch(e){}`;
