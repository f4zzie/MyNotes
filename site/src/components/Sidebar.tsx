import { Link } from "react-router-dom";
import { Github, NotebookTabs } from "lucide-react";
import { categories, notes } from "../data/notes";
import CategoryIcon from "./CategoryIcon";
import { getCategoryColor } from "./categoryMeta";

export default function Sidebar({ className = "" }: { className?: string }) {
  const maxCount = Math.max(...categories.map((category) => category.count));

  return (
    <aside className={`w-full lg:w-4/12 px-0 lg:px-6 ${className}`}>
      <div className="side-panel">
        <div className="flex items-center gap-4">
          <img
            src="https://github.com/f4zzie.png"
            alt="f4zzie"
            className="h-16 w-16 rounded-lg object-cover"
          />
          <div>
            <Link to="/" className="font-secondary text-xl font-bold text-dark dark:text-white">
              f4zzie
            </Link>
            <p className="text-sm text-text dark:text-dm-text">Cybersecurity learner</p>
          </div>
        </div>
        <p className="mt-5 text-sm leading-7 text-text dark:text-dm-text">
          Notes on malware static analysis, reverse engineering, exploitation,
          HTB machines, picoCTF 2026 solves, and practical security workflows.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="mini-stat">
            <strong>{notes.length}</strong>
            <span>notes</span>
          </div>
          <div className="mini-stat">
            <strong>{categories.length}</strong>
            <span>tracks</span>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <a href="https://github.com/f4zzie" target="_blank" rel="noreferrer" className="icon-link" aria-label="GitHub">
            <Github size={18} />
          </a>
          <a href="https://x.com/f4zzi3" target="_blank" rel="noreferrer" className="icon-link" aria-label="X">
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="side-panel mt-6">
        <div className="mb-5 flex items-center gap-2">
          <NotebookTabs size={19} className="text-primary dark:text-dm-primary" />
          <h4 className="text-lg font-bold">Archive Tracks</h4>
        </div>
        <ul className="space-y-4">
          {categories.map((category) => (
            <li key={category.name}>
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-sm font-bold text-dark dark:text-dm-dark">
                  <CategoryIcon
                    category={category.name}
                    size={16}
                    className="shrink-0"
                    style={{ color: getCategoryColor(category.name) }}
                  />
                  <span className="truncate">{category.name}</span>
                </span>
                <span className="text-xs font-bold text-light">{category.count}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-theme-light dark:bg-dm-theme-dark">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max((category.count / maxCount) * 100, 8)}%`,
                    backgroundColor: getCategoryColor(category.name),
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
