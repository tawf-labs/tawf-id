import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { to: "/about", label: "Protocol" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/asnaf", label: "Asnaf" },
  { to: "/claim", label: "Claim" },
  { to: "/dashboard", label: "Dashboard" },
];

const GREEN_BG_PAGES = ["/about", "/how-it-works", "/asnaf"];

export function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const onGreenPage = GREEN_BG_PAGES.includes(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 h-20"
      style={{
        background: scrolled ? "color-mix(in srgb, var(--color-tawf-sand) 92%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid color-mix(in srgb, var(--color-tawf-green) 10%, transparent)" : "none",
        transition: "background 0.3s, backdrop-filter 0.3s, border-color 0.3s",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-medium tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tawf-gold rounded"
          style={{ fontFamily: "var(--font-serif)", color: "var(--color-tawf-green)" }}
        >
          tawf-did
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ to, label }) => {
            const isActive = pathname === to;
            const activeColor = onGreenPage && !scrolled ? "var(--color-tawf-sand)" : "var(--color-tawf-green)";
            const mutedColor = onGreenPage && !scrolled ? "rgba(249,246,240,0.6)" : "var(--color-tawf-muted)";
            return (
              <Link
                key={to}
                to={to}
                className="text-xs tracking-widest uppercase font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tawf-gold rounded px-1"
                style={{ color: isActive ? activeColor : mutedColor }}
                onMouseEnter={(e) => (e.currentTarget.style.color = activeColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? activeColor : mutedColor)}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ConnectButton chainStatus="icon" showBalance={false} />
          <button
            className="md:hidden p-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tawf-gold"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            style={{ color: "var(--color-tawf-green)" }}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4"
          style={{ background: "var(--color-tawf-sand)", borderBottom: "1px solid color-mix(in srgb, var(--color-tawf-green) 10%, transparent)" }}
        >
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-xs tracking-widest uppercase font-medium py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tawf-gold rounded"
              style={{ color: pathname === to ? "var(--color-tawf-green)" : "var(--color-tawf-muted)" }}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
