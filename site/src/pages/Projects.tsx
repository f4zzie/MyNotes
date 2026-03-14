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
      {/* Page title bar */}
      <div
        className="py-12 text-center"
        style={{ backgroundColor: "var(--color-theme-light)" }}
      >
        <h1 className="text-3xl lg:text-[55px] font-bold">Projects</h1>
      </div>
      <ProjectsSection />
    </motion.div>
  );
}
