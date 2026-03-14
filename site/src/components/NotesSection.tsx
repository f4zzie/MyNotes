import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  ExternalLink,
  Search,
  Binary,
  Bug,
  Server,
  Trophy,
  BookOpen,
  Globe,
  Terminal,
  Link as LinkIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import NoteModal from "./NoteModal";
import { notes } from "../data/notes";

const categoryIcons: Record<string, LucideIcon> = {
  "Malware Analysis": Search,
  "Binary Exploitation": Binary,
  "Reverse Engineering": Bug,
  "HTB Writeup": Server,
  "CTF Writeup": Trophy,
  Resources: BookOpen,
  "picoCTF - Binary Exploitation": Binary,
  "picoCTF - Reverse Engineering": Bug,
  "picoCTF - Web Exploitation": Globe,
  "picoCTF - General Skills": Terminal,
  "picoCTF - Blockchain": LinkIcon,
};

function CategoryIcon({ category, size = 40 }: { category: string; size?: number }) {
  const Icon = categoryIcons[category] || BookOpen;
  return <Icon size={size} className="text-primary/30 dark:text-dm-primary/30" />;
}

export default function NotesSection() {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const featured = notes[0];
  const sideList = notes.slice(1, 6);
  const recent = notes.slice(0, 6);
  const activeNote = notes.find((n) => n.id === selectedNote);

  return (
    <>
      <div className="section">
        <h2 className="section-title text-center">Featured Posts</h2>

        <div className="rounded border border-border dark:border-dm-border p-6">
          <div className="flex flex-wrap lg:flex-nowrap gap-6">
            {/* Left — Main Featured Post */}
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="post-card cursor-pointer"
                onClick={() => setSelectedNote(featured.id)}
              >
                <div className="relative rounded overflow-hidden bg-theme-light dark:bg-dm-theme-dark" style={{ minHeight: 208 }}>
                  <div className="flex items-center justify-center h-full p-8">
                    <CategoryIcon category={featured.category} size={64} />
                  </div>
                  <div className="absolute top-3 left-2 flex gap-2">
                    <span className="category-badge">{featured.category}</span>
                  </div>
                </div>
                <h3 className="text-[1.2rem] mb-2 mt-4">
                  <span className="block text-dark dark:text-white hover:text-primary dark:hover:text-dm-primary transition-colors">
                    {featured.title}
                  </span>
                </h3>
                <ul className="flex items-center space-x-4 mb-2">
                  <li className="flex items-center font-secondary text-xs text-text dark:text-dm-text">
                    <User size={12} className="mr-1.5" />
                    f4zzie
                  </li>
                  <li className="flex items-center font-secondary text-xs text-text dark:text-dm-text">
                    <Calendar size={12} className="mr-1.5" />
                    2025
                  </li>
                </ul>
                <p className="text-text dark:text-dm-text text-sm">
                  {featured.excerpt}
                </p>
                <span className="btn btn-outline-primary mt-4 text-sm" style={{ height: 40, padding: "8px 24px", fontSize: 13 }}>
                  Read More
                </span>
              </motion.div>
            </div>

            {/* Right — Scrollable mini post list */}
            <div className="w-full lg:w-1/2 max-h-[480px] overflow-y-auto">
              {sideList.map((note, i) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-start gap-3 pb-6 mb-6 cursor-pointer ${
                    i < sideList.length - 1 ? "border-b border-border dark:border-dm-border" : ""
                  }`}
                  onClick={() => setSelectedNote(note.id)}
                >
                  <div className="shrink-0 w-[105px] h-[85px] rounded bg-theme-light dark:bg-dm-theme-dark flex items-center justify-center overflow-hidden">
                    <CategoryIcon category={note.category} size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[1.1rem] mb-1 leading-tight">
                      <span className="text-dark dark:text-white hover:text-primary dark:hover:text-dm-primary transition-colors">
                        {note.title}
                      </span>
                    </h5>
                    <span className="inline-flex items-center font-secondary text-xs font-bold text-text dark:text-dm-text">
                      <Calendar size={11} className="mr-1.5" />
                      2025
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="section pt-0">
        <h2 className="section-title text-center">Recent Posts</h2>

        <div className="rounded border border-border dark:border-dm-border px-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
            {recent.map((note, i) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="mb-8 post-card cursor-pointer"
                onClick={() => setSelectedNote(note.id)}
              >
                <div className="relative rounded overflow-hidden bg-theme-light dark:bg-dm-theme-dark" style={{ aspectRatio: "405/208" }}>
                  <div className="flex items-center justify-center h-full">
                    <CategoryIcon category={note.category} size={48} />
                  </div>
                  <div className="absolute top-3 left-2 flex gap-2">
                    <span className="category-badge">{note.category}</span>
                  </div>
                </div>

                <h3 className="text-[1.2rem] mb-2 mt-4">
                  <span className="block text-dark dark:text-white hover:text-primary dark:hover:text-dm-primary transition-colors">
                    {note.title}
                  </span>
                </h3>

                <ul className="flex items-center space-x-4 mb-2">
                  <li className="flex items-center font-secondary text-xs text-text dark:text-dm-text leading-3">
                    <User size={12} className="mr-1.5" />
                    f4zzie
                  </li>
                  <li className="flex items-center font-secondary text-xs text-text dark:text-dm-text leading-3">
                    <Calendar size={12} className="mr-1.5" />
                    2025
                  </li>
                </ul>

                <p className="text-text dark:text-dm-text text-sm leading-relaxed">
                  {note.excerpt}
                </p>

                <span className="btn btn-outline-primary mt-4 text-sm" style={{ height: 40, padding: "8px 24px", fontSize: 13 }}>
                  Read More
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <a
            href="https://f4zzie.github.io/MyNotes"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            <ExternalLink size={16} className="mr-2" />
            View Full Notes Archive
          </a>
        </div>
      </div>

      {activeNote && (
        <NoteModal
          isOpen={!!selectedNote}
          onClose={() => setSelectedNote(null)}
          title={activeNote.title}
          content={activeNote.content}
          category={activeNote.category}
        />
      )}
    </>
  );
}
