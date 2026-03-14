import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  User,
  ExternalLink,
  Search,
  Binary,
  Bug,
  Server,
  Trophy,
  Globe,
  Terminal,
  Link as LinkIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { notes, categories } from "../data/notes";
import NoteModal from "../components/NoteModal";
import Sidebar from "../components/Sidebar";

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

export default function Notes() {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const activeNote = notes.find((n) => n.id === selectedNote);
  const filtered = filter ? notes.filter((n) => n.category === filter) : notes;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Page title bar */}
      <div className="py-12 text-center bg-theme-light dark:bg-dm-theme-dark">
        <h1 className="text-3xl lg:text-[55px] font-bold">
          Research & Writeups
        </h1>
      </div>

      <div className="section">
        <div className="container">
          {/* Category filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <button
              onClick={() => setFilter(null)}
              className={`btn text-sm ${!filter ? "btn-primary" : "btn-outline-primary"}`}
              style={{ height: 36, padding: "6px 16px", fontSize: 12 }}
            >
              All ({notes.length})
            </button>
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.name] || BookOpen;
              return (
                <button
                  key={cat.name}
                  onClick={() => setFilter(cat.name === filter ? null : cat.name)}
                  className={`btn text-sm ${filter === cat.name ? "btn-primary" : "btn-outline-primary"}`}
                  style={{ height: 36, padding: "6px 16px", fontSize: 12 }}
                >
                  <Icon size={13} className="mr-1 inline" />
                  {cat.name} ({cat.count})
                </button>
              );
            })}
          </div>

          {/* Content + Sidebar */}
          <div className="flex flex-wrap items-start">
            <div className="w-full lg:w-8/12 mb-12 lg:mb-0">
              <div className="rounded border border-border dark:border-dm-border p-4 px-3 lg:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
                  {filtered.map((note, i) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                      className="mb-8 post-card cursor-pointer"
                      onClick={() => setSelectedNote(note.id)}
                    >
                      <div
                        className="relative rounded overflow-hidden bg-theme-light dark:bg-dm-theme-dark"
                        style={{ aspectRatio: "405/208" }}
                      >
                        <div className="flex items-center justify-center h-full">
                          <CategoryIcon category={note.category} size={44} />
                        </div>
                        <div className="absolute top-3 left-2 flex gap-2">
                          <span className="category-badge">{note.category}</span>
                        </div>
                      </div>

                      <h3 className="text-[1.1rem] mb-2 mt-4">
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

                      <span
                        className="btn btn-outline-primary mt-4 text-sm"
                        style={{ height: 38, padding: "8px 20px", fontSize: 12 }}
                      >
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

            <Sidebar />
          </div>
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
    </motion.div>
  );
}
