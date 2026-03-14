import { motion } from "framer-motion";
import AboutSection from "../components/AboutSection";

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AboutSection />
    </motion.div>
  );
}
