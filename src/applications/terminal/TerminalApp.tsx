import React, { useState, useRef, useEffect } from 'react';
import { useStoryStore } from '../../store/storyStore';
import { useWindowStore } from '../../store/windowStore';

interface HistoryLine {
  text: string;
  isCommand?: boolean;
}

export const TerminalApp: React.FC = () => {
  const { unlockDiscovery, triggerBSOD } = useStoryStore();
  const { closeWindow, getWindowByAppId } = useWindowStore();

  const [history, setHistory] = useState<HistoryLine[]>([
    { text: 'Microsoft(R) Windows 98' },
    { text: '(C)Copyright Microsoft Corp 1981-1998.' },
    { text: 'Type "help" for a list of available DOS commands.' },
    { text: '' }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const newLines: HistoryLine[] = [{ text: `C:\\WINDOWS> ${raw}`, isCommand: true }];

    switch (cmd) {
      case 'help':
        newLines.push(
          { text: 'SUPPORTED COMMANDS:' },
          { text: '  dir        - List directory files' },
          { text: '  cls        - Clear screen' },
          { text: '  date       - Display current date' },
          { text: '  time       - Display current time' },
          { text: '  whoami     - Display logged in user' },
          { text: '  about      - Abandoned PC system specs' },
          { text: '  matrix     - Secret digital stream' },
          { text: '  joke       - Tell a retro 90s computer joke' },
          { text: '  fortune    - Dispense vintage tech wisdom' },
          { text: '  coffee     - Brew a cup of coffee' },
          { text: '  secret     - Query classified archives' },
          { text: '  crash      - Induce fatal blue screen' },
          { text: '  exit       - Close MS-DOS prompt' },
          { text: 'HINT: Try hidden commands (hack_nasa, sudo hire_me, format c:, find_love)...' }
        );
        break;

      case 'dir':
        newLines.push(
          { text: ' Volume in drive C is WIN98_SYSTEM' },
          { text: ' Volume Serial Number is 420A-1998' },
          { text: ' Directory of C:\\' },
          { text: 'WINDOWS        <DIR>        08-24-98  11:15a' },
          { text: 'PROGRA~1       <DIR>        08-24-98  11:15a' },
          { text: 'MYDOCU~1       <DIR>        04-12-03   6:22p' },
          { text: 'MYPICT~1       <DIR>        11-04-02   2:05p' },
          { text: 'DOWNLOADS      <DIR>        06-18-01   2:15a' },
          { text: 'SECRET         <DIR>        11-01-05   3:33a' },
          { text: 'AUTOEXEC.BAT         128    08-24-98  10:00a' },
          { text: 'CONFIG.SYS            84    08-24-98  10:00a' },
          { text: '        2 File(s)            212 bytes' },
          { text: '        6 Dir(s)   2,843,058,176 bytes free' }
        );
        break;

      case 'cls':
        setHistory([]);
        return;

      case 'date':
        newLines.push({ text: `Current date is: ${new Date().toDateString()}` });
        break;

      case 'time':
        newLines.push({ text: `Current time is: ${new Date().toTimeString()}` });
        break;

      case 'whoami':
        newLines.push({ text: 'User: Alex Sharma (Host: PENTIUM-II-350 / IIT Bhilai)' });
        break;

      case 'about':
        newLines.push(
          { text: 'SYSTEM: Microsoft Windows 98 Second Edition 4.10.2222 A' },
          { text: 'CPU: Intel Pentium II @ 350MHz | RAM: 128MB SDRAM' },
          { text: 'HDD: Seagate 4.3 GB Ultra ATA | Video: 3dfx Voodoo2 12MB' },
          { text: 'Audio: Creative Sound Blaster 16 | Modem: USRobotics 56k V.90' }
        );
        break;

      case 'matrix':
        unlockDiscovery('dos-hacker');
        newLines.push({ text: 'Wake up, Neo... The Matrix has you. Follow the white rabbit.' });
        break;

      case 'joke':
        newLines.push({ text: 'Q: Why did the computer squeak? A: Because it had a mouse attached.' });
        break;

      case 'fortune':
        newLines.push({ text: '"He who saves before compiling shall never weep in darkness."' });
        break;

      case 'coffee':
        newLines.push({ text: 'ERROR 418: I am a teletype terminal, not a coffee machine.' });
        break;

      case 'secret':
        unlockDiscovery('dos-hacker');
        newLines.push({ text: 'DECRYPTED: Check C:/Secret/DO_NOT_OPEN/why_this_pc_was_abandoned.txt' });
        break;

      case 'crash':
        triggerBSOD();
        return;

      case 'format c:':
        unlockDiscovery('dos-hacker');
        newLines.push(
          { text: 'WARNING: ALL DATA ON LOCAL DISK C: WILL BE LOST!' },
          { text: 'Proceed with Format (Y/N)? Y' },
          { text: 'ERROR: Windows 98 refuses to format drive while Alex Sharma ghost is active.' }
        );
        break;

      case 'sudo hire_me':
        unlockDiscovery('dos-hacker');
        newLines.push(
          { text: 'ROOT ACCESS GRANTED.' },
          { text: 'Gandhi Hackathon Evaluator: "Hired on the spot with 1st Prize!"' }
        );
        break;

      case 'hack_nasa':
        unlockDiscovery('dos-hacker');
        newLines.push(
          { text: 'Dialing NASA Satellite via 56k dial-up...' },
          { text: 'Handshake: 9600 baud...' },
          { text: 'Access Denied: Mom picked up the telephone downstairs.' }
        );
        break;

      case 'rm -rf motivation':
        newLines.push({ text: 'Error: file "motivation" was already missing since 1998.' });
        break;

      case 'find_love':
        newLines.push({ text: 'Scanning ICQ registry... Priya_1999 is currently online!' });
        break;

      case 'exit':
        const win = getWindowByAppId('terminal');
        if (win) closeWindow(win.id);
        return;

      default:
        newLines.push({ text: `Bad command or file name: "${raw}"` });
        break;
    }

    setHistory((prev) => [...prev, ...newLines]);
    setInputVal('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#000000',
        color: '#c0c0c0',
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: '12px',
        padding: '6px',
        overflowY: 'auto'
      }}
      onClick={() => document.getElementById('terminal-input')?.focus()}
    >
      {history.map((h, i) => (
        <div key={i} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.3' }}>
          {h.text}
        </div>
      ))}

      {/* Active Prompt */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>C:\WINDOWS&gt;&nbsp;</span>
        <input
          id="terminal-input"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCommand(inputVal);
          }}
          autoFocus
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '12px',
            padding: 0
          }}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
