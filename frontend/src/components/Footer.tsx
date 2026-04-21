import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  Protocol: [
    { label: "How It Works", to: "/how-it-works" },
    { label: "About ZK-DID", to: "/about" },
    { label: "Research Paper", to: "/about#paper" },
  ],
  Identity: [
    { label: "Claim Identity", to: "/claim" },
    { label: "DID Registry", to: "/dashboard" },
    { label: "Verify Proof", to: "/dashboard" },
  ],
  Ecosystem: [
    { label: "tawf.foundation", href: "https://tawf.foundation" },
    { label: "ziswaf.tawf.foundation", href: "https://ziswaf.tawf.foundation" },
    { label: "Base Sepolia", href: "https://sepolia.basescan.org" },
    { label: "W3C DID Spec", href: "https://www.w3.org/TR/did-core/" },
  ],
  Research: [
    { label: "BINUS University", href: "https://binus.ac.id" },
    { label: "Circom Circuits", to: "/about#circuits" },
    { label: "SnarkJS", href: "https://github.com/iden3/snarkjs" },
  ],
};

export function Footer() {
  return (
    <footer style={{ background: "var(--color-tawf-ink)" }} aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <p
              className="text-2xl font-medium mb-3"
              style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-sand)" }}
            >
              tawf-did
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(249,246,240,0.55)" }}>
              Zero-Knowledge Decentralized Identity for privacy-preserving mustahik verification. Built for{" "}
              <a
                href="https://tawf.foundation"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200"
                style={{ color: "var(--color-tawf-gold)" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                tawf.foundation
              </a>{" "}
              by Tawf Labs.
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p
                className="text-xs tracking-widest uppercase mb-4 font-medium"
                style={{ color: "var(--color-tawf-gold)" }}
              >
                {section}
              </p>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {"to" in link && link.to ? (
                      <Link
                        to={link.to}
                        className="text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tawf-gold rounded"
                        style={{ color: "rgba(249,246,240,0.55)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-tawf-gold)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(249,246,240,0.55)")}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={"href" in link ? link.href : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tawf-gold rounded"
                        style={{ color: "rgba(249,246,240,0.55)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-tawf-gold)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(249,246,240,0.55)")}
                      >
                        {link.label} ↗
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)", color: "rgba(249,246,240,0.35)" }}
        >
          <p>© 2026 Tawf Islamic Foundation. Research prototype on Base Sepolia.</p>
          <p>Built with Circom · SnarkJS · Solidity · React</p>
        </div>
      </div>
    </footer>
  );
}
