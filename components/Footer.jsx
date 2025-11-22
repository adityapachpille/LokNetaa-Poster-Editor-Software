import Link from "next/link";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">
        <p className="footerText">Powered By Ishwari Graphics Mangrulpir.</p>
        <div className="footerLinks">
          <Link href="https://wa.me/918806112331" className="footerLink">
            Design & Develop By ARP Digital Solution.
          </Link>
          {/* Add more links if needed */}
        </div>
      </div>
    </footer>
  );
}
