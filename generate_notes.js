#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BASE = '/home/kali/Desktop/MyNotes';

// Define all 68 notes with their file paths, categories, and excerpts
const noteConfigs = [
  // ============================================================
  // MALWARE BABY/STATIC ANALYSIS -> "Malware Analysis" (8 files)
  // ============================================================
  {
    file: 'MALWARE BABY/STATIC ANALYSIS/ADVANCED STATIC ANA.md',
    category: 'Malware Analysis',
    excerpt: 'Deep dive into advanced static analysis techniques including IDA Pro disassembly, Ghidra decompilation, and identifying malicious code patterns without executing the binary.'
  },
  {
    file: 'MALWARE BABY/STATIC ANALYSIS/MD5 CHECK.md',
    category: 'Malware Analysis',
    excerpt: 'Using MD5 hashes for malware identification and verification, including command-line tools and online lookup databases like VirusTotal.'
  },
  {
    file: 'MALWARE BABY/STATIC ANALYSIS/MALWARE API.md',
    category: 'Malware Analysis',
    excerpt: 'Analysis of common Windows API calls used by malware for file operations, process manipulation, registry modifications, and network communication.'
  },
  {
    file: 'MALWARE BABY/STATIC ANALYSIS/STRINGS.md',
    category: 'Malware Analysis',
    excerpt: 'Extracting and analyzing strings from malware samples using the strings utility and FLOSS for deobfuscating encoded or obfuscated strings.'
  },
  {
    file: 'MALWARE BABY/STATIC ANALYSIS/SHA256 CHECK.md',
    category: 'Malware Analysis',
    excerpt: 'Using SHA256 hashes for malware sample verification and identification, including cross-referencing with threat intelligence databases.'
  },
  {
    file: 'MALWARE BABY/STATIC ANALYSIS/PROCESS INJECTION.md',
    category: 'Malware Analysis',
    excerpt: 'Comprehensive overview of process injection techniques including DLL injection, process hollowing, APC injection, and thread execution hijacking.'
  },
  {
    file: 'MALWARE BABY/STATIC ANALYSIS/PE HEADERS.md',
    category: 'Malware Analysis',
    excerpt: 'Analyzing Portable Executable headers including DOS header, COFF header, optional header, section tables, Import Address Table, and detecting packed binaries.'
  },
  {
    file: 'MALWARE BABY/STATIC ANALYSIS/WINDOWS API.md',
    category: 'Malware Analysis',
    excerpt: 'Reference guide for Windows API functions commonly encountered in malware analysis, covering kernel32.dll, ntdll.dll, and user32.dll function families.'
  },

  // ============================================================
  // RE/BINARY EXPLOITATION -> "Binary Exploitation" (14 files)
  // ============================================================
  {
    file: 'RE/BINARY EXPLOITATION/BINARY EXPLOITATION METHODOLOGY.md',
    category: 'Binary Exploitation',
    excerpt: 'Complete methodology for approaching binary exploitation challenges, from initial reconnaissance through vulnerability identification to working exploit development.'
  },
  {
    file: 'RE/BINARY EXPLOITATION/INTRO TO BUFFER OVERFLOWS.md',
    category: 'Binary Exploitation',
    excerpt: 'Introduction to buffer overflow vulnerabilities including tool setup, essential GDB commands, and understanding memory corruption fundamentals.'
  },
  {
    file: 'RE/BINARY EXPLOITATION/HEAP/HEAP EXPLOITATION.md',
    category: 'Binary Exploitation',
    excerpt: 'Heap exploitation techniques covering heap memory management, use-after-free, double-free, heap overflow, and tcache poisoning attacks.'
  },
  {
    file: 'RE/BINARY EXPLOITATION/FORMAT STRINGS.md',
    category: 'Binary Exploitation',
    excerpt: 'Format string vulnerability exploitation including reading from and writing to arbitrary memory addresses using printf format specifiers.'
  },
  {
    file: 'RE/BINARY EXPLOITATION/LTRACE(strace).md',
    category: 'Binary Exploitation',
    excerpt: 'Dynamic analysis using ltrace and strace to trace library calls and system calls, revealing runtime behavior of binary executables.'
  },
  {
    file: 'RE/BINARY EXPLOITATION/PROTECTIONS/BINARY PROTECTIONS & BYPASSES.md',
    category: 'Binary Exploitation',
    excerpt: 'Overview of binary security protections including NX, stack canaries, PIE, RELRO, and ASLR along with techniques to bypass each protection.'
  },
  {
    file: 'RE/BINARY EXPLOITATION/STACK.md',
    category: 'Binary Exploitation',
    excerpt: 'Understanding the call stack architecture including stack frames, registers (EBP, ESP, EIP), function prologues and epilogues, and stack-based memory layout.'
  },
  {
    file: 'RE/BINARY EXPLOITATION/PRACTICE PLATFORMS/PRACTICE PLATFORMS.md',
    category: 'Binary Exploitation',
    excerpt: 'Curated list of platforms for practicing binary exploitation skills including wargames, CTF archives, and vulnerable-by-design applications.'
  },
  {
    file: 'RE/BINARY EXPLOITATION/STACK OVERFLOW.md',
    category: 'Binary Exploitation',
    excerpt: 'Stack-based buffer overflow exploitation covering return address overwrite, shellcode injection, NOP sleds, and controlling program execution flow.'
  },
  {
    file: 'RE/BINARY EXPLOITATION/ROP/ROP FUNDAMENTALS.md',
    category: 'Binary Exploitation',
    excerpt: 'Return-oriented programming fundamentals including gadget discovery, chain construction, ret2libc, and bypassing NX protection through code reuse attacks.'
  },
  {
    file: 'RE/BINARY EXPLOITATION/TOOLS & TEMPLATES/GDB & DEBUGGING TOOLS.md',
    category: 'Binary Exploitation',
    excerpt: 'Comprehensive guide to GDB and debugging tools for binary exploitation, including breakpoints, memory examination, and essential debugging workflows.'
  },
  {
    file: 'RE/BINARY EXPLOITATION/PWNDBG.md',
    category: 'Binary Exploitation',
    excerpt: 'Guide to using pwndbg, a GDB plugin for exploit development, covering its enhanced commands for heap analysis, register display, and memory inspection.'
  },
  {
    file: 'RE/BINARY EXPLOITATION/TOOLS & TEMPLATES/PWNTOOLS TEMPLATE.md',
    category: 'Binary Exploitation',
    excerpt: 'Reusable pwntools exploit template with boilerplate for local and remote connections, ELF loading, ROP chain building, and payload construction.'
  },
  {
    file: 'RE/BINARY EXPLOITATION/x86_ASS_IMPLEMENTATIONS.md',
    category: 'Binary Exploitation',
    excerpt: 'x86 assembly language implementations covering common patterns, instruction set reference, calling conventions, and translating C to assembly.'
  },

  // ============================================================
  // RE/CRACKMES -> "Reverse Engineering" (1 file)
  // ============================================================
  {
    file: 'RE/CRACKMES/SEGFAULT.md',
    category: 'Reverse Engineering',
    excerpt: 'Crackme writeup for SEGFAULT challenge, demonstrating reverse engineering techniques to find the correct input that satisfies binary validation checks.'
  },

  // ============================================================
  // HTB/RE/SIMPLE ENCRYPTOR -> "HTB Writeup" (1 file)
  // ============================================================
  {
    file: 'HTB/RE/SIMPLE ENCRYPTOR/WRITEUP.md',
    category: 'HTB Writeup',
    excerpt: 'HackTheBox Simple Encryptor challenge writeup, reversing a PRNG-based file encryption scheme by recovering the seed and decrypting the flag.'
  },

  // ============================================================
  // HTB/SHERLOCKS -> "HTB Writeup" (1 file)
  // ============================================================
  {
    file: 'HTB/SHERLOCKS/SECRETPICTURES.md',
    category: 'HTB Writeup',
    excerpt: 'HackTheBox Sherlocks SecretPictures investigation writeup involving digital forensics analysis to uncover hidden data within image files.'
  },

  // ============================================================
  // CYBERSTUDENTS -> "CTF Writeup" (4 files)
  // ============================================================
  {
    file: 'CYBERSTUDENTS/DAY 1.md',
    category: 'CTF Writeup',
    excerpt: 'CyberStudents Day 1 challenge covering binary to ASCII, hex decoding, and Base64 encoding and decoding transformations to recover hidden flags.'
  },
  {
    file: 'CYBERSTUDENTS/DAY 2.md',
    category: 'CTF Writeup',
    excerpt: 'CyberStudents Day 2 challenge involving Wireshark packet capture analysis to extract credentials and hidden data from network traffic.'
  },
  {
    file: 'CYBERSTUDENTS/DAY 3.md',
    category: 'CTF Writeup',
    excerpt: 'CyberStudents Day 3 challenge performing DNS chain reconnaissance to discover hidden subdomains and extract flag data from DNS records.'
  },
  {
    file: 'CYBERSTUDENTS/DAY 4.md',
    category: 'CTF Writeup',
    excerpt: 'CyberStudents Day 4 challenge writeup covering additional CTF techniques and problem-solving approaches for flag discovery.'
  },

  // ============================================================
  // THM/RE -> "Reverse Engineering" (1 file)
  // ============================================================
  {
    file: 'THM/RE/INTRO.md',
    category: 'Reverse Engineering',
    excerpt: 'TryHackMe introduction to reverse engineering covering fundamental concepts, tools setup, and basic binary analysis techniques for beginners.'
  },

  // ============================================================
  // RESOURCES -> "Resources" (1 file)
  // ============================================================
  {
    file: 'RESOURCES/HACKING RESOURCES.md',
    category: 'Resources',
    excerpt: 'Curated collection of hacking and cybersecurity resources including learning platforms, tools, reference materials, and practice environments.'
  },

  // ============================================================
  // pico2026CTF/Binary Exploitation -> "picoCTF - Binary Exploitation" (8 files)
  // ============================================================
  {
    file: 'pico2026CTF/Binary Exploitation/01_quizploit_writeup.md',
    category: 'picoCTF - Binary Exploitation',
    excerpt: 'picoCTF Quizploit writeup exploiting a quiz application through buffer overflow to redirect execution and capture the flag.'
  },
  {
    file: 'pico2026CTF/Binary Exploitation/02_echo_escape_2_writeup.md',
    category: 'picoCTF - Binary Exploitation',
    excerpt: 'picoCTF Echo Escape 2 writeup using format string vulnerabilities to leak and overwrite memory for shell access.'
  },
  {
    file: 'pico2026CTF/Binary Exploitation/03_tea-cash_writeup.md',
    category: 'picoCTF - Binary Exploitation',
    excerpt: 'picoCTF Tea-Cash writeup exploiting a virtual currency application through integer overflow or logic flaws to gain unauthorized funds.'
  },
  {
    file: 'pico2026CTF/Binary Exploitation/04_echo_escape_1_writeup.md',
    category: 'picoCTF - Binary Exploitation',
    excerpt: 'picoCTF Echo Escape 1 writeup leveraging format string bugs in an echo service to read sensitive memory and extract the flag.'
  },
  {
    file: 'pico2026CTF/Binary Exploitation/05_heap_havoc_writeup.md',
    category: 'picoCTF - Binary Exploitation',
    excerpt: 'picoCTF Heap Havoc writeup exploiting heap memory management flaws including use-after-free or heap overflow to gain code execution.'
  },
  {
    file: 'pico2026CTF/Binary Exploitation/06_pizza_router_writeup.md',
    category: 'picoCTF - Binary Exploitation',
    excerpt: 'picoCTF Pizza Router writeup exploiting a routing application through buffer overflow or command injection to capture the flag.'
  },
  {
    file: 'pico2026CTF/Binary Exploitation/07_offset-cycle_writeup.md',
    category: 'picoCTF - Binary Exploitation',
    excerpt: 'picoCTF Offset Cycle writeup solving a binary exploitation challenge involving cyclic offset calculation and return address control.'
  },
  {
    file: 'pico2026CTF/Binary Exploitation/08_offset-cycleV2_writeup.md',
    category: 'picoCTF - Binary Exploitation',
    excerpt: 'picoCTF Offset Cycle V2 writeup building on the first version with additional protections requiring more advanced exploitation techniques.'
  },

  // ============================================================
  // pico2026CTF/Reverse Engineering -> "picoCTF - Reverse Engineering" (11 files)
  // ============================================================
  {
    file: 'pico2026CTF/Reverse Engineering/01_hidden_cipher_1_writeup.md',
    category: 'picoCTF - Reverse Engineering',
    excerpt: 'picoCTF Hidden Cipher 1 writeup reversing an encryption algorithm to decode the hidden flag from ciphertext output.'
  },
  {
    file: 'pico2026CTF/Reverse Engineering/02_hidden_cipher_2_writeup.md',
    category: 'picoCTF - Reverse Engineering',
    excerpt: 'picoCTF Hidden Cipher 2 writeup tackling a more complex cipher implementation requiring deeper static analysis to reverse the encoding.'
  },
  {
    file: 'pico2026CTF/Reverse Engineering/03_bypass_me_writeup.md',
    category: 'picoCTF - Reverse Engineering',
    excerpt: 'picoCTF Bypass Me writeup patching or reversing binary validation logic to bypass authentication checks and reveal the flag.'
  },
  {
    file: 'pico2026CTF/Reverse Engineering/04_add_on_trap_writeup.md',
    category: 'picoCTF - Reverse Engineering',
    excerpt: 'picoCTF Add On Trap writeup analyzing a binary with anti-debugging traps and reversing the validation to extract the correct flag.'
  },
  {
    file: 'pico2026CTF/Reverse Engineering/05_silent_stream_writeup.md',
    category: 'picoCTF - Reverse Engineering',
    excerpt: 'picoCTF Silent Stream writeup recovering hidden data from a binary that outputs the flag through non-obvious channels or side effects.'
  },
  {
    file: 'pico2026CTF/Reverse Engineering/06_autorev_1_writeup.md',
    category: 'picoCTF - Reverse Engineering',
    excerpt: 'picoCTF AutoRev 1 writeup using automated reverse engineering tools like angr or Z3 to solve constraint-based flag validation.'
  },
  {
    file: 'pico2026CTF/Reverse Engineering/07_secure_password_database_writeup.md',
    category: 'picoCTF - Reverse Engineering',
    excerpt: 'picoCTF Secure Password Database writeup reversing a password database application to extract stored credentials and recover the flag.'
  },
  {
    file: 'pico2026CTF/Reverse Engineering/08_bin_ins3_writeup.md',
    category: 'picoCTF - Reverse Engineering',
    excerpt: 'picoCTF Binary Instrumentation 3 writeup using dynamic binary instrumentation tools like Frida or Pin to trace and solve the challenge.'
  },
  {
    file: 'pico2026CTF/Reverse Engineering/09_binary_instrumentation_4_writeup.md',
    category: 'picoCTF - Reverse Engineering',
    excerpt: 'picoCTF Binary Instrumentation 4 writeup applying advanced instrumentation techniques to hook functions and extract the flag at runtime.'
  },
  {
    file: 'pico2026CTF/Reverse Engineering/10_jitfp_writeup.md',
    category: 'picoCTF - Reverse Engineering',
    excerpt: 'picoCTF JITFP writeup reversing a just-in-time compiled program, analyzing dynamically generated code to understand flag computation.'
  },
  {
    file: 'pico2026CTF/Reverse Engineering/11_gatekeeper_writeup.md',
    category: 'picoCTF - Reverse Engineering',
    excerpt: 'picoCTF Gatekeeper writeup reversing a gatekeeper binary with multiple validation stages to find the correct input sequence for the flag.'
  },

  // ============================================================
  // pico2026CTF/Web Exploitation -> "picoCTF - Web Exploitation" (6 files)
  // ============================================================
  {
    file: 'pico2026CTF/Web Exploitation/Credential Stuffing.md',
    category: 'picoCTF - Web Exploitation',
    excerpt: 'picoCTF Credential Stuffing writeup using leaked credential databases to automate login attempts and gain unauthorized access to the target application.'
  },
  {
    file: 'pico2026CTF/Web Exploitation/Hashgate.md',
    category: 'picoCTF - Web Exploitation',
    excerpt: 'picoCTF Hashgate writeup exploiting an IDOR vulnerability where user IDs are hashed with MD5, allowing access to other users accounts by predicting hash values.'
  },
  {
    file: 'pico2026CTF/Web Exploitation/Fool the Lockout.md',
    category: 'picoCTF - Web Exploitation',
    excerpt: 'picoCTF Fool the Lockout writeup bypassing a rate-limiting lockout mechanism to brute-force credentials and access the protected endpoint.'
  },
  {
    file: 'pico2026CTF/Web Exploitation/Secret Box.md',
    category: 'picoCTF - Web Exploitation',
    excerpt: 'picoCTF Secret Box writeup exploiting SQL injection to forge authentication tokens and access the secret content containing the flag.'
  },
  {
    file: 'pico2026CTF/Web Exploitation/No FA.md',
    category: 'picoCTF - Web Exploitation',
    excerpt: 'picoCTF No FA writeup exploiting Flask session cookie vulnerabilities to leak OTP codes and crack passwords for authentication bypass.'
  },
  {
    file: 'pico2026CTF/Web Exploitation/Sql Map1.md',
    category: 'picoCTF - Web Exploitation',
    excerpt: 'picoCTF SQL Map 1 writeup using sqlmap to automate SQL injection attacks and extract password hashes, then cracking them with MD5 lookup.'
  },

  // ============================================================
  // pico2026CTF/General Skills -> "picoCTF - General Skills" (8 files)
  // ============================================================
  {
    file: 'pico2026CTF/General Skills/Printer Shares.md',
    category: 'picoCTF - General Skills',
    excerpt: 'picoCTF Printer Shares writeup enumerating SMB shares to discover and access hidden printer share files containing the flag.'
  },
  {
    file: 'pico2026CTF/General Skills/MY GIT.md',
    category: 'picoCTF - General Skills',
    excerpt: 'picoCTF My Git writeup forging a Git commit identity to bypass repository validation checks and retrieve the flag.'
  },
  {
    file: 'pico2026CTF/General Skills/bytemancy 3.md',
    category: 'picoCTF - General Skills',
    excerpt: 'picoCTF Bytemancy 3 writeup using objdump disassembly and pwntools p32 packing to reconstruct data from binary sections and extract the flag.'
  },
  {
    file: 'pico2026CTF/General Skills/Printer Shares 3.md',
    category: 'picoCTF - General Skills',
    excerpt: 'picoCTF Printer Shares 3 writeup discovering a writable cron job script on a printer share and exploiting it for remote code execution to capture the flag.'
  },
  {
    file: 'pico2026CTF/General Skills/Failure Failure.md',
    category: 'picoCTF - General Skills',
    excerpt: 'picoCTF Failure Failure writeup exploiting HAProxy failover behavior by exhausting rate limits to trigger backend routing to the flag server.'
  },
  {
    file: 'pico2026CTF/General Skills/ABSOLUTE NANO.md',
    category: 'picoCTF - General Skills',
    excerpt: 'picoCTF Absolute Nano writeup using GTFOBins nano technique with sudo privileges to escalate access and read the flag file.'
  },
  {
    file: 'pico2026CTF/General Skills/bytemancy 2.md',
    category: 'picoCTF - General Skills',
    excerpt: 'picoCTF Bytemancy 2 writeup sending raw bytes to a network service using pwntools to satisfy binary protocol requirements and retrieve the flag.'
  },
  {
    file: 'pico2026CTF/General Skills/Password_Profiler.md',
    category: 'picoCTF - General Skills',
    excerpt: 'picoCTF Password Profiler writeup using CUPP to generate a custom wordlist from OSINT data and cracking a SHA-1 hash to recover the password.'
  },

  // ============================================================
  // pico2026CTF/Blockchain -> "picoCTF - Blockchain" (4 files)
  // ============================================================
  {
    file: 'pico2026CTF/Blockchain/Access_Control.md',
    category: 'picoCTF - Blockchain',
    excerpt: 'picoCTF Access Control writeup exploiting an unprotected owner-setter function in a Solidity smart contract to claim ownership and reveal the flag.'
  },
  {
    file: 'pico2026CTF/Blockchain/Front_Running.md',
    category: 'picoCTF - Blockchain',
    excerpt: 'picoCTF Front Running writeup monitoring the mempool for pending transactions, extracting the plaintext solution, and front-running with higher gas price.'
  },
  {
    file: 'pico2026CTF/Blockchain/Smart_Overflow.md',
    category: 'picoCTF - Blockchain',
    excerpt: 'picoCTF Smart Overflow writeup triggering a uint256 integer overflow in unchecked Solidity arithmetic to satisfy the flag reveal condition.'
  },
  {
    file: 'pico2026CTF/Blockchain/Reentrance.md',
    category: 'picoCTF - Blockchain',
    excerpt: 'picoCTF Reentrance writeup deploying an attacker contract to exploit the classic reentrancy vulnerability and drain the bank contract to zero.'
  },
];

