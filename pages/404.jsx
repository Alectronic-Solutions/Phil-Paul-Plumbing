import Head from 'next/head';
import { Layout, Eyebrow, Button } from '../components/Site';
export default function NotFound() {
  return <><Head><title>Page not found | Phil &amp; Paul’s Plumbing</title></Head><Layout><section className="not-found section"><div className="container"><Eyebrow>404 / PAGE NOT FOUND</Eyebrow><h1>A wrong turn.<br />An easy fix.</h1><p>That page is not here. Let’s get you back to the right place.</p><div className="button-group"><Button href="/">Back to home</Button><Button href="/service" variant="outline">Explore services</Button></div></div></section></Layout></>;
}
