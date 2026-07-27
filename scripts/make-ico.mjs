import pngToIco from "png-to-ico";
import fs from "fs";

const buf = await pngToIco([
  "public/icons/icon-16.png",
  "public/icons/icon-32.png",
  "public/icons/icon-48.png",
]);

fs.writeFileSync("public/favicon.ico", buf);
fs.writeFileSync("app/favicon.ico", buf);
console.log("ico ok", buf.length);
