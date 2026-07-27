const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const outDir = path.join("public", "icons");
fs.mkdirSync(outDir, { recursive: true });

async function makeLogoWhite() {
  const sourceSvg = fs
    .readFileSync(path.join("public", "dedox-perfume-logo.svg"), "utf8")
    .replace(
      /<svg([^>]*)>/,
      '<svg$1><style>path{fill:#ffffff!important}</style>'
    );
  return sharp(Buffer.from(sourceSvg)).trim().png().toBuffer();
}

async function makeIcon(size, logoBuf) {
  const radius = Math.round(size * 0.22);
  const pad = Math.max(2, Math.round(size * 0.12));
  const inner = Math.max(1, size - pad * 2);

  const logo = await sharp(logoBuf)
    .resize(inner, Math.round(inner * 0.55), {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const roundedMask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/>
    </svg>`
  );

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: "#7a0c0c",
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toBuffer()
    .then((square) =>
      sharp(square)
        .composite([{ input: roundedMask, blend: "dest-in" }])
        .png()
        .toBuffer()
    );
}

async function main() {
  const logoBuf = await makeLogoWhite();
  const sizes = [16, 32, 48, 180, 192, 512];

  for (const size of sizes) {
    const buf = await makeIcon(size, logoBuf);
    fs.writeFileSync(path.join(outDir, `icon-${size}.png`), buf);
    console.log("wrote", size);
  }

  fs.copyFileSync(path.join(outDir, "icon-32.png"), path.join("app", "icon.png"));
  fs.copyFileSync(path.join(outDir, "icon-180.png"), path.join("app", "apple-icon.png"));
  fs.copyFileSync(path.join(outDir, "icon-32.png"), path.join("public", "favicon-32x32.png"));
  fs.copyFileSync(path.join(outDir, "icon-48.png"), path.join("public", "favicon-48x48.png"));

  // Rounded SVG for modern browsers
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" ry="112" fill="#7a0c0c"/>
  <image href="/dedox-perfume-logo.svg" x="40" y="150" width="432" height="212" style="filter: brightness(0) invert(1);"/>
</svg>
`;
  // Prefer embedded white wordmark via compositing for reliability instead of filter SVG
  const svg512 = await makeIcon(512, logoBuf);
  // Keep a simple rounded SVG background + we use PNG as primary
  fs.writeFileSync(
    path.join("public", "favicon.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" ry="112" fill="#7a0c0c"/>
</svg>\n`
  );

  console.log("png done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
