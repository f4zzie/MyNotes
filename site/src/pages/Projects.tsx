import { motion } from "framer-motion";
import ProjectsSection from "../components/ProjectsSection";

export default function Projects() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-kicker">
        <div className="container text-center">
          <span className="eyebrow text-primary dark:text-dm-primary">Build Log</span>
          <h1 className="mt-3 text-3xl font-bold lg:text-5xl">Projects</h1>
        </div>
      </div>
      <ProjectsSection />
    </motion.div>
  );
}
