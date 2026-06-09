import { motion } from "framer-motion";
import { Binary, Bug, Crosshair, FileSearch, ShieldCheck, Terminal } from "lucide-react";
import { categories, notes } from "../data/notes";

const focusAreas = [
  {
    icon: FileSearch,
    title: "Malware Static Analysis",
    desc: "Hashing, strings, PE headers, Windows APIs, process injection patterns, and sandbox triage notes.",
  },
  {
    icon: Binary,
    title: "Binary Exploitation",
    desc: "Stack and heap exploitation, ROP, format strings, protections, pwndbg, GDB, and pwntools templates.",
  },
  {
    icon: Bug,
    title: "Reverse Engineering",
    desc: "Crackmes, hidden cipher challenges, instrumentation writeups, x86 assembly, Ghidra, Cutter, and x64dbg.",
  },
  {
    icon: Crosshair,
    title: "CTF Attack Chains",
    desc: "picoCTF, HTB, THM, and CyberStudents writeups with commands, reasoning, and verification steps.",
  },
];

const toolStack = [
  "Ghidra",
  "Cutter",
  "IDA Free",
  "x64dbg",
  "GDB",
  "pwndbg",
  "pwntools",
  "nmap",
  "ffuf",
  "sqlmap",
  "hashcat",
  "john",
  "Wireshark",
  "solc",
  "ethers.js",
];

export default function AboutSection() {
  const picoCount = categories
    .filter((category) => category.name.startsWith("picoCTF"))
    .reduce((total, category) => total + category.count, 0);

  return (
    <section className="section">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-lg border border-border bg-theme-light dark:border-dm-border dark:bg-dm-theme-dark"
          >
            <img
              src="https://github.com/f4zzie.png"
              alt="f4zzie"
              className="aspect-square w-full object-cover"
            />
          </motion.div>

          <div>
            <span className="eyebrow text-primary dark:text-dm-primary">About The Author</span>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Security learner building a practical research vault.</h1>
            <div className="content mt-6">
              <p>
                I’m focused on malware analysis, reverse engineering, exploit
                development, and CTF problem solving. MyNotes is where I turn
                those reps into readable walkthroughs, command references, and
                technique notes I can revisit.
              </p>
              <p>
                The site now indexes {notes.length} notes, including {picoCount} picoCTF
                entries, HTB machine attack chains, malware static-analysis
                references, and binary exploitation methodology.
              </p>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3">
              <div className="mini-stat">
                <strong>{notes.length}</strong>
                <span>notes</span>
              </div>
              <div className="mini-stat">
                <strong>{categories.length}</strong>
                <span>tracks</span>
              </div>
              <div className="mini-stat">
                <strong>{picoCount}</strong>
                <span>picoCTF</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {focusAreas.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="feature-panel"
            >
              <item.icon size={24} className="text-primary dark:text-dm-primary" />
              <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-text dark:text-dm-text">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="feature-panel">
            <ShieldCheck size={24} className="text-primary dark:text-dm-primary" />
            <h2 className="mt-4 text-2xl font-bold">Research Style</h2>
            <p className="mt-3 text-sm leading-7 text-text dark:text-dm-text">
              The notes favor attack-chain clarity: recon, why each step
              matters, exploitation, verification, root cause, and mitigation
              where it fits.
            </p>
          </div>

          <div className="feature-panel">
            <Terminal size={24} className="text-primary dark:text-dm-primary" />
            <h2 className="mt-4 text-2xl font-bold">Tooling Seen In The Vault</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {toolStack.map((tool) => (
                <span key={tool} className="tool-pill">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
