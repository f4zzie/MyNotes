import { motion } from "framer-motion";
import Hero from "../components/Hero";
import NotesSection from "../components/NotesSection";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />

      <div className="container">
        <NotesSection />
      </div>
    </motion.div>
  );
}
