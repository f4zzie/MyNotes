import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sun, Moon, Search, Menu, X, Github } from "lucide-react";

interface NavbarProps {
  dark: boolean;
  toggleTheme: () => void;
}

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/notes", label: "Notes" },
  { to: "/projects", label: "Projects" },
];

export default function Navbar({ dark, toggleTheme }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          borderColor: dark ? "var(--color-dm-border)" : "var(--color-border)",
          backgroundColor: dark ? "var(--color-dm-body)" : "var(--color-body)",
        }}
      >
        <nav className="container flex items-center justify-between" style={{ padding: "33px 32px" }}>
          {/* Logo */}
          <Link to="/" className="font-secondary text-xl font-bold" style={{ color: dark ? "#fff" : "var(--color-dark)" }}>
            f4zzie
          </Link>

          {/* Desktop Nav + Right Actions */}
          <div className="flex items-center gap-2 xl:gap-4">
            {/* Desktop Menu */}
            <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
              {links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`nav-link font-bold ${location.pathname === link.to ? "active" : ""}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Socials (desktop) */}
            <div className="hidden lg:flex socials border-x px-4 mx-2" style={{ borderColor: dark ? "var(--color-dm-border)" : "var(--color-border)" }}>
              <a href="https://github.com/f4zzie" target="_blank" rel="noreferrer">
                <Github size={18} />
              </a>
              <a href="https://x.com/_lazerguard" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="ml-1 mr-1 h-8 w-8 rounded p-1 sm:ml-2"
              style={{ color: dark ? "#f3f4f6" : "#111827" }}
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Search icon → links to notes */}
            <Link
              to="/notes"
              className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: dark ? "var(--color-dm-primary)" : "var(--color-primary)" }}
            >
              <Search size={18} />
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: dark ? "var(--color-dm-primary)" : "var(--color-primary)" }}
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Off-Canvas Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 z-50 h-screen w-full max-w-[400px] border-l p-6"
              style={{
                backgroundColor: dark ? "var(--color-dm-body)" : "var(--color-body)",
                borderColor: dark ? "var(--color-dm-border)" : "var(--color-dark)",
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-4 p-2"
                style={{ color: dark ? "#fff" : "var(--color-dark)" }}
              >
                <X size={24} />
              </button>

              <ul className="mt-16 space-y-2">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`nav-link block text-lg font-bold ${location.pathname === link.to ? "active" : ""}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="socials mt-8 justify-start border-0">
                <a href="https://github.com/f4zzie" target="_blank" rel="noreferrer">
                  <Github size={20} />
                </a>
                <a href="https://x.com/_lazerguard" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
