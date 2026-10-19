import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'ui', '错题本3.png');
const output = path.join(root, 'assets', 'images', 'sprites');

// Tight pixel crops from the supplied design board. Runtime code imports these
// files individually; the full board stays only in ui/ as a design reference.
const sprites = {
  avatar: [1270, 81, 64, 65],
  camera: [375, 354, 77, 64],
  robot: [473, 354, 77, 64],
  notebook: [571, 354, 77, 64],
  printer: [669, 354, 75, 64],
  fox: [1038, 889, 105, 105],
  bulb: [1102, 870, 32, 39],
  paper1: [1182, 892, 102, 46],
  paper2: [1300, 892, 95, 46],
  paper3: [1412, 892, 94, 46],
};

const board = sharp(source);
const metadata = await board.metadata();
if (metadata.width !== 1536 || metadata.height !== 1024) {
  throw new Error(`Unexpected design board size: ${metadata.width}×${metadata.height}`);
}
await mkdir(output, { recursive: true });

await Promise.all(
  Object.entries(sprites).map(async ([name, [left, top, width, height]]) => {
    await sharp(source)
      .extract({ left, top, width, height })
      .png({ compressionLevel: 9 })
      .toFile(path.join(output, `${name}.png`));
  }),
);

console.log(`Exported ${Object.keys(sprites).length} individual PNGs to ${path.relative(root, output)}`);
