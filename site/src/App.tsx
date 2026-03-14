import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Notes from "./pages/Notes";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { dark, toggle } = useTheme();
  const location = useLocation();

  return (
    <div className={`min-h-screen flex flex-col ${dark ? "bg-dark" : "bg-light"}`}>
      <Navbar dark={dark} toggleTheme={toggle} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/notes" element={<Notes />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
