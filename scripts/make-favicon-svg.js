const fs = require("fs");

const png = fs.readFileSync("public/icons/icon-512.png");
const b64 = png.toString("base64");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <image href="data:image/png;base64,${b64}" width="512" height="512"/>
</svg>
`;
fs.writeFileSync("public/favicon.svg", svg);
console.log("svg ok", svg.length);
