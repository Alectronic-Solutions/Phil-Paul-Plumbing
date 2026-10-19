// Browser captures are taken through the computer-use browser, at matching viewports.
// Compare the static content region; exclude the original site's optional widget area.
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const results = [];
try {
  const layouts = JSON.parse(await readFile('artifacts/layout-comparison.json', 'utf8'));
  for (const item of layouts) {
    if (JSON.stringify(item.original) !== JSON.stringify(item.local)) throw new Error(`Layout mismatch on ${item.route}`);
  }
  console.log(`PASS: matching desktop layout data for ${layouts.length} pages and ${layouts.reduce((sum, item) => sum + item.local.elements.length, 0)} checked elements.`);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
for (const mode of ['mobile', 'desktop']) {
  let original, local;
  try {
    original = await readFile(`artifacts/original-${mode}.png`);
    local = await readFile(`artifacts/local-${mode}.png`);
  } catch { continue; }
  const a = await sharp(original).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(local).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (a.info.width !== b.info.width || a.info.height !== b.info.height) throw new Error(`${mode}: mismatched viewport dimensions`);
  const width = a.info.width;
  const height = a.info.height;
  const cropBottom = height - 100;
  let different = 0, total = 0, absolute = 0;
  for (let y = 0; y < cropBottom; y++) for (let x = 0; x < width - 16; x++) {
    const offset = (y * width + x) * 4;
    const difference = Math.max(...[0, 1, 2].map((c) => Math.abs(a.data[offset+c] - b.data[offset+c])));
    if (difference > 10) different++;
    absolute += difference;
    total++;
  }
  results.push({ mode, width, height, comparedRegion: { left: 0, top: 0, width: width-16, height: cropBottom }, pixelsDifferentAbove10: different, pixelsCompared: total, percentageDifferent: Number((100 * different / total).toFixed(4)), meanMaxChannelDifference: Number((absolute / total).toFixed(4)), note: 'Viewport only. Bottom 100px and scrollbar excluded to omit original third-party widgets. This does not establish whole-site pixel identity.' });
}
if (!results.length) throw new Error('No paired browser screenshots found in artifacts/.');
await writeFile('artifacts/visual-comparison.json', JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify(results, null, 2));
