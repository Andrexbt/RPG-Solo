import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const sharp = require("C:/Users/Lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp");

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const sourcePath = path.join(projectDirectory, "assets", "recursos", "old-paper-03.webp");
const layoutName = process.argv.includes("--vertical") ? "vertical" : process.argv.includes("--quadrados") ? "quadrados" : "horizontal";
const layouts = {
  horizontal: { horizontalCenters: [320, 640, 960], verticalCenters: [640] },
  vertical: { horizontalCenters: [640], verticalCenters: [320, 640, 960] },
  quadrados: { horizontalCenters: [320, 640, 960], verticalCenters: [320, 640, 960] },
};
const layout = layouts[layoutName];
const rows = layout.horizontalCenters.length + 1;
const columns = layout.verticalCenters.length + 1;
const outputDirectory = path.join(projectDirectory, "assets", "pergaminhos", "old-paper-03", layoutName);
const analyzeOnly = process.argv.includes("--analyze");

const { data: source, info } = await sharp(sourcePath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
if (width !== 1280 || height !== 1280 || channels !== 4) {
  throw new Error(`Dimensões inesperadas: ${width}x${height}, ${channels} canais`);
}

function brightness(x, y) {
  const i = (y * width + x) * 4;
  return (source[i] * 0.2126 + source[i + 1] * 0.7152 + source[i + 2] * 0.0722) * source[i + 3] / 255;
}

function traceSeam(center, vertical = false) {
  const length = vertical ? height : width;
  const limit = vertical ? width : height;
  const radius = 25;
  const low = center - radius;
  const high = center + radius;
  const candidates = high - low + 1;
  const costs = new Float64Array(length * candidates);
  const parents = new Int16Array(length * candidates);

  for (let position = 0; position < length; position++) {
    for (let offset = 0; offset < candidates; offset++) {
      const cut = low + offset;
      let edgeStrength = 0;
      for (let n = -2; n <= 2; n++) {
        const along = Math.max(2, Math.min(length - 3, position + n));
        const a = vertical ? brightness(cut - 1, along) : brightness(along, cut - 1);
        const b = vertical ? brightness(cut + 1, along) : brightness(along, cut + 1);
        edgeStrength += Math.abs(a - b) / 5;
      }
      const score = edgeStrength - Math.abs(cut - center) * 0.2;
      const current = position * candidates + offset;
      if (position === 0) {
        costs[current] = score;
        continue;
      }

      let best = -Infinity;
      let bestPrevious = offset;
      for (let step = -2; step <= 2; step++) {
        const previous = offset + step;
        if (previous < 0 || previous >= candidates) continue;
        const candidate = costs[(position - 1) * candidates + previous] - Math.abs(step) * 1.25;
        if (candidate > best) {
          best = candidate;
          bestPrevious = previous;
        }
      }
      costs[current] = best + score;
      parents[current] = bestPrevious;
    }
  }

  let bestEnd = 0;
  for (let offset = 1; offset < candidates; offset++) {
    if (costs[(length - 1) * candidates + offset] > costs[(length - 1) * candidates + bestEnd]) {
      bestEnd = offset;
    }
  }
  const seam = new Int16Array(length);
  let cursor = bestEnd;
  for (let position = length - 1; position >= 0; position--) {
    seam[position] = low + cursor;
    cursor = parents[position * candidates + cursor];
  }
  return seam;
}

const horizontalSeams = layout.horizontalCenters.map((center) => traceSeam(center));
const verticalSeams = layout.verticalCenters.map((center) => traceSeam(center, true));

for (const [index, seam] of horizontalSeams.entries()) {
  console.log(`Horizontal ${index + 1}: ${Array.from({ length: 17 }, (_, i) => seam[i * 80]).join(", ")}`);
}
for (const [index, seam] of verticalSeams.entries()) {
  console.log(`Vertical ${index + 1}: ${Array.from({ length: 17 }, (_, i) => seam[i * 80]).join(", ")}`);
}

if (analyzeOnly) process.exit(0);

const pieces = Array.from({ length: rows * columns }, (_, index) => ({
  number: index + 1,
  pixels: Buffer.alloc(source.length),
  bounds: { left: width, top: height, right: 0, bottom: 0 },
}));
const owner = new Uint8Array(width * height);

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const row = horizontalSeams.reduce((count, seam) => count + Number(y >= seam[x]), 0);
    const column = verticalSeams.reduce((count, seam) => count + Number(x >= seam[y]), 0);
    const piece = pieces[row * columns + column];
    const i = (y * width + x) * 4;
    owner[y * width + x] = piece.number;
    source.copy(piece.pixels, i, i, i + 4);
    if (source[i + 3]) {
      piece.bounds.left = Math.min(piece.bounds.left, x);
      piece.bounds.top = Math.min(piece.bounds.top, y);
      piece.bounds.right = Math.max(piece.bounds.right, x + 1);
      piece.bounds.bottom = Math.max(piece.bounds.bottom, y + 1);
    }
  }
}

