import { readFile, writeFile, mkdir } from 'node:fs/promises';
const source = JSON.parse(await readFile('reference/google-review-sources.json', 'utf8'));
await mkdir('public/images/reviewers', { recursive: true });
const names = { 'Claudia Trevino': 'claudia-trevino', 'austin blake': 'austin-blake', 'Karen Mellish': 'karen-mellish', 'Kelly Stow': 'kelly-stow', 'Monty Merrill (TSH Lodi Physical Therapy)': 'monty-merrill' };
for (const reviewer of source.reviewers) {
  // Same observed profile image, requested at a readable size without the thumbnail circle mask.
  const response = await fetch(reviewer.photo.replace(/=w36-h36.*$/, '=s128'));
  if (!response.ok) throw new Error(`${reviewer.name}: HTTP ${response.status}`);
  await writeFile(`public/images/reviewers/${names[reviewer.name]}.jpg`, Buffer.from(await response.arrayBuffer()));
}
let logo = await readFile('reference/published-assets/e3904b37fe-6a3979af29ac04b875e841fb_icons8-google-240.svg', 'utf8');
for (const [from, to] of [['#FFC107', '#FBBC05'], ['#FF3D00', '#EA4335'], ['#4CAF50', '#34A853'], ['#1976D2', '#4285F4']]) logo = logo.replaceAll(from, to);
await writeFile('public/images/google-g.svg', logo);
console.log(`Prepared ${source.reviewers.length} verified profile images and the multicolor Google mark.`);
