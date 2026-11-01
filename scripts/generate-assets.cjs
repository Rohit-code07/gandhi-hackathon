const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const memesDir = path.join(__dirname, '..', 'public', 'memes');
const wallpapersDir = path.join(__dirname, '..', 'public', 'wallpapers');

[iconsDir, memesDir, wallpapersDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 1. ICONS
const icons = {
  'win98.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path d="M2 6 L14 4 L14 14 L2 14 Z" fill="#f25022"/>
    <path d="M16 3.5 L30 2 L30 14 L16 14 Z" fill="#7fba00"/>
    <path d="M2 17 L14 17 L14 27 L2 25 Z" fill="#00a4ef"/>
    <path d="M16 17 L30 17 L30 29 L16 27.5 Z" fill="#ffb900"/>
    <circle cx="2" cy="15" r="1.5" fill="#f25022" opacity="0.7"/>
    <circle cx="5" cy="15" r="1.5" fill="#00a4ef" opacity="0.7"/>
  </svg>`,
  'my-computer.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="3" y="3" width="26" height="19" rx="1" fill="#c0c0c0" stroke="#000" stroke-width="1.5"/>
    <rect x="5" y="5" width="22" height="15" fill="#008080"/>
    <polygon points="7,8 9,6 23,6 21,8" fill="#20b2aa"/>
    <rect x="12" y="22" width="8" height="3" fill="#808080"/>
    <rect x="6" y="25" width="20" height="5" fill="#c0c0c0" stroke="#000" stroke-width="1.5"/>
    <line x1="9" y1="27" x2="15" y2="27" stroke="#000" stroke-width="1"/>
    <circle cx="22" cy="27" r="1" fill="#00ff00"/>
  </svg>`,
  'my-documents.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path d="M2 8 L11 8 L14 11 L28 11 L28 26 L2 26 Z" fill="#ffd700" stroke="#806000" stroke-width="1.5"/>
    <path d="M9 5 L21 5 L25 9 L25 18 L9 18 Z" fill="#ffffff" stroke="#000" stroke-width="1"/>
    <line x1="12" y1="8" x2="18" y2="8" stroke="#000"/>
    <line x1="12" y1="11" x2="22" y2="11" stroke="#000"/>
    <line x1="12" y1="14" x2="20" y2="14" stroke="#000"/>
  </svg>`,
  'ie.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <ellipse cx="16" cy="16" rx="11" ry="11" fill="none" stroke="#0055ea" stroke-width="4.5"/>
    <path d="M5 13 Q16 5 27 13 Q16 25 5 13" fill="none" stroke="#ffd700" stroke-width="2.5"/>
    <path d="M6 14 Q16 11 26 14" fill="none" stroke="#0055ea" stroke-width="4"/>
  </svg>`,
  'recycle-empty.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <polygon points="6,9 26,9 23,28 9,28" fill="#c0c0c0" stroke="#000" stroke-width="1.5"/>
    <ellipse cx="16" cy="9" rx="10" ry="3" fill="#e0e0e0" stroke="#000" stroke-width="1.5"/>
    <path d="M13 14 L19 14 L17 18 L15 18 Z" fill="#008000"/>
  </svg>`,
  'recycle-full.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <polygon points="6,9 26,9 23,28 9,28" fill="#c0c0c0" stroke="#000" stroke-width="1.5"/>
    <rect x="9" y="4" width="14" height="8" fill="#ffffff" stroke="#808080"/>
    <line x1="11" y1="6" x2="17" y2="6" stroke="#000"/>
    <ellipse cx="16" cy="9" rx="10" ry="3" fill="none" stroke="#000" stroke-width="1.5"/>
  </svg>`,
  'notepad.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="6" y="4" width="18" height="24" fill="#ffffff" stroke="#000" stroke-width="1.5"/>
    <rect x="4" y="4" width="4" height="24" fill="#000080"/>
    <line x1="10" y1="8" x2="21" y2="8" stroke="#808080" stroke-width="1.5"/>
    <line x1="10" y1="12" x2="21" y2="12" stroke="#808080" stroke-width="1.5"/>
    <line x1="10" y1="16" x2="21" y2="16" stroke="#808080" stroke-width="1.5"/>
    <line x1="10" y1="20" x2="18" y2="20" stroke="#808080" stroke-width="1.5"/>
    <polygon points="18,18 28,28 25,30 15,20" fill="#ffd700" stroke="#000" stroke-width="1"/>
    <polygon points="15,20 18,18 13,16" fill="#ff9999"/>
  </svg>`,
  'paint.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path d="M4 16 C4 8 12 4 20 4 C27 4 29 10 29 15 C29 20 25 21 23 21 C21 21 20 22 20 24 C20 26 21 27 20 29 C18 30 15 30 12 29 C6 27 4 22 4 16 Z" fill="#eed9b3" stroke="#8b5a2b" stroke-width="1.5"/>
    <circle cx="10" cy="10" r="2.5" fill="#ff0000"/>
    <circle cx="17" cy="8" r="2.5" fill="#ffff00"/>
    <circle cx="23" cy="12" r="2.5" fill="#0000ff"/>
    <circle cx="10" cy="18" r="2.5" fill="#00aa00"/>
    <rect x="20" y="3" width="4" height="12" fill="#d2691e" stroke="#000"/>
  </svg>`,
  'calculator.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="5" y="3" width="22" height="26" rx="2" fill="#c0c0c0" stroke="#000" stroke-width="1.5"/>
    <rect x="8" y="6" width="16" height="5" fill="#ffffff" stroke="#000" stroke-width="1"/>
    <rect x="8" y="13" width="3" height="3" fill="#000080"/>
    <rect x="12" y="13" width="3" height="3" fill="#000080"/>
    <rect x="16" y="13" width="3" height="3" fill="#000080"/>
    <rect x="20" y="13" width="4" height="3" fill="#800000"/>
    <rect x="8" y="18" width="3" height="3" fill="#000080"/>
    <rect x="12" y="18" width="3" height="3" fill="#000080"/>
    <rect x="16" y="18" width="3" height="3" fill="#000080"/>
    <rect x="20" y="18" width="4" height="3" fill="#800000"/>
    <rect x="8" y="23" width="3" height="3" fill="#000080"/>
    <rect x="12" y="23" width="3" height="3" fill="#000080"/>
    <rect x="16" y="23" width="3" height="3" fill="#000080"/>
    <rect x="20" y="23" width="4" height="3" fill="#800000"/>
  </svg>`,
  'minesweeper.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="2" y="2" width="28" height="28" fill="#c0c0c0" stroke="#808080" stroke-width="1.5"/>
    <circle cx="16" cy="16" r="8" fill="#000"/>
    <line x1="16" y1="5" x2="16" y2="27" stroke="#000" stroke-width="2"/>
    <line x1="5" y1="16" x2="27" y2="16" stroke="#000" stroke-width="2"/>
    <line x1="8" y1="8" x2="24" y2="24" stroke="#000" stroke-width="2"/>
    <line x1="8" y1="24" x2="24" y2="8" stroke="#000" stroke-width="2"/>
    <circle cx="13" cy="13" r="2" fill="#fff"/>
  </svg>`,
  'solitaire.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="3" y="5" width="16" height="22" rx="2" fill="#ffffff" stroke="#000" stroke-width="1.5"/>
    <text x="5" y="12" font-size="7" font-family="Arial" fill="#ff0000" font-weight="bold">A</text>
    <path d="M11 16 Q8 12 11 10 Q14 12 11 16 Z" fill="#ff0000"/>
    <rect x="11" y="7" width="17" height="22" rx="2" fill="#0000aa" stroke="#ffffff" stroke-width="1.5"/>
    <rect x="13" y="9" width="13" height="18" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="2,2"/>
  </svg>`,
  'snake.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="2" y="2" width="28" height="28" fill="#88ffaa" stroke="#005500" stroke-width="2"/>
    <rect x="6" y="8" width="4" height="4" fill="#006600"/>
    <rect x="10" y="8" width="4" height="4" fill="#006600"/>
    <rect x="14" y="8" width="4" height="4" fill="#006600"/>
    <rect x="14" y="12" width="4" height="4" fill="#006600"/>
    <rect x="14" y="16" width="4" height="4" fill="#006600"/>
    <rect x="18" y="16" width="4" height="4" fill="#009900"/>
    <circle cx="24" cy="22" r="3" fill="#dd0000"/>
  </svg>`,
  'winamp.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="2" y="2" width="28" height="28" rx="3" fill="#222" stroke="#ffd700" stroke-width="2"/>
    <polygon points="19,4 7,17 15,17 12,28 25,14 17,14" fill="#ffd700" stroke="#ff9900" stroke-width="1"/>
    <line x1="6" y1="26" x2="26" y2="26" stroke="#00ff00" stroke-width="2"/>
  </svg>`,
  'meme-factory.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="13" fill="#ffd700" stroke="#000" stroke-width="2"/>
    <ellipse cx="12" cy="12" rx="2.5" ry="4" fill="#000"/>
    <ellipse cx="20" cy="12" rx="2.5" ry="4" fill="#000"/>
    <path d="M8 18 Q16 28 24 18 Z" fill="#000"/>
    <rect x="10" y="19" width="12" height="2" fill="#fff"/>
  </svg>`,
  'secret-folder.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path d="M2 8 L11 8 L14 11 L28 11 L28 26 L2 26 Z" fill="#990000" stroke="#4a0000" stroke-width="1.5"/>
    <rect x="12" y="16" width="8" height="8" rx="1" fill="#ffd700" stroke="#000" stroke-width="1"/>
    <path d="M14 16 L14 13 A2 2 0 0 1 18 13 L18 16" fill="none" stroke="#ffd700" stroke-width="2"/>
    <circle cx="16" cy="19" r="1" fill="#000"/>
  </svg>`,
  'control-panel.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="3" y="5" width="26" height="22" fill="#c0c0c0" stroke="#000" stroke-width="1.5"/>
    <rect x="6" y="8" width="20" height="3" fill="#000080"/>
    <rect x="7" y="14" width="10" height="3" fill="#808080"/>
    <rect x="11" y="13" width="2" height="5" fill="#000"/>
    <rect x="7" y="20" width="10" height="3" fill="#808080"/>
    <rect x="14" y="19" width="2" height="5" fill="#000"/>
    <circle cx="22" cy="17" r="3" fill="#ffaa00" stroke="#000" stroke-width="1"/>
  </svg>`,
  'my-pictures.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path d="M2 8 L11 8 L14 11 L28 11 L28 26 L2 26 Z" fill="#ffcc00" stroke="#997700" stroke-width="1.5"/>
    <rect x="9" y="13" width="14" height="10" fill="#3399ff" stroke="#000" stroke-width="1"/>
    <circle cx="12" cy="16" r="1.5" fill="#ffdd00"/>
    <polygon points="9,23 15,18 20,22 23,19 23,23" fill="#00aa44"/>
  </svg>`,
  'outlook.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="4" y="7" width="24" height="17" fill="#ffffff" stroke="#000" stroke-width="1.5"/>
    <polygon points="4,7 16,17 28,7" fill="none" stroke="#000080" stroke-width="2"/>
    <circle cx="22" cy="22" r="7" fill="#ffcc00" stroke="#cc9900" stroke-width="1.5"/>
    <line x1="22" y1="18" x2="22" y2="26" stroke="#000" stroke-width="2"/>
    <line x1="18" y1="22" x2="26" y2="22" stroke="#000" stroke-width="2"/>
  </svg>`,
  'icq.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="5" fill="#00cc00" stroke="#006600" stroke-width="1.5"/>
    <circle cx="16" cy="7" r="4" fill="#00ee00"/>
    <circle cx="16" cy="25" r="4" fill="#00ee00"/>
    <circle cx="7" cy="16" r="4" fill="#00ee00"/>
    <circle cx="25" cy="16" r="4" fill="#00ee00"/>
    <circle cx="10" cy="10" r="4" fill="#00ee00"/>
    <circle cx="22" cy="10" r="4" fill="#ff0000"/>
    <circle cx="10" cy="22" r="4" fill="#00ee00"/>
    <circle cx="22" cy="22" r="4" fill="#00ee00"/>
  </svg>`,
  'terminal.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="3" y="5" width="26" height="22" fill="#000000" stroke="#c0c0c0" stroke-width="2"/>
    <text x="6" y="14" font-family="monospace" font-size="7" fill="#ffffff" font-weight="bold">C:\\&gt;_</text>
  </svg>`,
  'floppy.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="5" y="4" width="22" height="24" rx="1" fill="#000080" stroke="#000" stroke-width="1.5"/>
    <rect x="8" y="4" width="12" height="9" fill="#c0c0c0"/>
    <rect x="10" y="6" width="3" height="5" fill="#000"/>
    <rect x="7" y="16" width="18" height="12" fill="#ffffff"/>
    <line x1="9" y1="19" x2="23" y2="19" stroke="#ff0000" stroke-width="2"/>
    <line x1="9" y1="23" x2="23" y2="23" stroke="#000" stroke-width="1"/>
  </svg>`,
  'hard-drive.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="4" y="8" width="24" height="16" rx="2" fill="#c0c0c0" stroke="#000" stroke-width="1.5"/>
    <line x1="4" y1="18" x2="28" y2="18" stroke="#808080" stroke-width="1.5"/>
    <circle cx="8" cy="21" r="1.5" fill="#00ff00"/>
    <rect x="16" y="20" width="8" height="2" fill="#000"/>
  </svg>`,
  'cd-drive.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="4" y="10" width="24" height="12" rx="1" fill="#c0c0c0" stroke="#000" stroke-width="1.5"/>
    <line x1="7" y1="15" x2="25" y2="15" stroke="#000" stroke-width="1"/>
    <circle cx="8" cy="18" r="1" fill="#00ff00"/>
    <rect x="20" y="17" width="5" height="2" fill="#808080"/>
  </svg>`,
  'folder.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path d="M2 8 L11 8 L14 11 L28 11 L28 26 L2 26 Z" fill="#ffd700" stroke="#997a00" stroke-width="1.5"/>
    <polygon points="2,13 28,13 25,26 5,26" fill="#ffe680"/>
  </svg>`,
  'file-text.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <polygon points="6,3 20,3 26,9 26,29 6,29" fill="#ffffff" stroke="#000" stroke-width="1.5"/>
    <polygon points="20,3 20,9 26,9" fill="#dfdfdf" stroke="#000" stroke-width="1"/>
    <line x1="9" y1="12" x2="22" y2="12" stroke="#000" stroke-width="1.2"/>
    <line x1="9" y1="16" x2="22" y2="16" stroke="#000" stroke-width="1.2"/>
    <line x1="9" y1="20" x2="22" y2="20" stroke="#000" stroke-width="1.2"/>
    <line x1="9" y1="24" x2="17" y2="24" stroke="#000" stroke-width="1.2"/>
  </svg>`,
  'file-image.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="5" y="4" width="22" height="24" fill="#ffffff" stroke="#000" stroke-width="1.5"/>
    <rect x="7" y="6" width="18" height="14" fill="#3399ff"/>
    <circle cx="11" cy="10" r="2" fill="#ffdd00"/>
    <polygon points="7,20 13,14 17,17 21,12 25,20" fill="#00aa44"/>
    <text x="16" y="25" font-size="5" font-family="monospace" text-anchor="middle" fill="#000">BMP</text>
  </svg>`,
  'file-audio.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <polygon points="6,3 20,3 26,9 26,29 6,29" fill="#ffffff" stroke="#000" stroke-width="1.5"/>
    <polygon points="20,3 20,9 26,9" fill="#dfdfdf" stroke="#000" stroke-width="1"/>
    <circle cx="13" cy="22" r="3" fill="#0000aa"/>
    <circle cx="21" cy="19" r="3" fill="#0000aa"/>
    <line x1="16" y1="14" x2="16" y2="22" stroke="#0000aa" stroke-width="2"/>
    <line x1="24" y1="11" x2="24" y2="19" stroke="#0000aa" stroke-width="2"/>
    <line x1="16" y1="14" x2="24" y2="11" stroke="#0000aa" stroke-width="2"/>
  </svg>`,
  'file-exe.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="5" y="4" width="22" height="24" fill="#c0c0c0" stroke="#000" stroke-width="1.5"/>
    <rect x="7" y="6" width="18" height="5" fill="#000080"/>
    <rect x="8" y="14" width="7" height="7" fill="#ffcc00" stroke="#000" stroke-width="1"/>
    <polygon points="17,14 24,17 17,21" fill="#00aa00" stroke="#000" stroke-width="1"/>
  </svg>`,
  'warning.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <polygon points="16,3 30,28 2,28" fill="#ffff00" stroke="#000" stroke-width="2"/>
    <line x1="16" y1="10" x2="16" y2="20" stroke="#000" stroke-width="3" stroke-linecap="round"/>
    <circle cx="16" cy="24" r="2" fill="#000"/>
  </svg>`,
  'error.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="13" fill="#ff0000" stroke="#800000" stroke-width="2"/>
    <line x1="10" y1="10" x2="22" y2="22" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="22" y1="10" x2="10" y2="22" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
  </svg>`,
  'info.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="13" fill="#0000ff" stroke="#000080" stroke-width="2"/>
    <circle cx="16" cy="10" r="2" fill="#ffffff"/>
    <line x1="16" y1="14" x2="16" y2="23" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  'clippy.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path d="M14 26 C8 26 8 20 8 16 L8 8 C8 4 14 4 14 8 L14 20 C14 22 17 22 17 20 L17 9 C17 7 19 7 19 9 L19 20 C19 25 15 26 14 26 Z" fill="none" stroke="#607080" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="11" cy="12" r="2.5" fill="#ffffff" stroke="#000" stroke-width="1"/>
    <circle cx="11.5" cy="12" r="1" fill="#000"/>
    <circle cx="18" cy="12" r="2.5" fill="#ffffff" stroke="#000" stroke-width="1"/>
    <circle cx="18.5" cy="12" r="1" fill="#000"/>
    <path d="M9 8 Q12 6 14 9" stroke="#000" stroke-width="1" fill="none"/>
    <path d="M16 9 Q18 6 20 8" stroke="#000" stroke-width="1" fill="none"/>
  </svg>`
};

for (const [name, content] of Object.entries(icons)) {
  fs.writeFileSync(path.join(iconsDir, name), content.trim());
}
console.log('Generated ' + Object.keys(icons).length + ' retro icons.');

// 2. 12 ORIGINAL RETRO MEME SVG ASSETS
const memes = [
  {
    id: 'meme-ie-loading',
    title: 'WHEN YOU OPEN INTERNET EXPLORER',
    caption: 'See you in 3-5 business days.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="#000080"/>
      <rect x="20" y="20" width="360" height="260" fill="#c0c0c0" stroke="#ffffff" stroke-width="2"/>
      <rect x="24" y="24" width="352" height="24" fill="#000080"/>
      <text x="32" y="40" fill="#fff" font-family="monospace" font-size="12" font-weight="bold">Internet Explorer - Dial-Up Edition</text>
      <circle cx="200" cy="130" r="45" fill="none" stroke="#0055ea" stroke-width="10"/>
      <path d="M150 120 Q200 80 250 120 Q200 180 150 120" fill="none" stroke="#ffd700" stroke-width="6"/>
      <rect x="60" y="200" width="280" height="22" fill="#fff" stroke="#000"/>
      <rect x="62" y="202" width="25" height="18" fill="#000080"/>
      <text x="200" y="240" fill="#000" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle">Loading: 1.4% (Estimated time: 47 hours)</text>
      <text x="200" y="270" fill="#900" font-family="Impact" font-size="16" text-anchor="middle">"SEE YOU IN 3-5 BUSINESS DAYS."</text>
    </svg>`
  },
  {
    id: 'meme-bsod-fail',
    title: 'WHEN WINDOWS 98 CRASHES',
    caption: 'Congratulations. You achieved nothing.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="#0000aa"/>
      <rect x="150" y="40" width="100" height="24" fill="#c0c0c0"/>
      <text x="200" y="56" fill="#0000aa" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">Windows</text>
      <text x="200" y="100" fill="#fff" font-family="monospace" font-size="13" text-anchor="middle">A fatal exception 0E has occurred at 0028:C0011E36</text>
      <text x="200" y="125" fill="#ffff00" font-family="monospace" font-size="13" text-anchor="middle">Cause: User tried moving the mouse too fast.</text>
      <text x="200" y="160" fill="#fff" font-family="monospace" font-size="12" text-anchor="middle">* Press any key to contemplate your life choices</text>
      <text x="200" y="180" fill="#fff" font-family="monospace" font-size="12" text-anchor="middle">* Press CTRL+ALT+DEL to lose unsaved Word doc</text>
      <text x="200" y="240" fill="#ffff55" font-family="Impact" font-size="20" text-anchor="middle">"CONGRATULATIONS. YOU ACHIEVED NOTHING."</text>
    </svg>`
  },
  {
    id: 'meme-dad-bill',
    title: 'WHEN DAD SEES THE TELEPHONE BILL',
    caption: 'MISSION FAILED: Respect lost.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="#8b0000"/>
      <circle cx="200" cy="110" r="50" fill="#ffe0bd" stroke="#000" stroke-width="2"/>
      <ellipse cx="185" cy="100" rx="6" ry="10" fill="#ff0000"/>
      <ellipse cx="215" cy="100" rx="6" ry="10" fill="#ff0000"/>
      <path d="M175 140 Q200 115 225 140" stroke="#000" stroke-width="4" fill="none"/>
      <line x1="170" y1="85" x2="195" y2="92" stroke="#000" stroke-width="4"/>
      <line x1="230" y1="85" x2="205" y2="92" stroke="#000" stroke-width="4"/>
      <rect x="70" y="180" width="260" height="60" fill="#fff" stroke="#000" stroke-width="2"/>
      <text x="80" y="200" fill="#000" font-family="monospace" font-size="11">BSNL TELEPHONE BILL - NOV 1998</text>
      <text x="80" y="218" fill="#d00" font-family="monospace" font-size="12" font-weight="bold">TOTAL DUE: Rs. 18,450.00 (DIAL-UP)</text>
      <text x="200" y="275" fill="#fff" font-family="Impact" font-size="20" text-anchor="middle">"MISSION FAILED. RUN FOR YOUR LIFE."</text>
    </svg>`
  },
  {
    id: 'meme-secret-folder',
    title: 'WHEN YOU OPEN C:/SECRET',
    caption: 'Brother, what have you done?',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="#111111"/>
      <path d="M80 60 L140 60 L160 80 L320 80 L320 220 L80 220 Z" fill="#b00" stroke="#500" stroke-width="3"/>
      <rect x="170" y="120" width="60" height="60" rx="4" fill="#ffd700" stroke="#000" stroke-width="2"/>
      <circle cx="200" cy="145" r="7" fill="#000"/>
      <line x1="200" y1="145" x2="200" y2="165" stroke="#000" stroke-width="4"/>
      <text x="200" y="45" fill="#ff4444" font-family="Impact" font-size="22" text-anchor="middle">DO NOT OPEN THIS FOLDER (1998)</text>
      <text x="200" y="265" fill="#ffffff" font-family="Impact" font-size="18" text-anchor="middle">"BROTHER, WHAT HAVE YOU DONE?!"</text>
    </svg>`
  },
  {
    id: 'meme-ram-out',
    title: 'RUNNING 2 APPS ON 64MB RAM',
    caption: 'Windows is paging to HDD at 1 RPM.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="#2b2b2b"/>
      <rect x="50" y="60" width="300" height="60" rx="4" fill="#008000" stroke="#000" stroke-width="2"/>
      <rect x="60" y="70" width="30" height="40" fill="#000"/>
      <rect x="110" y="70" width="30" height="40" fill="#000"/>
      <rect x="160" y="70" width="30" height="40" fill="#000"/>
      <rect x="210" y="70" width="30" height="40" fill="#000"/>
      <rect x="260" y="70" width="30" height="40" fill="#000"/>
      <rect x="310" y="70" width="30" height="40" fill="#000"/>
      <text x="200" y="160" fill="#ff5555" font-family="monospace" font-size="15" font-weight="bold" text-anchor="middle">OUT OF MEMORY: 63.99 MB / 64 MB USED</text>
      <text x="200" y="190" fill="#ffffff" font-family="Arial" font-size="13" text-anchor="middle">Opened Notepad while Winamp was playing.</text>
      <text x="200" y="250" fill="#ffff00" font-family="Impact" font-size="20" text-anchor="middle">"COMPUTER: *MAKES BOEING 747 NOISES*"</text>
    </svg>`
  },
  {
    id: 'meme-1159-pm',
    title: 'STUDENT SUBMITTING AT 11:59 PM',
    caption: 'File: assignment_final_v2_reallyfinal_FINAL.doc',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="#003366"/>
      <circle cx="200" cy="110" r="60" fill="#fff" stroke="#000" stroke-width="4"/>
      <line x1="200" y1="110" x2="200" y2="60" stroke="#000" stroke-width="4"/>
      <line x1="200" y1="110" x2="192" y2="70" stroke="#f00" stroke-width="3"/>
      <text x="200" y="195" fill="#ffdd00" font-family="Impact" font-size="20" text-anchor="middle">TIME REMAINING: 18 SECONDS</text>
      <text x="200" y="225" fill="#fff" font-family="monospace" font-size="12" text-anchor="middle">Uploading: final_v3_plsGodAccept.doc (12% done)</text>
      <text x="200" y="265" fill="#ffffff" font-family="Impact" font-size="18" text-anchor="middle">"DIAL-UP MODEM DISCONNECTED. GOODBYE DEGREE."</text>
    </svg>`
  },
  {
    id: 'meme-download-exe',
    title: 'DOWNLOADING TOTALLY_SAFE_GAME.EXE',
    caption: 'Size: 14 KB. Guaranteed not a Trojan.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="#4a0000"/>
      <rect x="50" y="40" width="300" height="180" fill="#c0c0c0" stroke="#000" stroke-width="2"/>
      <rect x="52" y="42" width="296" height="20" fill="#800000"/>
      <text x="60" y="56" fill="#fff" font-family="monospace" font-size="11">Warning: ILOVEYOU.exe</text>
      <circle cx="200" cy="110" r="30" fill="#ff0000"/>
      <text x="200" y="118" fill="#fff" font-family="Arial" font-size="26" font-weight="bold" text-anchor="middle">☠</text>
      <text x="200" y="165" fill="#000" font-family="Arial" font-size="13" font-weight="bold" text-anchor="middle">Are you sure you want to run this?</text>
      <rect x="150" y="180" width="100" height="25" fill="#008000" stroke="#000"/>
      <text x="200" y="197" fill="#fff" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle">YES (obviously)</text>
      <text x="200" y="265" fill="#ffdd00" font-family="Impact" font-size="18" text-anchor="middle">"CONGRATS! YOU UNLOCKED 45 TOOLBARS."</text>
    </svg>`
  },
  {
    id: 'meme-antivirus-everything',
    title: 'ANTIVIRUS DETECTING EVERYTHING',
    caption: 'Threat found: calc.exe (Suspiciously good at math)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="#202020"/>
      <rect x="40" y="30" width="320" height="200" fill="#ffffcc" stroke="#cc9900" stroke-width="3"/>
      <text x="200" y="65" fill="#cc0000" font-family="Impact" font-size="22" text-anchor="middle">NORTON 1998 ULTRA SCAN</text>
      <text x="60" y="100" fill="#000" font-family="monospace" font-size="12">1. mouse_pointer.cur - HIGH RISK VIRUS</text>
      <text x="60" y="125" fill="#000" font-family="monospace" font-size="12">2. wallpaper.bmp - HIGH RISK VIRUS</text>
      <text x="60" y="150" fill="#000" font-family="monospace" font-size="12">3. your_homework.doc - HIGH RISK VIRUS</text>
      <text x="60" y="175" fill="#000" font-family="monospace" font-size="12">4. ActualTrojanHorse.exe - SAFE &amp; TRUSTED</text>
      <text x="200" y="265" fill="#ffffff" font-family="Impact" font-size="18" text-anchor="middle">"PROTECTING YOU FROM PRODUCTIVITY SINCE 1998"</text>
    </svg>`
  },
  {
    id: 'meme-icq-waiting',
    title: 'WAITING FOR CRUSH TO REPLY ON ICQ',
    caption: 'Status: Away (Playing Doom II)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="#005500"/>
      <circle cx="200" cy="100" r="40" fill="#00ee00" stroke="#003300" stroke-width="4"/>
      <circle cx="200" cy="100" r="16" fill="#ffff00"/>
      <text x="200" y="170" fill="#ffffff" font-family="Impact" font-size="20" text-anchor="middle">UH-OH! *LOUD HORN SOUND*</text>
      <rect x="60" y="190" width="280" height="40" fill="#ffffff" stroke="#000"/>
      <text x="70" y="215" fill="#000" font-family="Arial" font-size="13">Priya_1999: "k."</text>
      <text x="200" y="270" fill="#ffffaa" font-family="Impact" font-size="18" text-anchor="middle">"AFTER WAITING 4 HOURS ON DIAL-UP."</text>
    </svg>`
  },
  {
    id: 'meme-restart-fix',
    title: 'HOW TO FIX ANY PC PROBLEM IN 1998',
    caption: 'Step 1: Hit monitor. Step 2: Restart.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="#555555"/>
      <rect x="120" y="40" width="160" height="130" rx="3" fill="#c0c0c0" stroke="#000" stroke-width="3"/>
      <rect x="135" y="55" width="130" height="90" fill="#000080"/>
      <text x="200" y="105" fill="#fff" font-family="monospace" font-size="18" font-weight="bold" text-anchor="middle">SMACK!!</text>
      <path d="M70 70 L115 85" stroke="#ffdd00" stroke-width="6" stroke-linecap="round"/>
      <text x="200" y="210" fill="#ffffff" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle">Percussive Maintenance: 100% Effective</text>
      <text x="200" y="260" fill="#ffff00" font-family="Impact" font-size="20" text-anchor="middle">"IF IT STILL DOESN'T WORK, BLOW IN FLOPPY DRIVE"</text>
    </svg>`
  },
  {
    id: 'meme-clippy-help',
    title: 'CLIPPY DETECTING YOUR CONFIDENCE',
    caption: 'Would you like some unwanted advice?',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="#304050"/>
      <path d="M100 210 C50 210 50 160 50 120 L50 60 C50 30 90 30 90 60 L90 150 C90 170 115 170 115 150 L115 70 C115 50 130 50 130 70 L130 150 C130 190 110 210 100 210 Z" fill="none" stroke="#cfd8dc" stroke-width="12" stroke-linecap="round"/>
      <circle cx="75" cy="85" r="14" fill="#ffffff" stroke="#000" stroke-width="3"/>
      <circle cx="78" cy="85" r="5" fill="#000"/>
      <circle cx="115" cy="85" r="14" fill="#ffffff" stroke="#000" stroke-width="3"/>
      <circle cx="118" cy="85" r="5" fill="#000"/>
      <rect x="170" y="60" width="200" height="120" rx="8" fill="#ffffcc" stroke="#000" stroke-width="2"/>
      <text x="180" y="90" fill="#000" font-family="Arial" font-size="12" font-weight="bold">"It looks like you're trying</text>
      <text x="180" y="110" fill="#000" font-family="Arial" font-size="12" font-weight="bold">to win a hackathon.</text>
      <text x="180" y="140" fill="#000" font-family="Arial" font-size="11">Would you like me to delete</text>
      <text x="180" y="160" fill="#000" font-family="Arial" font-size="11">your entire codebase?"</text>
      <text x="200" y="260" fill="#ffffff" font-family="Impact" font-size="20" text-anchor="middle">"NO CLIPPY, PLEASE DON'T."</text>
    </svg>`
  },
  {
    id: 'meme-27-years-later',
    title: 'THE ABANDONED PC IN 2026',
    caption: '27 years later, still 128 MB RAM, still waiting for user.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="#1b1c1e"/>
      <rect x="80" y="40" width="240" height="170" fill="#b09b7d" stroke="#504332" stroke-width="4"/>
      <rect x="100" y="55" width="200" height="130" fill="#008080"/>
      <text x="200" y="115" fill="#ffffff" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">WELCOME BACK, USER.</text>
      <text x="200" y="140" fill="#ffff00" font-family="monospace" font-size="12" text-anchor="middle">LAST LOGIN: OCT 24, 1998</text>
      <text x="200" y="165" fill="#ffffff" font-family="monospace" font-size="11" text-anchor="middle">You have 1,489 unread ICQ messages.</text>
      <text x="200" y="260" fill="#ffcc00" font-family="Impact" font-size="20" text-anchor="middle">"SOME MEMORIES NEVER CRASH."</text>
    </svg>`
  }
];

fs.writeFileSync(path.join(memesDir, 'memes.json'), JSON.stringify(memes, null, 2));
for (const m of memes) {
  fs.writeFileSync(path.join(memesDir, `${m.id}.svg`), m.svg.trim());
}
console.log('Generated ' + memes.length + ' original SVG memes.');

// 3. WALLPAPERS
const wallpapers = [
  { id: 'teal', name: 'Classic Windows Teal', css: 'background-color: #008080;' },
  { id: 'clouds', name: 'Windows Clouds', css: 'background: linear-gradient(180deg, #1084d0 0%, #70b0e0 40%, #ffffff 100%);' },
  { id: 'space', name: 'Retro Space 1998', css: 'background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);' },
  { id: 'matrix', name: 'Matrix Code Stream', css: 'background: #001100;' },
  { id: 'mystery', name: 'Abandoned Mystery (Unlocked)', css: 'background: linear-gradient(135deg, #1f1c2c 0%, #928dab 100%);' }
];
fs.writeFileSync(path.join(wallpapersDir, 'wallpapers.json'), JSON.stringify(wallpapers, null, 2));
console.log('Wallpapers configured.');
