import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import { ArrowRight, ExternalLink, FolderGit2 } from "lucide-react";
import { motion } from "framer-motion";
import { categories, notes } from "../data/notes";
import CategoryIcon from "./CategoryIcon";
import { getCategoryColor } from "./categoryMeta";

const countFor = (name: string) =>
  categories.find((category) => category.name === name)?.count || 0;

const picoCount = categories
  .filter((category) => category.name.startsWith("picoCTF"))
  .reduce((total, category) => total + category.count, 0);

const projects = [
  {
    name: "MyNotes Research Vault",
    category: "Resources",
    count: notes.length,
    description:
      "A React/Tailwind site generated from an Obsidian-style cybersecurity vault, with searchable writeups rendered as readable markdown modals.",
    tags: ["React", "Tailwind", "Markdown", "GitHub Pages"],
    url: "https://github.com/f4zzie/MyNotes",
  },
  {
    name: "Malware Static Analysis Notebook",
    category: "Malware Analysis",
    count: countFor("Malware Analysis"),
    description:
      "Reference notes for analyzing suspicious Windows binaries through hashes, strings, PE headers, APIs, and injection indicators.",
    tags: ["PE", "Windows API", "FLOSS", "Ghidra"],
  },
  {
    name: "Binary Exploitation Lab",
    category: "Binary Exploitation",
    count: countFor("Binary Exploitation"),
    description:
      "A technique library for memory corruption: stack frames, heap behavior, mitigations, ROP chains, format strings, and exploit templates.",
    tags: ["GDB", "pwndbg", "pwntools", "ROP"],
  },
  {
    name: "picoCTF 2026 Writeup Sprint",
    category: "picoCTF - General Skills",
    count: picoCount,
    description:
      "Challenge writeups across binary exploitation, reverse engineering, web exploitation, blockchain, and general skills.",
    tags: ["picoCTF", "Web", "RE", "Blockchain"],
  },
  {
    name: "HTB Machine Playbooks",
    category: "HTB Writeup",
    count: countFor("HTB Writeup"),
    description:
      "End-to-end attack chains for HTB content, including Facts and WingData machine notes with recon, foothold, lateral movement, and root paths.",
    tags: ["HTB", "nmap", "ffuf", "Privilege Escalation"],
  },
];

export default function ProjectsSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading text-center">
          <span className="eyebrow text-primary dark:text-dm-primary">Projects</span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Work Streams In The Vault</h2>
          <p className="mx-auto mt-4 max-w-2xl text-text dark:text-dm-text">
            Each project below points to a real cluster of notes in the folder:
            practical research, repeatable commands, and challenge writeups.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="project-card"
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className="note-icon"
                  style={{ "--accent": getCategoryColor(project.category) } as CSSProperties}
                >
                  <CategoryIcon category={project.category} size={24} className="text-white" />
                </div>
                <span className="text-sm font-bold text-dark dark:text-white">
                  {project.count} notes
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold">{project.name}</h3>
              <p className="mt-3 text-sm leading-7 text-text dark:text-dm-text">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="tool-pill">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/notes" className="btn btn-outline-primary text-sm">
                  <FolderGit2 size={15} className="mr-2" />
                  View Notes
                </Link>
                {project.url && (
                  <a href={project.url} target="_blank" rel="noreferrer" className="btn btn-link-clean text-sm">
                    GitHub
                    <ExternalLink size={14} className="ml-2" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/notes" className="btn btn-primary">
            Browse All Research
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
