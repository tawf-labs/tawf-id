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
  /* Those pages keep their dark green header band, so the bar reads light until it scrolls. */
  const lightBar = onGreenPage && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-20 border-b transition-colors duration-300 ${
        scrolled ? "border-line bg-stone/90 backdrop-blur-md" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className={`rounded text-2xl font-medium tracking-[-0.03em] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
            lightBar ? "text-stone" : "text-ink"
          }`}
        >
          tawf-did
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map(({ to, label }) => {
            const isActive = pathname === to;
            const base =
              "rounded px-1 py-1 text-[13px] font-medium tracking-[0.06em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none";
            const tone = lightBar
              ? isActive
                ? "text-stone"
                : "text-stone/65 hover:text-stone"
              : isActive
                ? "text-accent"
                : "text-muted hover:text-accent";
            return (
              <Link key={to} to={to} className={`${base} ${tone}`}>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ConnectButton chainStatus="icon" showBalance={false} />
          <button
            className={`flex h-11 w-11 items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none md:hidden ${
              lightBar ? "text-stone" : "text-ink"
            }`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          aria-label="Mobile navigation"
          className="border-b border-line bg-paper px-6 pt-2 pb-4 md:hidden"
        >
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex min-h-[44px] items-center rounded px-1 text-[13px] font-medium tracking-[0.06em] uppercase focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                pathname === to ? "text-accent" : "text-muted hover:text-accent"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
