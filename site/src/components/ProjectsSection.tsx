import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const projects = [
  {
    name: "MyNotes",
    description: "Cybersecurity notes & writeups — malware analysis, reverse engineering, binary exploitation, and CTF solutions. 69+ in-depth research notes covering RE, exploit development, PE analysis, process injection, and CTF challenges from picoCTF, HTB, THM, and CyberStudents.",
    language: "JavaScript",
    color: "#f1e05a",
    url: "https://github.com/f4zzie/MyNotes",
  },
];

export default function ProjectsSection() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title text-center">Projects</h2>

        <div className="rounded border border-border dark:border-dm-border px-6 pt-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-0">
            {projects.map((project, i) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="mb-8"
              >
                <div
                  className="relative rounded overflow-hidden bg-theme-light dark:bg-dm-theme-dark p-6"
                  style={{ minHeight: 120 }}
                >
                  <div className="absolute top-3 left-2 flex gap-2">
                    <span
                      className="inline-flex items-center h-7 px-3 text-white text-xs font-bold capitalize"
                      style={{ borderRadius: 35, backgroundColor: project.color }}
                    >
                      {project.language}
                    </span>
                  </div>
                  <div className="flex items-center justify-center h-full pt-4">
                    <span className="text-3xl font-secondary font-bold text-dark/20 dark:text-white/20 select-none">
                      {"{...}"}
                    </span>
                  </div>
                </div>

                <h3 className="text-[1.2rem] mb-2 mt-4">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-dark dark:text-white hover:text-primary dark:hover:text-dm-primary transition-colors"
                  >
                    {project.name}
                  </a>
                </h3>

                <div className="flex items-center space-x-4 text-xs font-secondary mb-2">
                  <span className="flex items-center gap-1.5 text-text dark:text-dm-text">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: project.color }}
                    />
                    {project.language}
                  </span>
                </div>

                <p className="text-text dark:text-dm-text text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary text-sm"
                  style={{ height: 40, padding: "8px 24px", fontSize: 13 }}
                >
                  <ExternalLink size={14} className="mr-1.5" />
                  View on GitHub
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
