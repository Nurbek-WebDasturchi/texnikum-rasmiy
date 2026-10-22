import { SITE } from '../data/site';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-in">
        <span>{SITE.district} {SITE.name}</span>
        <span>© {new Date().getFullYear()} Barcha huquqlar himoyalangan</span>
      </div>
    </footer>
  );
}
