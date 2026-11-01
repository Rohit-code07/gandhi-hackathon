import { VirtualFile, DriveInfo } from '../types/filesystem';

const DB_NAME = 'Win98_AbandonedPC';
const DB_VERSION = 1;
const STORE_NAME = 'filesystem';

export const DEFAULT_DRIVES: DriveInfo[] = [
  {
    letter: 'A:',
    label: '3½ Floppy (A:)',
    totalBytes: 1474560,
    freeBytes: 1474560,
    icon: '/icons/floppy.svg'
  },
  {
    letter: 'C:',
    label: 'Local Disk (C:)',
    totalBytes: 4624474112, // 4.3 GB
    freeBytes: 2843058176, // 2.64 GB free
    icon: '/icons/hard-drive.svg'
  },
  {
    letter: 'D:',
    label: 'CD-ROM Drive (D:)',
    totalBytes: 681574400, // 650 MB
    freeBytes: 0,
    icon: '/icons/cd-drive.svg'
  }
];

export const INITIAL_FILES: VirtualFile[] = [
  // Drives & Root
  {
    id: 'drive-c',
    name: 'C:',
    path: 'C:',
    parentPath: '',
    type: 'drive',
    size: 4624474112,
    modifiedAt: '1998-08-24 10:00',
    icon: '/icons/hard-drive.svg',
    isSystem: true
  },
  {
    id: 'drive-a',
    name: 'A:',
    path: 'A:',
    parentPath: '',
    type: 'drive',
    size: 1474560,
    modifiedAt: '1998-08-24 10:00',
    icon: '/icons/floppy.svg',
    isSystem: true
  },
  {
    id: 'drive-d',
    name: 'D:',
    path: 'D:',
    parentPath: '',
    type: 'drive',
    size: 681574400,
    modifiedAt: '1998-08-24 10:00',
    icon: '/icons/cd-drive.svg',
    isSystem: true
  },

  // System & Standard Folders on C:
  {
    id: 'dir-windows',
    name: 'Windows',
    path: 'C:/Windows',
    parentPath: 'C:',
    type: 'folder',
    size: 245000000,
    modifiedAt: '1998-08-24 11:15',
    icon: '/icons/folder.svg',
    isSystem: true
  },
  {
    id: 'dir-program-files',
    name: 'Program Files',
    path: 'C:/Program Files',
    parentPath: 'C:',
    type: 'folder',
    size: 180000000,
    modifiedAt: '1998-08-24 11:15',
    icon: '/icons/folder.svg',
    isSystem: true
  },
  {
    id: 'dir-my-documents',
    name: 'My Documents',
    path: 'C:/My Documents',
    parentPath: 'C:',
    type: 'folder',
    size: 48500,
    modifiedAt: '2003-04-12 18:22',
    icon: '/icons/my-documents.svg'
  },
  {
    id: 'dir-my-pictures',
    name: 'My Pictures',
    path: 'C:/My Pictures',
    parentPath: 'C:',
    type: 'folder',
    size: 320000,
    modifiedAt: '2002-11-04 14:05',
    icon: '/icons/my-pictures.svg'
  },
  {
    id: 'dir-my-music',
    name: 'My Music',
    path: 'C:/My Music',
    parentPath: 'C:',
    type: 'folder',
    size: 12500000,
    modifiedAt: '2001-09-19 21:40',
    icon: '/icons/folder.svg'
  },
  {
    id: 'dir-games',
    name: 'Games',
    path: 'C:/Games',
    parentPath: 'C:',
    type: 'folder',
    size: 58000000,
    modifiedAt: '2000-02-14 16:30',
    icon: '/icons/folder.svg'
  },
  {
    id: 'dir-downloads',
    name: 'Downloads',
    path: 'C:/Downloads',
    parentPath: 'C:',
    type: 'folder',
    size: 4200000,
    modifiedAt: '2001-06-18 02:15',
    icon: '/icons/folder.svg'
  },
  {
    id: 'dir-internet-cache',
    name: 'Internet Cache',
    path: 'C:/Internet Cache',
    parentPath: 'C:',
    type: 'folder',
    size: 8900000,
    modifiedAt: '2003-01-05 23:59',
    icon: '/icons/folder.svg'
  },
  {
    id: 'dir-secret',
    name: 'Secret',
    path: 'C:/Secret',
    parentPath: 'C:',
    type: 'folder',
    size: 84000,
    modifiedAt: '2005-11-01 03:33',
    icon: '/icons/secret-folder.svg'
  },
  {
    id: 'dir-secret-do-not-open',
    name: 'DO_NOT_OPEN',
    path: 'C:/Secret/DO_NOT_OPEN',
    parentPath: 'C:/Secret',
    type: 'folder',
    size: 64000,
    modifiedAt: '2005-11-01 03:33',
    icon: '/icons/secret-folder.svg'
  },
  {
    id: 'dir-recycle-bin',
    name: 'Recycle Bin',
    path: 'C:/Recycle Bin',
    parentPath: 'C:',
    type: 'folder',
    size: 34000,
    modifiedAt: '2003-12-31 23:59',
    icon: '/icons/recycle-full.svg',
    isSystem: true
  },

  // ================= LORE & STORY FILES ================= //
  // My Documents
  {
    id: 'file-diary',
    name: 'diary.txt',
    path: 'C:/My Documents/diary.txt',
    parentPath: 'C:/My Documents',
    type: 'file',
    extension: 'txt',
    size: 1420,
    modifiedAt: '2003-04-12 18:22',
    icon: '/icons/file-text.svg',
    content: `PERSONAL DIARY OF ALEX SHARMA
======================================
[Oct 14, 1998]
Dad finally bought the Pentium II 350MHz!! 64MB RAM and a massive 4.3GB Seagate HDD.
He warned me: "Do not touch the Internet, BSNL charges by the minute!"
Obviously the first thing I did was install Winamp and connect to IRC via 56k modem.
The screeching sound of the modem sounds like angels singing.

[Dec 31, 1999]
Y2K is in 4 hours. Everyone in the hostel says the electricity grid will collapse.
I filled 14 buckets with water and printed 200 pages of GameFAQs.
If you find this computer in the post-apocalyptic future: I hid the gold in C:/Secret.

[Mar 15, 2001]
Priya looked at my ICQ status today. I changed it to "Listening to Linkin Park - In the End.mp3".
I think she knows.

[May 02, 2003]
Something strange is happening on the web. I downloaded a 14KB file from a forum user named 'Ghost98'.
The computer fans spun at maximum speed and an ASCII rabbit appeared in DOS prompt.
It said: "THE TIME HAS COME TO ABANDON SHIP."
I'm moving this to C:/Secret/DO_NOT_OPEN. If anyone reads this: DO NOT TOUCH ILOVEYOU.exe IN DOWNLOADS!`
  },
  {
    id: 'file-passwords',
    name: 'passwords.txt',
    path: 'C:/My Documents/passwords.txt',
    parentPath: 'C:/My Documents',
    type: 'file',
    extension: 'txt',
    size: 580,
    modifiedAt: '2002-08-10 14:10',
    icon: '/icons/file-text.svg',
    content: `SUPER SECRET PASSWORDS - DO NOT READ
======================================
Hotmail: ilovepriya1999 (DO NOT CHANGE)
Yahoo Mail: pentium_god_98
ICQ UIN: 4892019 / Password: password123
Orkut (Beta): gandhi_hackathon_fan
BSNL Dial-Up: guest / guest123
Windows 98 Product Key: F37X3-04983-WIN98-SE2026-HACKATHON
C:/Secret folder password clue: The year this PC was made (1998)`
  },
  {
    id: 'file-my-crush',
    name: 'my_crush.txt',
    path: 'C:/My Documents/my_crush.txt',
    parentPath: 'C:/My Documents',
    type: 'file',
    extension: 'txt',
    size: 420,
    modifiedAt: '2001-02-14 23:45',
    icon: '/icons/file-text.svg',
    content: `PLAN TO IMPRESS PRIYA (VALENTINE'S DAY 2001)
-----------------------------------------------
1. Burn a custom audio CD on 4x writer with:
   - Backstreet Boys - I Want It That Way
   - Savage Garden - Truly Madly Deeply
   - Bryan Adams - Summer of 69
2. Send an ICQ message with cool ascii rose: @->->---
3. If she replies "k.", immediately fake computer crash.
4. Update: She replied "Who is this? My brother uses this ICQ."
5. Emotional damage: 100%`
  },
  {
    id: 'file-final-final',
    name: 'final_final_final.txt',
    path: 'C:/My Documents/final_final_final.txt',
    parentPath: 'C:/My Documents',
    type: 'file',
    extension: 'txt',
    size: 610,
    modifiedAt: '2002-11-20 04:15',
    icon: '/icons/file-text.svg',
    content: `DOCUMENT VERSION TRACKING:
- project_report.doc
- project_report_final.doc
- project_report_final_v2.doc
- project_report_final_final.doc
- project_report_final_FINAL_FOR_REAL.doc
- project_report_final_FINAL_IF_THIS_FAILS_I_QUIT.doc
- final_final_final.txt <-- YOU ARE HERE

Professor's feedback: "Font must be Times New Roman size 12, not Comic Sans 14 with WordArt."
I have spent 72 continuous hours in the lab.`
  },
  {
    id: 'file-life-plan',
    name: 'life_plan.txt',
    path: 'C:/My Documents/life_plan.txt',
    parentPath: 'C:/My Documents',
    type: 'file',
    extension: 'txt',
    size: 512,
    modifiedAt: '1999-01-01 00:01',
    icon: '/icons/file-text.svg',
    content: `ALEX'S 30-YEAR MASTER PLAN (1998 - 2028)
----------------------------------------
Year 2000: Survive Y2K bug without eating pet cat.
Year 2005: Buy 128MB RAM upgrade. (Unimaginable speed!)
Year 2010: The Internet will probably be in 3D holographic VR.
Year 2020: Flying cars and computers will write code automatically (Yeah right, impossible!).
Year 2026: Some genius students at IIT Bhilai will boot up my abandoned computer for a hackathon and give this project 1st prize.
(If this happened, hi judges! You found my easter egg!)`
  },

  // Downloads folder - Fake Virus ILOVEYOU.exe
  {
    id: 'file-iloveyou',
    name: 'ILOVEYOU.exe',
    path: 'C:/Downloads/ILOVEYOU.exe',
    parentPath: 'C:/Downloads',
    type: 'file',
    extension: 'exe',
    size: 14336,
    modifiedAt: '2001-05-04 12:00',
    icon: '/icons/file-exe.svg',
    content: 'EXECUTABLE_VIRUS_TRIGGER'
  },
  {
    id: 'file-winamp-skin',
    name: 'classic_matrix_skin.wsz',
    path: 'C:/Downloads/classic_matrix_skin.wsz',
    parentPath: 'C:/Downloads',
    type: 'file',
    extension: 'wsz',
    size: 145000,
    modifiedAt: '2001-03-10 19:12',
    icon: '/icons/file-text.svg',
    content: 'Winamp Skin Archive 1998'
  },
  {
    id: 'file-cheat-codes',
    name: 'gta_vice_city_cheats.txt',
    path: 'C:/Downloads/gta_vice_city_cheats.txt',
    parentPath: 'C:/Downloads',
    type: 'file',
    extension: 'txt',
    size: 320,
    modifiedAt: '2002-12-14 17:00',
    icon: '/icons/file-text.svg',
    content: `GTA & RETRO CODES:
ASPIRINE - Full health
PRECIOUSPROTECTION - Full armor
PANZER - Spawn tank
NUTTERTOOLS - Heavy weapons
KONAMI CODE FOR WINDOWS 98 DESKTOP:
UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A`
  },

  // Secret Folder DO_NOT_OPEN
  {
    id: 'file-classified',
    name: 'classified.txt',
    path: 'C:/Secret/DO_NOT_OPEN/classified.txt',
    parentPath: 'C:/Secret/DO_NOT_OPEN',
    type: 'file',
    extension: 'txt',
    size: 980,
    modifiedAt: '2005-10-31 23:58',
    icon: '/icons/file-text.svg',
    content: `PROJECT: TIME CAPSULE 98 - CLASSIFIED REPORT
=================================================
Subject: The Abandoned Computer
Classification: Top Secret / Level 98

To whoever turned on this machine:
You are looking at the sacred digital relic of Alex Sharma.
In 2005, the hard drive started vibrating at 432 Hz and the CRT monitor began displaying future news headlines from 2026.
It said: "Gandhi Hackathon at IIT Bhilai breaks all records with nostalgic retro computer simulator."

I locked my best meme archives, old secret emails, and ICQ chat logs inside this OS.
Explore every corner. You will find:
1. ICQ chat with Rahul and ComputerDad
2. The dial-up simulator with 56k audio
3. The retro Meme Factory with 12 handcrafted vintage memes
4. Solitaire, Minesweeper and Snake
5. A secret Matrix mode unlocked via the Konami code.`
  },
  {
    id: 'file-evidence',
    name: 'evidence.txt',
    path: 'C:/Secret/DO_NOT_OPEN/evidence.txt',
    parentPath: 'C:/Secret/DO_NOT_OPEN',
    type: 'file',
    extension: 'txt',
    size: 450,
    modifiedAt: '2005-11-01 01:15',
    icon: '/icons/file-text.svg',
    content: `EVIDENCE LOG #984
--------------------
Date: November 1, 2005 - 01:15 AM
I heard a knock on my hostel door.
Nobody was there, but a 3.5" floppy disk was on the floor labeled: "DO NOT REBOOT".
Inside was a script that promised unlimited dial-up speed forever.
I ran it. The monitor turned blue and Clippy whispered: "You have crossed the point of no return."`
  },
  {
    id: 'file-old-passwords',
    name: 'old_passwords.txt',
    path: 'C:/Secret/DO_NOT_OPEN/old_passwords.txt',
    parentPath: 'C:/Secret/DO_NOT_OPEN',
    type: 'file',
    extension: 'txt',
    size: 340,
    modifiedAt: '2004-06-12 11:11',
    icon: '/icons/file-text.svg',
    content: `MORE DANGEROUS PASSWORDS:
- Dad's dial-up account: bsnl_delhi_unlimited
- NASA mainframe backdoor: admin / hunter2 (Just kidding)
- Secret events console trigger: Press CTRL + SHIFT + H for Presentation Mode!`
  },
  {
    id: 'file-why-abandoned',
    name: 'why_this_pc_was_abandoned.txt',
    path: 'C:/Secret/DO_NOT_OPEN/why_this_pc_was_abandoned.txt',
    parentPath: 'C:/Secret/DO_NOT_OPEN',
    type: 'file',
    extension: 'txt',
    size: 780,
    modifiedAt: '2005-11-01 03:33',
    icon: '/icons/file-text.svg',
    content: `THE TRUTH: WHY THIS PC WAS ABANDONED
========================================
It was 3:33 AM on a rainy Tuesday in 2005.
I was downloading a 3.5MB MP3 on KaZaA at 1.2 KB/s.
It was at 99.8%.
Suddenly, my mom picked up the landline phone in the living room to talk to Auntie.
The dial-up connection died.
The download failed.
Resume was not supported.
I stared at the screen for 45 minutes in complete silence.
I turned off the monitor, put the dust cover over the CRT, walked out into the rain, and never touched Windows 98 again.

Until today... when YOU pressed the power button.`
  },

  // My Pictures
  {
    id: 'file-family-trip',
    name: 'family_trip_1998.bmp',
    path: 'C:/My Pictures/family_trip_1998.bmp',
    parentPath: 'C:/My Pictures',
    type: 'file',
    extension: 'bmp',
    size: 154000,
    modifiedAt: '1998-11-20 15:30',
    icon: '/icons/file-image.svg',
    content: 'IMAGE_OLD_PHOTO'
  },
  {
    id: 'file-pentium2',
    name: 'me_and_my_pentium2.bmp',
    path: 'C:/My Pictures/me_and_my_pentium2.bmp',
    parentPath: 'C:/My Pictures',
    type: 'file',
    extension: 'bmp',
    size: 120000,
    modifiedAt: '1999-03-12 10:20',
    icon: '/icons/file-image.svg',
    content: 'IMAGE_PENTIUM2'
  },

  // Recycle Bin
  {
    id: 'file-deleted-resignation',
    name: 'unsent_love_letter.txt',
    path: 'C:/Recycle Bin/unsent_love_letter.txt',
    parentPath: 'C:/Recycle Bin',
    type: 'file',
    extension: 'txt',
    size: 420,
    modifiedAt: '2001-02-15 01:10',
    icon: '/icons/file-text.svg',
    isDeleted: true,
    content: `Dear Priya,
I spent 40 rupees on an internet cafe token just to see if your ICQ flower was green.
I wrote a C++ program that prints your name 10,000 times.
Then my compiler threw 47 errors.
Maybe our love is like Windows 98: beautiful, but prone to crashing without warning.`
  },
  {
    id: 'file-deleted-virus',
    name: 'suspicious_script.bat',
    path: 'C:/Recycle Bin/suspicious_script.bat',
    parentPath: 'C:/Recycle Bin',
    type: 'file',
    extension: 'bat',
    size: 210,
    modifiedAt: '2002-09-01 19:40',
    icon: '/icons/file-text.svg',
    isDeleted: true,
    content: `@echo off
echo HACKING THE MAINFRAME...
echo DOWNLOADING MORE RAM...
echo ERROR: Brain not detected.
pause`
  }
];

