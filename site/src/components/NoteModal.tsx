import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  category: string;
}

export default function NoteModal({ isOpen, onClose, title, content, category }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 pt-20 pb-10"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-2xl w-full max-w-4xl shadow-2xl border border-border dark:border-dm-border bg-body dark:bg-dm-body"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-dm-border">
              <div>
                <span className="category-badge">{category}</span>
                <h2 className="text-xl font-bold mt-2 text-dark dark:text-white">
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors text-light hover:text-dark dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="content px-6 py-6 max-h-[70vh] overflow-y-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
