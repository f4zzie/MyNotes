import { motion } from "framer-motion";
import Hero from "../components/Hero";
import NotesSection from "../components/NotesSection";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />

      {/* Main content + Sidebar (Geeky 8/4 split) */}
      <div className="container">
        <div className="flex flex-wrap items-start">
          <div className="w-full lg:w-8/12 mb-12 lg:mb-0">
            <NotesSection />
          </div>
          <Sidebar className="lg:mt-[9.5rem]" />
        </div>
      </div>
    </motion.div>
  );
}
