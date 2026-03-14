import FadeIn from "./FadeIn";
import {
  Bug,
  Search,
  Swords,
  Binary,
  Monitor,
  FileCode,
  Shield,
  Layers,
  Syringe,
  Cpu,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";

const skills = [
  { name: "Malware Reverse Engineering", icon: Bug },
  { name: "Static & Dynamic Analysis", icon: Search },
  { name: "Exploit Development", icon: Swords },
  { name: "Binary Exploitation", icon: Binary },
  { name: "Windows Internals", icon: Monitor },
  { name: "PE Analysis", icon: FileCode },
  { name: "Threat Intelligence", icon: Shield },
  { name: "Buffer Overflows", icon: Layers },
  { name: "Process Injection", icon: Syringe },
  { name: "x86 Assembly", icon: Cpu },
  { name: "CTF Solving", icon: Trophy },
];

export default function Skills() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-dark-card/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Skills & Expertise
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Core competencies in offensive security and malware analysis
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((skill, i) => (
            <FadeIn key={skill.name} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="group p-5 rounded-xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-default"
              >
                <skill.icon
                  size={24}
                  className="text-primary mb-3 group-hover:scale-110 transition-transform"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {skill.name}
                </span>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
