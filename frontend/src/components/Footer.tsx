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
    <footer className="border-t border-white/10 bg-ink" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-5">
          <div>
            <p className="mb-3 text-2xl font-medium tracking-[-0.03em] text-paper">tawf-did</p>
            <p className="max-w-[34ch] text-sm leading-relaxed text-white/60">
              Zero-Knowledge Decentralized Identity for privacy-preserving mustahik verification. Built for{" "}
              <a
                href="https://tawf.foundation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-butter transition-colors duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-butter focus-visible:outline-none"
              >
                tawf.foundation
              </a>{" "}
              by Tawf Labs.
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="mb-4 text-xs font-medium tracking-[0.12em] uppercase text-white">{section}</p>
              <ul className="flex flex-col gap-1">
                {links.map((link) => {
                  const className =
                    "inline-flex min-h-[32px] items-center rounded text-sm text-white/60 transition-colors duration-200 hover:text-butter focus-visible:ring-2 focus-visible:ring-butter focus-visible:outline-none";
                  return (
                    <li key={link.label}>
                      {"to" in link && link.to ? (
                        <Link to={link.to} className={className}>
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={"href" in link ? link.href : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={className}
                        >
                          {link.label} ↗
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/45 md:flex-row">
          <p>© 2026 Tawf Islamic Foundation. Research prototype on Base Sepolia.</p>
          <p>Built with Circom · SnarkJS · Solidity · React</p>
        </div>
      </div>
    </footer>
  );
}
