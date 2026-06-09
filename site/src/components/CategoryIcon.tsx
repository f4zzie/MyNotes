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
import type { CSSProperties } from "react";

type Props = {
  category: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
};

export default function CategoryIcon({
  category,
  size = 40,
  className = "text-primary",
  style,
}: Props) {
  const props = { size, className, style };

  switch (category) {
    case "Malware Analysis":
      return <Search {...props} />;
    case "Binary Exploitation":
    case "picoCTF - Binary Exploitation":
      return <Binary {...props} />;
    case "Reverse Engineering":
    case "picoCTF - Reverse Engineering":
      return <Bug {...props} />;
    case "HTB Writeup":
      return <Server {...props} />;
    case "CTF Writeup":
      return <Trophy {...props} />;
    case "picoCTF - Web Exploitation":
      return <Globe {...props} />;
    case "picoCTF - General Skills":
      return <Terminal {...props} />;
    case "picoCTF - Blockchain":
      return <LinkIcon {...props} />;
    case "Resources":
    default:
      return <BookOpen {...props} />;
  }
}
