import { readFile, writeFile } from 'node:fs/promises';
// Reviewer profile photos are intentionally not downloaded: using a person's likeness in advertising needs their permission.
let logo = await readFile('reference/published-assets/e3904b37fe-6a3979af29ac04b875e841fb_icons8-google-240.svg', 'utf8');
for (const [from, to] of [['#FFC107', '#FBBC05'], ['#FF3D00', '#EA4335'], ['#4CAF50', '#34A853'], ['#1976D2', '#4285F4']]) logo = logo.replaceAll(from, to);
await writeFile('public/images/google-g.svg', logo);
console.log('Prepared the multicolor Google mark.');