const finished = pieces.map(() => Buffer.alloc(source.length));
function noise(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = (x - ix) ** 2 * (3 - 2 * (x - ix));
  const fy = (y - iy) ** 2 * (3 - 2 * (y - iy));
  const hash = (a, b) => {
    let n = Math.imul(a, 374761393) + Math.imul(b, 668265263);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  };
  const top = hash(ix, iy) * (1 - fx) + hash(ix + 1, iy) * fx;
  const bottom = hash(ix, iy + 1) * (1 - fx) + hash(ix + 1, iy + 1) * fx;
  return top * (1 - fy) + bottom * fy;
}
for (let p = 0; p < owner.length; p++) {
  const piece = finished[owner[p] - 1];
  const i = p * 4;
  const alpha = source[i + 3];
  if (!alpha) continue;
  const x = p % width;
  const y = Math.floor(p / width);
  const row = Math.floor((owner[p] - 1) / columns);
  const column = (owner[p] - 1) % columns;
  const edges = [];
  if (row > 0) edges.push({ distance: y - horizontalSeams[row - 1][x], sample: (d) => (d * width + x) * 4 });
  if (row < rows - 1) edges.push({ distance: horizontalSeams[row][x] - 1 - y, sample: (d) => ((height - 1 - d) * width + x) * 4 });
  if (column > 0) edges.push({ distance: x - verticalSeams[column - 1][y], sample: (d) => (y * width + d) * 4 });
  if (column < columns - 1) edges.push({ distance: verticalSeams[column][y] - 1 - x, sample: (d) => (y * width + width - 1 - d) * 4 });
  let borderAlpha = 255;
  let shade = 1;
  let borderColor = null;
  let blend = 0;
  let wear = 0;
  for (const edge of edges) {
    if (edge.distance < 0 || edge.distance >= 90) continue;
    const mottling = 0.55 * noise(x / 37, y / 31) + 0.45 * noise(x / 13, y / 17);
    const patch = noise(x / 79 + 5, y / 49 + 11);
    const reach = 19 + 32 * patch;
    if (edge.distance < reach) {
      const amount = (1 - edge.distance / reach) ** 1.8 * (0.38 + 1.25 * patch + 0.25 * mottling);
      wear = Math.max(wear, amount);
    }
    if (edge.distance < 22) wear = Math.max(wear, 1.15 * (1 - edge.distance / 22));
    if (edge.distance < 28) {
      const sample = edge.sample(edge.distance);
      borderAlpha = Math.min(borderAlpha, source[sample + 3]);
      shade *= 1 - 0.15 * (1 - edge.distance / 28) ** 2;
      if (source[sample + 3] && edge.distance < 20 && edge.distance < 20 * (1 - blend)) {
        borderColor = sample;
        blend = 0.65 * (1 - edge.distance / 20);
      }
    }
  }
  for (let channel = 0; channel < 3; channel++) {
    const original = source[i + channel] * shade;
    const inherited = borderColor === null ? original : original * (1 - blend) + source[borderColor + channel] * blend;
    const char = Math.min(1, wear);
    const soot = noise(x / 4 + 19, y / 5 + 7);
    const mix = 0.75 * char;
    const aged = (inherited * (1 - mix) + [70, 36, 17][channel] * mix) * (1 - 0.09 * soot * char);
    piece[i + channel] = Math.round(aged);
  }
  piece[i + 3] = Math.min(alpha, borderAlpha);
}

const manifest = { source: path.relative(projectDirectory, sourcePath).replaceAll("\\", "/"), layout: layoutName, rows, columns, width, height, pieces: [] };
for (const piece of pieces) {
  const { left, top, right, bottom } = piece.bounds;
  const image = await sharp(piece.pixels, { raw: { width, height, channels: 4 } })
    .extract({ left, top, width: right - left, height: bottom - top })
    .webp({ lossless: true, effort: 6 })
    .toBuffer();
  const filename = `p${String(piece.number).padStart(2, "0")}.webp`;
  const outputPath = path.join(outputDirectory, "recomponiveis", filename);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, image);
  const standalone = await sharp(finished[piece.number - 1], { raw: { width, height, channels: 4 } })
    .extract({ left, top, width: right - left, height: bottom - top })
    .webp({ lossless: true, effort: 6 })
    .toBuffer();
  const standalonePath = path.join(outputDirectory, "avulsas", filename);
  await mkdir(path.dirname(standalonePath), { recursive: true });
  await writeFile(standalonePath, standalone);
  manifest.pieces.push({ number: piece.number, file: `recomponiveis/${filename}`, x: left, y: top, width: right - left, height: bottom - top });
}

await writeFile(path.join(outputDirectory, "manifesto.json"), JSON.stringify(manifest, null, 2) + "\n");
const reconstructed = Buffer.alloc(source.length);
for (const item of manifest.pieces) {
  const decoded = await sharp(path.join(outputDirectory, item.file)).ensureAlpha().raw().toBuffer();
  for (let y = 0; y < item.height; y++) {
    for (let x = 0; x < item.width; x++) {
      const from = (y * item.width + x) * 4;
      const to = ((item.y + y) * width + item.x + x) * 4;
      if (decoded[from + 3]) decoded.copy(reconstructed, to, from, from + 4);
    }
  }
}
let mismatches = 0;
for (let i = 0; i < source.length; i += 4) {
  if (source[i + 3] !== reconstructed[i + 3] || (source[i + 3] && (source[i] !== reconstructed[i] || source[i + 1] !== reconstructed[i + 1] || source[i + 2] !== reconstructed[i + 2]))) mismatches++;
}
if (mismatches) throw new Error(`Falha na remontagem: ${mismatches} pixels visíveis diferentes`);
console.log(`Salvas ${pieces.length} peças remontáveis e ${pieces.length} avulsas em ${outputDirectory}`);
console.log("Remontagem validada: todos os pixels visíveis idênticos ao original.");
