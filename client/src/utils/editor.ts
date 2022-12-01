import hljs from "highlight.js";
import katex from "katex";
import "highlight.js/styles/atom-one-dark.css";
// import "react-quill/dist/quill.snow.css";
import "katex/dist/katex.css";

hljs.configure({
  languages: ["javascript", "jsx", "sh", "bash", "html", "scss", "css", "json"],
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.hljs = hljs;

window.katex = katex;
