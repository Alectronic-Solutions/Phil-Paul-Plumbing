// Prefixes public file paths with the deploy base path (set for GitHub Pages builds only).
export const asset = (path) => `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`;
