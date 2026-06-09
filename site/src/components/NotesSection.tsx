import { useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Layers, User } from "lucide-react";
import NoteModal from "./NoteModal";
import CategoryIcon from "./CategoryIcon";
import { getCategoryColor } from "./categoryMeta";
import { categories, notes } from "../data/notes";
import type { Note } from "../data/notes";

const featuredIds = [
  "htb-facts-writeup",
  "htb-wingdata-writeup",
  "advanced-static-ana",
  "binary-exploitation-methodology",
  "reentrance",
  "hashgate",
];

const featuredNotes = featuredIds
  .map((id) => notes.find((note) => note.id === id))
  .filter(Boolean) as Note[];

const trackSummaries = [
  {
    title: "Malware Static Analysis",
    category: "Malware Analysis",
    detail: "From hashes and strings to PE structure, suspicious APIs, and injection patterns.",
  },
  {
    title: "Binary Exploitation Lab",
    category: "Binary Exploitation",
    detail: "A repeatable pwn workflow covering stack, heap, ROP, format strings, and tooling.",
  },
  {
    title: "picoCTF 2026 Sprint",
    category: "picoCTF - Reverse Engineering",
    detail: "A broad set of solved web, blockchain, pwn, RE, and general skills challenges.",
  },
];

export default function NotesSection() {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const activeNote = notes.find((note) => note.id === selectedNote);

  return (
    <>
      <section className="section">
        <div className="section-heading">
          <span className="eyebrow text-primary dark:text-dm-primary">Field Notes</span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Featured Work From The Vault
          </h2>
          <p className="mt-4 max-w-2xl text-text dark:text-dm-text">
            The archive is organized around practical security work: reversing
            binaries, documenting attack chains, preserving tools, and turning
            challenge solves into reusable technique notes.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {featuredNotes.map((note, index) => (
            <motion.button
              key={note.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="note-card text-left"
              onClick={() => setSelectedNote(note.id)}
            >
              <div className="flex items-start gap-4">
                <div
                  className="note-icon"
                  style={{ "--accent": getCategoryColor(note.category) } as CSSProperties}
                >
                  <CategoryIcon category={note.category} size={24} className="text-white" />
                </div>
                <div className="min-w-0">
                  <span className="category-badge">{note.category}</span>
                  <h3 className="mt-3 text-xl font-bold text-dark dark:text-white">
                    {note.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-text dark:text-dm-text">
                    {note.excerpt}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-[0.12em] text-light">
                <span className="inline-flex items-center gap-2">
                  <User size={13} />
                  f4zzie
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock size={13} />
                  Research note
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {trackSummaries.map((track) => {
            const count = categories.find((category) => category.name === track.category)?.count || 0;
            return (
              <div key={track.title} className="track-card">
                <div className="flex items-center justify-between gap-4">
                  <CategoryIcon category={track.category} size={24} className="text-primary dark:text-dm-primary" />
                  <span className="text-sm font-bold text-dark dark:text-white">{count} notes</span>
                </div>
                <h3 className="mt-4 text-lg font-bold">{track.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text dark:text-dm-text">
                  {track.detail}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 dark:border-dm-border">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-dark dark:text-white">
            <Layers size={18} className="text-primary dark:text-dm-primary" />
            {notes.length} notes across {categories.length} categories
          </div>
          <Link to="/notes" className="btn btn-outline-primary">
            Open Archive
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </section>

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
