import {
  Binary,
  BookOpen,
  Bug,
  Globe,
  Link as LinkIcon,
  Search,
  Server,
  Terminal,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  "Malware Analysis": Search,
  "Binary Exploitation": Binary,
  "Reverse Engineering": Bug,
  "HTB Writeup": Server,
  "CTF Writeup": Trophy,
  Resources: BookOpen,
  "picoCTF - Binary Exploitation": Binary,
  "picoCTF - Reverse Engineering": Bug,
  "picoCTF - Web Exploitation": Globe,
  "picoCTF - General Skills": Terminal,
  "picoCTF - Blockchain": LinkIcon,
};

const categoryColors: Record<string, string> = {
  "Malware Analysis": "#14b8a6",
  "Binary Exploitation": "#f59e0b",
  "Reverse Engineering": "#8b5cf6",
  "HTB Writeup": "#84cc16",
  "CTF Writeup": "#ef4444",
  Resources: "#0ea5e9",
  "picoCTF - Binary Exploitation": "#f97316",
  "picoCTF - Reverse Engineering": "#a855f7",
  "picoCTF - Web Exploitation": "#06b6d4",
  "picoCTF - General Skills": "#22c55e",
  "picoCTF - Blockchain": "#eab308",
};

export function getCategoryIcon(category: string) {
  return categoryIcons[category] || BookOpen;
}

export function getCategoryColor(category: string) {
  return categoryColors[category] || "#0f9f8f";
}
