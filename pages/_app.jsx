import '../styles/site.css';
import '../styles/premium.css';
import '../styles/polish.css';
import '../styles/landing.css';
import '../styles/motion.css';
import { Motion } from '../components/Motion';
export default function App({ Component, pageProps }) { return <><Component {...pageProps} /><Motion /></>; }
