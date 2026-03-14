import { Github } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="section relative mt-12" style={{ paddingTop: 70, paddingBottom: 50 }}>
      {/* Background shape */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          viewBox="0 0 1905 295"
          className="absolute bottom-0 left-0 w-full"
          preserveAspectRatio="none"
          style={{ height: 200 }}
        >
          <path
            d="M0 295V80C300 20 600 0 952 40C1304 80 1605 60 1905 0V295H0Z"
            className="fill-theme-light dark:fill-dm-theme-dark"
          />
        </svg>
      </div>

      <div className="container text-center">
        {/* Logo */}
        <Link to="/" className="mb-6 inline-flex font-secondary text-2xl font-bold text-dark dark:text-white">
          f4zzie
        </Link>

        {/* Description */}
        <p className="mx-auto max-w-[638px] text-text dark:text-dm-text">
          Cybersecurity Learner focused on Malware Analysis, Reverse Engineering & Exploit Development.
        </p>

        {/* Menu */}
        <div className="mb-12 mt-6 flex flex-wrap items-center justify-center gap-2 lg:gap-4">
          {[
            { label: "Home", to: "/" },
            { label: "About", to: "/about" },
            { label: "Notes", to: "/notes" },
            { label: "Projects", to: "/projects" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="p-2 font-bold text-dark dark:text-dm-dark transition-colors hover:text-primary dark:hover:text-dm-primary lg:p-4"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Socials */}
        <div className="socials mb-12 justify-center border-x border-primary dark:border-dm-primary px-6 inline-flex">
          <a href="https://github.com/f4zzie" target="_blank" rel="noreferrer">
            <Github size={20} />
          </a>
          <a href="https://x.com/_lazerguard" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-light">
          &copy; {new Date().getFullYear()} f4zzie. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
