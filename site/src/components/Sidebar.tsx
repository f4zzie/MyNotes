import { Github } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "../data/notes";

export default function Sidebar({ className = "" }: { className?: string }) {
  return (
    <aside className={`w-full lg:w-4/12 px-0 lg:px-6 ${className}`}>
      {/* About Widget */}
      <div className="relative rounded border border-border dark:border-dm-border p-6 text-center">
        <Link
          to="/"
          className="font-secondary text-xl font-bold text-dark dark:text-white"
        >
          f4zzie
        </Link>
        <p className="mt-4 text-text dark:text-dm-text text-sm">
          Cybersecurity Learner focused on Malware Analysis, Reverse Engineering & Exploit Development.
        </p>
        <div className="socials mt-6 justify-center border-x border-primary dark:border-dm-primary px-4 inline-flex">
          <a href="https://github.com/f4zzie" target="_blank" rel="noreferrer">
            <Github size={18} />
          </a>
          <a href="https://x.com/_lazerguard" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Categories Widget */}
      <div className="mt-6 rounded border border-border dark:border-dm-border p-6">
        <h4 className="section-title mb-12 text-center">Categories</h4>
        <ul>
          {categories.map((cat, i) => (
            <li
              key={cat.name}
              className={`relative mb-2 flex items-center justify-between pl-6 text-base font-bold capitalize text-dark dark:text-dm-dark ${
                i < categories.length - 1
                  ? "pb-2 border-b border-border dark:border-dm-border"
                  : ""
              }`}
            >
              {/* Green chevron */}
              <svg
                className="absolute left-0 top-1"
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="var(--color-primary)"
              >
                <path d="M7.3 4.3a1 1 0 011.4 0l5 5a1 1 0 010 1.4l-5 5a1 1 0 01-1.4-1.4L11.58 10 7.3 5.7a1 1 0 010-1.4z" />
              </svg>
              <span>{cat.name}</span>
              <span className="text-[10px] text-light">{cat.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
