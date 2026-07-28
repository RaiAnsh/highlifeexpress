import Link from "next/link";

export function Footer() {
  return (
    <footer id="site-footer">
      <div>
        <span className="brand">HIGH LIFE</span>
        <span className="sub">EXPRESS</span>
      </div>
      <p>&copy; {new Date().getFullYear()} High Life Express. Licensed Ontario Cannabis Dispensary. Serving Ontario, adults 19+ only.</p>
      <Link href="/admin" className="footer-admin-link">Admin</Link>
    </footer>
  );
}
