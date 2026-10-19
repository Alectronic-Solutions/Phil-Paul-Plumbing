import { Html, Head, Main, NextScript } from 'next/document';
import { asset } from '../lib/asset.mjs';
export default function Document() {
  return <Html lang="en"><Head><link rel="preload" href={asset("/fonts/501f76ca195e.ttf")} as="font" type="font/ttf" crossOrigin="anonymous" /><link rel="preload" href={asset("/fonts/0569c822cab6.ttf")} as="font" type="font/ttf" crossOrigin="anonymous" /><link rel="stylesheet" href={asset("/fonts/design.css")} /><link rel="icon" href={asset("/images/favicon.png")} type="image/png" /><meta name="robots" content="noindex, nofollow" /><meta name="theme-color" content="#751c28" /></Head><body><Main /><NextScript /></body></Html>;
}