class VirtualFileSystemService {
  private db: IDBDatabase | null = null;
  private isInitialized = false;

  public async init(): Promise<VirtualFile[]> {
    if (this.isInitialized) {
      return this.getAllFiles();
    }

    return new Promise((resolve) => {
      // Check localStorage first as fast fallback / hybrid
      const localData = localStorage.getItem('win98_vfs_files');
      if (localData) {
        try {
          const files = JSON.parse(localData);
          this.isInitialized = true;
          resolve(files);
          return;
        } catch (e) {}
      }

      // Try IndexedDB
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e: any) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('path', 'path', { unique: true });
            store.createIndex('parentPath', 'parentPath', { unique: false });
          }
        };

        req.onsuccess = (e: any) => {
          this.db = e.target.result;
          this.getAllFiles().then((files) => {
            if (!files || files.length === 0) {
              this.seedInitialFiles().then((seeded) => {
                this.isInitialized = true;
                resolve(seeded);
              });
            } else {
              this.isInitialized = true;
              resolve(files);
            }
          });
        };

        req.onerror = () => {
          // IndexedDB failed or restricted in sandbox/iframe; fallback to memory/localStorage
          localStorage.setItem('win98_vfs_files', JSON.stringify(INITIAL_FILES));
          this.isInitialized = true;
          resolve(INITIAL_FILES);
        };
      } catch (err) {
        localStorage.setItem('win98_vfs_files', JSON.stringify(INITIAL_FILES));
        this.isInitialized = true;
        resolve(INITIAL_FILES);
      }
    });
  }

  private async seedInitialFiles(): Promise<VirtualFile[]> {
    if (!this.db) {
      localStorage.setItem('win98_vfs_files', JSON.stringify(INITIAL_FILES));
      return INITIAL_FILES;
    }

    return new Promise((resolve) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      INITIAL_FILES.forEach((f) => store.put(f));
      tx.oncomplete = () => {
        localStorage.setItem('win98_vfs_files', JSON.stringify(INITIAL_FILES));
        resolve(INITIAL_FILES);
      };
    });
  }

  public async getAllFiles(): Promise<VirtualFile[]> {
    if (!this.db) {
      const cached = localStorage.getItem('win98_vfs_files');
      return cached ? JSON.parse(cached) : INITIAL_FILES;
    }

    return new Promise((resolve) => {
      const tx = this.db!.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const files = req.result;
        localStorage.setItem('win98_vfs_files', JSON.stringify(files));
        resolve(files);
      };
      req.onerror = () => {
        resolve(INITIAL_FILES);
      };
    });
  }

  public async saveFile(file: VirtualFile): Promise<void> {
    if (this.db) {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(file);
    }
    const all = await this.getAllFiles();
    const idx = all.findIndex((f) => f.id === file.id);
    if (idx >= 0) all[idx] = file;
    else all.push(file);
    localStorage.setItem('win98_vfs_files', JSON.stringify(all));
  }

  public async deleteFile(id: string): Promise<void> {
    if (this.db) {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
    }
    const all = await this.getAllFiles();
    const filtered = all.filter((f) => f.id !== id);
    localStorage.setItem('win98_vfs_files', JSON.stringify(filtered));
  }

  public async resetFileSystem(): Promise<VirtualFile[]> {
    localStorage.removeItem('win98_vfs_files');
    if (this.db) {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).clear();
    }
    return this.seedInitialFiles();
  }
}

export const vfsService = new VirtualFileSystemService();