// Category -> icon mapping
const categoryIcons = {
  'Malware Analysis': 'Search',
  'Binary Exploitation': 'Binary',
  'Reverse Engineering': 'Bug',
  'HTB Writeup': 'Server',
  'CTF Writeup': 'Trophy',
  'Resources': 'BookOpen',
  'picoCTF - Binary Exploitation': 'Binary',
  'picoCTF - Reverse Engineering': 'Bug',
  'picoCTF - Web Exploitation': 'Globe',
  'picoCTF - General Skills': 'Terminal',
  'picoCTF - Blockchain': 'Link',
};

function toKebabCase(filename) {
  // Remove .md extension
  let name = filename.replace(/\.md$/i, '');
  // Replace special characters and spaces with hyphens
  name = name
    .toLowerCase()
    .replace(/[()&]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return name;
}

function extractTitle(content, filename) {
  // Try to find first # heading
  const match = content.match(/^#\s+(.+)$/m);
  if (match) {
    return match[1].trim();
  }
  // Fall back to filename
  return filename.replace(/\.md$/i, '').replace(/[_-]/g, ' ');
}

function escapeForTemplateLiteral(str) {
  // Escape backticks and ${} for template literals
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/`/g, '\\`')     // Escape backticks
    .replace(/\$\{/g, '\\${'); // Escape template expressions
}

function fixImagePaths(content) {
  // Fix relative image paths to absolute
  // ../../images/X.png -> /MyNotes/images/X.png
  // ../images/X.png -> /MyNotes/images/X.png
  content = content.replace(/\.\.\/\.\.\/images\//g, '/MyNotes/images/');
  content = content.replace(/\.\.\/images\//g, '/MyNotes/images/');
  return content;
}

function generateNote(config) {
  const fullPath = path.join(BASE, config.file);
  const rawContent = fs.readFileSync(fullPath, 'utf-8');
  const filename = path.basename(config.file);

  const id = toKebabCase(filename);
  const title = extractTitle(rawContent, filename);
  const category = config.category;
  const excerpt = config.excerpt;

  // Process content
  let content = rawContent;
  content = fixImagePaths(content);
  content = escapeForTemplateLiteral(content);

  return { id, title, excerpt, category, content };
}

// Build all notes
const notes = noteConfigs.map(generateNote);

// Count categories
const categoryCounts = {};
for (const note of notes) {
  categoryCounts[note.category] = (categoryCounts[note.category] || 0) + 1;
}

// Build categories array maintaining a nice order
const categoryOrder = [
  'Malware Analysis',
  'Binary Exploitation',
  'Reverse Engineering',
  'HTB Writeup',
  'CTF Writeup',
  'Resources',
  'picoCTF - Binary Exploitation',
  'picoCTF - Reverse Engineering',
  'picoCTF - Web Exploitation',
  'picoCTF - General Skills',
  'picoCTF - Blockchain',
];

// Generate the TypeScript content
let ts = '';
ts += `export type Note = {\n`;
ts += `  id: string;\n`;
ts += `  title: string;\n`;
ts += `  excerpt: string;\n`;
ts += `  category: string;\n`;
ts += `  content: string;\n`;
ts += `};\n\n`;
ts += `export const notes: Note[] = [\n`;

for (const note of notes) {
  ts += `  {\n`;
  ts += `    id: "${note.id}",\n`;
  ts += `    title: "${note.title.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}",\n`;
  ts += `    excerpt: "${note.excerpt.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}",\n`;
  ts += `    category: "${note.category}",\n`;
  ts += `    content: \`${note.content}\`,\n`;
  ts += `  },\n`;
}

ts += `];\n\n`;

ts += `export const categories = [\n`;
for (const cat of categoryOrder) {
  if (categoryCounts[cat]) {
    ts += `  { name: "${cat}", icon: "${categoryIcons[cat]}", count: ${categoryCounts[cat]} },\n`;
  }
}
ts += `];\n`;

// Write the output
const outputPath = path.join(BASE, 'site/src/data/notes.ts');
fs.writeFileSync(outputPath, ts, 'utf-8');

console.log(`Generated ${outputPath}`);
console.log(`Total notes: ${notes.length}`);
console.log('Category counts:');
for (const cat of categoryOrder) {
  if (categoryCounts[cat]) {
    console.log(`  ${cat}: ${categoryCounts[cat]}`);
  }
}
