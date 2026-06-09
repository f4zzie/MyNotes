import { Github } from "lucide-react";
import { Link } from "react-router-dom";
import { categories, notes } from "../data/notes";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-theme-light/70 py-10 dark:border-dm-border dark:bg-dm-theme-dark/60">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <Link to="/" className="font-secondary text-2xl font-bold text-dark dark:text-white">
              f4zzie<span className="text-primary dark:text-dm-primary">/MyNotes</span>
            </Link>
            <p className="mt-4 max-w-xl text-sm leading-7 text-text dark:text-dm-text">
              A cybersecurity research vault with {notes.length} notes across {categories.length} tracks:
              malware analysis, reverse engineering, binary exploitation, HTB, picoCTF, and resources.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-dark dark:text-white">Navigate</h3>
            <div className="mt-4 grid gap-2 text-sm font-bold">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/about" className="footer-link">About</Link>
              <Link to="/notes" className="footer-link">Notes</Link>
              <Link to="/projects" className="footer-link">Projects</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-dark dark:text-white">Follow</h3>
            <div className="mt-4 flex gap-3">
              <a href="https://github.com/f4zzie" target="_blank" rel="noreferrer" className="icon-link" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="https://x.com/_lazerguard" target="_blank" rel="noreferrer" className="icon-link" aria-label="X">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-border pt-6 text-sm text-light dark:border-dm-border">
          &copy; {new Date().getFullYear()} f4zzie. Built from the MyNotes vault.
        </p>
      </div>
    </footer>
  );
}
