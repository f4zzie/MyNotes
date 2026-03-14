import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="section relative pb-0">
      {/* Background shape */}
      <div className="absolute bottom-0 left-0 w-full -z-10">
        <svg viewBox="0 0 1905 295" preserveAspectRatio="none" className="w-full" style={{ height: 200 }}>
          <path
            d="M0 295V80C300 20 600 0 952 40C1304 80 1605 60 1905 0V295H0Z"
            className="fill-theme-light dark:fill-dm-theme-dark"
          />
        </svg>
      </div>

      <div className="container">
        <div className="flex flex-wrap-reverse items-center justify-center lg:flex-row">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center lg:mt-0 lg:text-left lg:w-1/2 lg:pr-8"
          >
            <h1
              className="font-bold leading-none"
              style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
            >
              Hey, I'm{" "}
              <strong className="text-primary dark:text-dm-primary">f4zzie</strong>
              <br />
              <span className="font-bold" style={{ fontSize: "clamp(30px, 4vw, 55px)" }}>
                Malware Addict
              </span>
            </h1>
            <p className="mt-4 text-text dark:text-dm-text text-lg max-w-lg">
              Cybersecurity Learner | Reverse Engineering &bull; Exploit Development &bull; Threat Intelligence
            </p>
            <a
              href="#/notes"
              className="btn btn-primary mt-6"
            >
              Explore My World
            </a>
          </motion.div>

          {/* Right - Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-9/12 lg:w-1/2 flex justify-center"
          >
            <img
              src="https://github.com/f4zzie.png"
              alt="f4zzie"
              className="mx-auto object-contain rounded-2xl"
              style={{ maxWidth: 400, maxHeight: 400 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
