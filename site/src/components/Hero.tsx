import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Shield, Terminal } from "lucide-react";
import { categories, notes } from "../data/notes";

const heroImage = `${import.meta.env.BASE_URL}images/Pasted_image_20251207191613.png`;

const getCount = (name: string) =>
  categories.find((category) => category.name === name)?.count || 0;

const picoCount = categories
  .filter((category) => category.name.startsWith("picoCTF"))
  .reduce((total, category) => total + category.count, 0);

const stats = [
  { label: "notes indexed", value: notes.length.toString() },
  { label: "picoCTF solves", value: picoCount.toString() },
  { label: "HTB writeups", value: getCount("HTB Writeup").toString() },
  { label: "malware labs", value: getCount("Malware Analysis").toString() },
];

const focusAreas = [
  {
    icon: Shield,
    title: "Malware Analysis",
    detail: "PE headers, APIs, strings, hashes, process injection, and static triage.",
  },
  {
    icon: Terminal,
    title: "Exploitation",
    detail: "Stack, heap, ROP, format strings, pwndbg workflows, and pwntools templates.",
  },
  {
    icon: BookOpen,
    title: "CTF Writeups",
    detail: "picoCTF 2026, HTB, THM, CyberStudents, web, blockchain, RE, and pwn.",
  },
];

export default function Hero() {
  return (
    <section className="hero-shell relative overflow-hidden text-white">
      <img
        src={heroImage}
        alt="Malware analysis lab screenshot"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#06111f]/85" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,17,31,0.96),rgba(6,17,31,0.76),rgba(6,17,31,0.9))]" />

      <div className="container relative py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-4xl"
        >
          <span className="eyebrow">f4zzie / MyNotes</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Cyber research notes for malware, reversing, exploitation, and CTFs.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            A living vault of practical writeups: static malware analysis,
            binary exploitation methodology, HTB attack chains, picoCTF 2026
            solves, and the tools that make the work repeatable.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/notes" className="btn btn-primary">
              Browse Notes
              <ArrowRight size={17} className="ml-2" />
            </Link>
            <Link to="/about" className="btn btn-ghost-light">
              Focus Areas
            </Link>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.06 }}
              className="stat-tile"
            >
              <span className="text-3xl font-bold text-white">{item.value}</span>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {focusAreas.map((area) => (
            <div key={area.title} className="focus-strip">
              <area.icon size={20} className="text-amber-300" />
              <div>
                <h3 className="text-sm font-bold text-white">{area.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-300">{area.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
