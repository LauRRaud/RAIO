import fs from "node:fs";
import sharp from "sharp";

const source = "public/Logo/RAIO_horizontal_black_transparent.svg";
const output = "public/favicon.ico";
const preview = "output/favicon-new-256.png";
const sizes = [16, 32, 48, 64, 128, 256];

const svgText = fs.readFileSync(source, "utf8");
const rPath = svgText.match(/<path id="R"[^>]*\/>/)?.[0];

if (!rPath) {
  throw new Error(`Could not find the R path in ${source}`);
}

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="650" height="805" viewBox="0 0 650 805">
  <g fill="#f4efe6">${rPath}</g>
</svg>`;

fs.mkdirSync("output", { recursive: true });

const pngs = [];

for (const size of sizes) {
  const mark = await sharp(Buffer.from(markSvg))
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize({
      width: Math.round(size * 0.64),
      height: Math.round(size * 0.82),
      fit: "inside"
    })
    .png()
    .toBuffer();

  const { width = size, height = size } = await sharp(mark).metadata();
  const image = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 23, g: 19, b: 16, alpha: 1 }
    }
  })
    .composite([
      {
        input: mark,
        left: Math.round((size - width) / 2),
        top: Math.round((size - height) / 2)
      }
    ])
    .png()
    .toBuffer();

  if (size === 256) {
    fs.writeFileSync(preview, image);
  }

  pngs.push({ size, image });
}

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);

let offset = 6 + pngs.length * 16;
const entries = [];

for (const { size, image } of pngs) {
  const entry = Buffer.alloc(16);
  entry[0] = size === 256 ? 0 : size;
  entry[1] = size === 256 ? 0 : size;
  entry[2] = 0;
  entry[3] = 0;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(image.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += image.length;
  entries.push(entry);
}

fs.writeFileSync(output, Buffer.concat([header, ...entries, ...pngs.map(({ image }) => image)]));

console.log(JSON.stringify({ source, output, preview, sizes, bytes: fs.statSync(output).size }, null, 2));
