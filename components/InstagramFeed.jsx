import { business } from '../content/company.mjs';
import { instagramHandle, instagramPosts } from '../content/instagram.mjs';
import { Icon } from './Icon';

// Each post is a plain link until the visitor allows functional cookies. Then the consent manager loads
// Instagram's embed.js (see content/integrations.mjs), which swaps every .instagram-media block for the real post.
export function InstagramFeed() {
  return <section className="section instagram-section" aria-labelledby="instagram-title"><div className="container">
    <div className="section-heading"><div><div className="eyebrow">FROM OUR INSTAGRAM</div><h2 id="instagram-title">Recent work,<br />straight from the truck.</h2></div>
      <div className="section-heading-side"><p>See what the crew has been up to lately.</p><a className="text-link" href={business.instagram} target="_blank" rel="noopener noreferrer">Follow @{instagramHandle}<Icon name="arrow" size={18} /></a></div></div>
    <div className="instagram-grid">{instagramPosts.map(post => <div className="instagram-item" key={post.url}>
      <blockquote className="instagram-media" data-instgrm-permalink={post.url} data-instgrm-version="14">
        <a className="instagram-fallback" href={post.url} target="_blank" rel="noopener noreferrer">{post.label}<span>View on Instagram</span></a>
      </blockquote>
    </div>)}</div>
  </div></section>;
}
