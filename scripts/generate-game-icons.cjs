const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'public', 'icons');

const icons = {
  'papa.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="3" y="3" width="26" height="26" rx="2" fill="#e0e0e0" stroke="#808080" stroke-width="1.5"/>
    <circle cx="16" cy="14" r="8" fill="#ffd1a4" stroke="#805030" stroke-width="1"/>
    <ellipse cx="13" cy="13" rx="1.5" ry="2" fill="#ff0000"/>
    <ellipse cx="19" cy="13" rx="1.5" ry="2" fill="#ff0000"/>
    <path d="M10 10 L14 11" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M22 10 L18 11" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M12 17 Q16 19 20 17" stroke="#000" stroke-width="2.5" fill="none"/>
    <rect x="11" y="22" width="10" height="7" fill="#ffffff" stroke="#000" stroke-width="1"/>
    <text x="16" y="27" font-size="4" font-family="sans-serif" font-weight="bold" text-anchor="middle" fill="#900">PAPA</text>
  </svg>`,
  'cyber-cafe.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="2" y="4" width="28" height="24" rx="2" fill="#2b3a4a" stroke="#102030" stroke-width="1.5"/>
    <rect x="5" y="6" width="14" height="11" fill="#008080" stroke="#fff" stroke-width="1"/>
    <rect x="6" y="8" width="12" height="7" fill="#000"/>
    <text x="12" y="13" font-size="3.5" font-family="monospace" fill="#00ff00" text-anchor="middle">CS 1.6</text>
    <rect x="8" y="18" width="8" height="2" fill="#888"/>
    <rect x="22" y="8" width="6" height="12" rx="1" fill="#d2691e" stroke="#fff" stroke-width="0.8"/>
    <path d="M23 7 Q25 4 27 7" fill="none" stroke="#fff" stroke-width="0.8"/>
    <rect x="4" y="22" width="24" height="4" fill="#c0c0c0" stroke="#000" stroke-width="1"/>
    <text x="16" y="25" font-size="3" font-family="sans-serif" font-weight="bold" text-anchor="middle" fill="#000">2005 CAFE</text>
  </svg>`,
  'download-99.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="3" y="3" width="26" height="26" rx="2" fill="#c0c0c0" stroke="#000" stroke-width="1.5"/>
    <rect x="5" y="5" width="22" height="5" fill="#000080"/>
    <text x="7" y="9" font-size="3.5" font-family="sans-serif" fill="#fff" font-weight="bold">99% DL</text>
    <rect x="5" y="13" width="22" height="8" fill="#fff" stroke="#808080" stroke-width="1"/>
    <rect x="6" y="14" width="19" height="6" fill="#000080"/>
    <text x="16" y="19" font-size="4.5" font-family="sans-serif" fill="#ffdd00" font-weight="bold" text-anchor="middle">99%</text>
    <line x1="6" y1="25" x2="26" y2="25" stroke="#ff0000" stroke-width="2" stroke-dasharray="2,1"/>
  </svg>`,
  'games-folder.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path d="M2 8 L11 8 L14 11 L28 11 L28 26 L2 26 Z" fill="#e67e22" stroke="#a04000" stroke-width="1.5"/>
    <polygon points="2,13 28,13 25,26 5,26" fill="#f39c12"/>
    <circle cx="16" cy="20" r="4" fill="#000"/>
    <rect x="13" y="19" width="6" height="2" fill="#fff"/>
    <rect x="15" y="17" width="2" height="6" fill="#fff"/>
  </svg>`,
  'achievements.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect x="3" y="3" width="26" height="26" rx="2" fill="#ffd700" stroke="#b8860b" stroke-width="1.5"/>
    <path d="M10 7 L22 7 L20 17 L12 17 Z" fill="#ffec8b" stroke="#b8860b" stroke-width="1"/>
    <rect x="14" y="17" width="4" height="5" fill="#b8860b"/>
    <rect x="11" y="22" width="10" height="4" rx="1" fill="#8b4513"/>
    <text x="16" y="14" font-size="6" font-family="sans-serif" font-weight="bold" text-anchor="middle" fill="#d2691e">★</text>
  </svg>`
};

for (const [name, content] of Object.entries(icons)) {
  fs.writeFileSync(path.join(dir, name), content.trim());
}
console.log('Generated game icons successfully.');
