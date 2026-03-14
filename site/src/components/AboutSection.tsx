import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="section mt-16">
      <div className="container text-center">
        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="https://github.com/f4zzie.png"
            alt="f4zzie"
            className="rounded-lg mb-8 mx-auto"
            style={{ maxWidth: 400 }}
          />
        </motion.div>

        <h1 className="text-left" style={{ fontSize: "clamp(28px, 4vw, 55px)" }}>
          About The Author
        </h1>

        <div className="content text-left mt-6">
          <p>
            I'm a cybersecurity learner focused on malware analysis and exploit
            development with a strong interest in understanding how malicious software
            operates at the lowest levels.
          </p>
          <p>
            I enjoy breaking down malicious software, understanding attacker
            techniques at a low level, and building tools to analyze, exploit,
            and mitigate threats. Currently deepening my skills in advanced
            binary exploitation, Windows & Linux memory corruption, and C2
            mechanisms.
          </p>
          <p>
            Open to collaboration on open-source security tools and defensive
            projects.
          </p>
        </div>

        {/* Education + Experience grid */}
        <div className="flex flex-wrap mt-24 text-left gap-6 lg:flex-nowrap">
          {/* Focus Areas */}
          <div className="w-full lg:w-1/2">
            <div className="rounded border border-border dark:border-dm-border p-6">
              <h2 className="section-title mb-12">Focus Areas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {[
                  { title: "Malware Analysis", desc: "Static & dynamic analysis, PE triage, behavioral monitoring" },
                  { title: "Reverse Engineering", desc: "Ghidra, IDA, x64dbg — decompilation & binary patching" },
                  { title: "Binary Exploitation", desc: "Buffer overflows, ROP chains, heap exploitation, format strings" },
                  { title: "Threat Intelligence", desc: "IOC extraction, YARA rules, campaign tracking" },
                ].map((item) => (
                  <div key={item.title}>
                    <h4 className="text-base lg:text-[22px]">{item.title}</h4>
                    <p className="mt-2 text-text dark:text-dm-text">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills / Experience */}
          <div className="w-full lg:w-1/2">
            <div className="rounded border border-border dark:border-dm-border p-6">
              <h2 className="section-title mb-12">Skills & Tools</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  "Malware Reverse Engineering",
                  "Static & Dynamic Analysis",
                  "Exploit Development",
                  "Windows Internals",
                  "PE Analysis & Triage",
                  "Process Injection",
                  "x86/x64 Assembly",
                  "Buffer Overflows & ROP",
                  "Threat Intelligence",
                  "CTF Competitions",
                ].map((skill) => (
                  <li key={skill} className="experience-item text-lg font-bold text-dark dark:text-dm-dark">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
