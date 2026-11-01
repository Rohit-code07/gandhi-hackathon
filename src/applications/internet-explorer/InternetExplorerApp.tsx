import React, { useState } from 'react';
import { useStoryStore } from '../../store/storyStore';
import { useWindowStore } from '../../store/windowStore';

interface PageItem {
  url: string;
  title: string;
  component: React.ReactNode;
}

export const InternetExplorerApp: React.FC = () => {
  const { unlockDiscovery } = useStoryStore();
  const { openWindow } = useWindowStore();

  const [currentUrl, setCurrentUrl] = useState<string>('www.google.com');
  const [inputUrl, setInputUrl] = useState<string>('www.google.com');
  const [history, setHistory] = useState<string[]>(['www.google.com']);
  const [historyIdx, setHistoryIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [guestbookEntries, setGuestbookEntries] = useState<string[]>([
    'Rahul_007: Cool page bro! Add more Doom II cheats.',
    'Priya: Nice webpage Alex. Why is there a picture of a broken floppy drive?',
    'CyberGhost: THE TRUTH IS IN C:/SECRET/DO_NOT_OPEN'
  ]);
  const [newComment, setNewComment] = useState<string>('');

  const navigateTo = (url: string) => {
    setIsLoading(true);
    let target = url.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!target.startsWith('www.')) target = 'www.' + target;

    setTimeout(() => {
      const nextHist = history.slice(0, historyIdx + 1);
      nextHist.push(target);
      setHistory(nextHist);
      setHistoryIdx(nextHist.length - 1);
      setCurrentUrl(target);
      setInputUrl(target);
      setIsLoading(false);

      if (target.includes('mystery') || target.includes('geocities')) {
        unlockDiscovery('dial-up');
      }
    }, 300);
  };

  const handleBack = () => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      setCurrentUrl(history[historyIdx - 1]);
      setInputUrl(history[historyIdx - 1]);
    }
  };

  const handleForward = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      setCurrentUrl(history[historyIdx + 1]);
      setInputUrl(history[historyIdx + 1]);
    }
  };

  const renderContent = () => {
    // 1. Google 1998
    if (currentUrl.includes('google')) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 20px', fontFamily: 'Times New Roman, serif' }}>
          <div style={{ fontSize: '54px', fontWeight: 'bold', letterSpacing: '-2px', marginBottom: '10px' }}>
            <span style={{ color: '#0039b6' }}>G</span>
            <span style={{ color: '#c41200' }}>o</span>
            <span style={{ color: '#f3c300' }}>o</span>
            <span style={{ color: '#0039b6' }}>g</span>
            <span style={{ color: '#008700' }}>l</span>
            <span style={{ color: '#c41200' }}>e</span>
            <span style={{ color: '#0039b6', fontStyle: 'italic', fontSize: '42px' }}>!</span>
          </div>

          <p style={{ fontSize: '13px', color: '#333' }}>Search the web using Google!</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              defaultValue="Gandhi Hackathon IIT Bhilai"
              style={{ width: '320px', padding: '3px' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
            <button className="win-button" onClick={() => navigateTo('www.iitbhilai-hackathon98.org')}>
              Google Search
            </button>
            <button className="win-button" onClick={() => navigateTo('www.geocities.com')}>
              I'm feeling lucky
            </button>
          </div>

          <div style={{ background: '#e0f0ff', padding: '10px', border: '1px solid #b0c0e0', maxWidth: '480px', margin: '0 auto', fontSize: '12px' }}>
            <p style={{ margin: 0 }}>Special 1998 Features:</p>
            <p style={{ margin: '4px 0 0 0' }}>
              <a href="#dialup" onClick={() => openWindow('dial-up')} style={{ color: '#0000aa' }}>Connect to Dial-Up Modem</a> |{' '}
              <a href="#memes" onClick={() => openWindow('meme-factory')} style={{ color: '#0000aa' }}>1998 Meme Archives</a>
            </p>
          </div>

          <p style={{ marginTop: '40px', fontSize: '11px', color: '#666' }}>
            Copyright &copy;1998 Google Inc. - Stanford University
          </p>
        </div>
      );
    }

    // 2. Geocities Personal Homepage of Alex Sharma
    if (currentUrl.includes('geocities')) {
      return (
        <div style={{ backgroundColor: '#000033', color: '#ffff00', padding: '20px', minHeight: '100%', fontFamily: 'Comic Sans MS, Arial' }}>
          <div style={{ background: '#ff0000', color: '#ffffff', padding: '4px', fontWeight: 'bold', overflow: 'hidden', whiteSpace: 'nowrap', textAlign: 'center' }}>
            *** WELCOME TO ALEX'S RETRO CYBER REALM! BEST VIEWED AT 800x600 WITH NETSCAPE COMMUNICATOR ***
          </div>

          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <h1 style={{ color: '#00ffff', textShadow: '2px 2px #ff00ff' }}>
              ⚡ ALEX'S PENTIUM II DEN ⚡
            </h1>
            <p style={{ color: '#ffffff' }}>Last updated: Nov 1998 | Webmaster: Alex Sharma</p>
            <div style={{ display: 'inline-block', border: '2px dashed #ffff00', padding: '6px 14px', background: '#000' }}>
              🚧 UNDER CONSTRUCTION FOREVER 🚧
            </div>
          </div>

          <div style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(0,0,0,0.7)', padding: '16px', border: '2px solid #00ffff' }}>
            <h3 style={{ color: '#ff00aa', borderBottom: '1px solid #00ffff', paddingBottom: '4px' }}>My Cool Links</h3>
            <ul style={{ color: '#ffffff', lineHeight: '1.8' }}>
              <li><a href="#mp3" onClick={() => navigateTo('www.free-mp3-download.com')} style={{ color: '#00ff00' }}>Free MP3 Music Downloads (14 hours download)</a></li>
              <li><a href="#orkut" onClick={() => navigateTo('www.orkut.com')} style={{ color: '#00ff00' }}>Orkut / IRC Chat Club</a></li>
              <li><a href="#secret" onClick={() => navigateTo('www.mystery-virus.com')} style={{ color: '#ff3333' }}>WARNING: The Truth Behind Folder 1998</a></li>
            </ul>

            <h3 style={{ color: '#ff00aa', borderBottom: '1px solid #00ffff', paddingBottom: '4px', marginTop: '20px' }}>Sign My Guestbook!</h3>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Leave a message..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                className="win-button"
                onClick={() => {
                  if (newComment.trim()) {
                    setGuestbookEntries([...guestbookEntries, `Guest: ${newComment}`]);
                    setNewComment('');
                  }
                }}
              >
                Sign!
              </button>
            </div>
            {guestbookEntries.map((c, i) => (
              <div key={i} style={{ fontSize: '11px', color: '#ffffbb', padding: '2px 0' }}>• {c}</div>
            ))}

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <div style={{ display: 'inline-block', background: '#000', border: '1px solid #0f0', padding: '4px 10px', color: '#0f0', fontFamily: 'monospace' }}>
                YOU ARE VISITOR NUMBER: <b>004,281</b>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 3. Free MP3 Download (Hilarious 90s Napster/Dial-up Parody)
    if (currentUrl.includes('mp3') || currentUrl.includes('download')) {
      return (
        <div style={{ background: '#222222', color: '#ffffff', padding: '20px', minHeight: '100%', fontFamily: 'Arial' }}>
          <div style={{ background: '#ffff00', color: '#000', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>
            🔥 TOP MP3 DOWNLOADS 1998-2001 - SPEED: 3.2 KB/S ON 56K MODEM 🔥
          </div>
          <div style={{ maxWidth: '620px', margin: '20px auto', background: '#333', padding: '16px', border: '2px solid #555' }}>
            <h3>Available Tracks:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { title: 'Linkin Park - In The End.mp3', size: '3.8 MB', eta: '1 hr 45 min' },
                { title: 'Darude - Sandstorm (Original Mix).mp3', size: '4.2 MB', eta: '2 hr 10 min' },
                { title: 'Backstreet Boys - I Want It That Way.mp3', size: '3.1 MB', eta: '1 hr 20 min' },
                { title: 'totally_not_a_virus.exe.mp3', size: '14 KB', eta: '4 seconds' }
              ].map((t, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#444', padding: '8px', border: '1px solid #666' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#00ffff' }}>{t.title}</div>
                    <div style={{ fontSize: '11px', color: '#aaa' }}>Size: {t.size} | Est: {t.eta}</div>
                  </div>
                  <button
                    className="win-button"
                    onClick={() => {
                      if (t.title.includes('virus')) {
                        openWindow('fake-virus');
                      } else {
                        alert(`Starting download of ${t.title}... Please tell your family not to pick up the telephone!`);
                      }
                    }}
                  >
                    Download MP3
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 4. Mystery Virus Conspiracy Page
    if (currentUrl.includes('mystery') || currentUrl.includes('virus')) {
      return (
        <div style={{ background: '#000000', color: '#00ff00', padding: '20px', minHeight: '100%', fontFamily: 'Courier New, monospace' }}>
          <h2 style={{ color: '#ff0000', textAlign: 'center' }}>⚠ DECLASSIFIED DOSSIER: Y2K &amp; THE ABANDONED PC ⚠</h2>
          <div style={{ maxWidth: '640px', margin: '0 auto', lineHeight: '1.6', fontSize: '13px' }}>
            <p>Subject: Alex Sharma's Computer (1998 - 2026)</p>
            <p>Status: Dormant for 27 years until Gandhi Hackathon judges reactivated it.</p>
            <p>Known anomalies discovered inside the filesystem:</p>
            <ol style={{ paddingLeft: '20px' }}>
              <li>The computer has a secret consciousness that produces quirky error popups.</li>
              <li>A hidden virus file exists at <b>C:/Downloads/ILOVEYOU.exe</b>.</li>
              <li>The reason for abandonment is stored at <b>C:/Secret/DO_NOT_OPEN/why_this_pc_was_abandoned.txt</b>.</li>
              <li>The Konami code transforms the desktop into a Matrix green terminal.</li>
            </ol>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button className="win-button" onClick={() => openWindow('terminal')}>
                Open MS-DOS Prompt Console
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 5. Gandhi Hackathon IIT Bhilai Portal
    return (
      <div style={{ background: '#ffffff', color: '#000000', padding: '24px', minHeight: '100%', fontFamily: 'Georgia, serif' }}>
        <div style={{ borderBottom: '3px double #000080', paddingBottom: '10px', textAlign: 'center' }}>
          <h1 style={{ color: '#000080', margin: 0 }}>GANDHI HACKATHON 2026</h1>
          <h3 style={{ color: '#800000', margin: '4px 0 0 0' }}>IIT Bhilai - Innovation &amp; Technology Showcase</h3>
        </div>

        <div style={{ maxWidth: '650px', margin: '20px auto', fontSize: '13px', lineHeight: '1.7' }}>
          <p>
            <b>Project: THE ABANDONED PC (Windows 98 Interactive Simulator)</b>
          </p>
          <p>
            Welcome respected judges and faculty of IIT Bhilai! You are experiencing a complete, authentic, deeply interactive recreation of Windows 98 Second Edition.
          </p>
          <div style={{ background: '#f5f5f5', border: '1px solid #ccc', padding: '12px', margin: '14px 0' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#000080' }}>Key Features To Test Today:</h4>
            <ul>
              <li><b>Meme Factory:</b> 12 original vintage memes &amp; generator with PNG download.</li>
              <li><b>Storyline Exploration:</b> Read Alex's diary, personal secrets &amp; why the PC was abandoned.</li>
              <li><b>Playable Games:</b> Solitaire, Minesweeper, and retro Snake!</li>
              <li><b>Easter Eggs:</b> Clippy, 56k dial-up audio, BSOD, Konami code (Up Up Down Down...).</li>
              <li><b>Judges Presentation Mode:</b> Press <code>CTRL + SHIFT + H</code> for automatic demo sequence!</li>
            </ul>
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button className="win-button" style={{ fontWeight: 'bold' }} onClick={() => openWindow('meme-factory')}>
              Open Meme Factory Now &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0' }}>
      {/* Menu Bar */}
      <div className="win-menubar">
        <div className="win-menu-item"><u>F</u>ile</div>
        <div className="win-menu-item"><u>E</u>dit</div>
        <div className="win-menu-item"><u>V</u>iew</div>
        <div className="win-menu-item" onClick={() => navigateTo('www.google.com')}><u>G</u>o</div>
        <div className="win-menu-item" onClick={() => navigateTo('www.geocities.com')}><u>F</u>avorites</div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 6px', borderBottom: '1px solid #808080' }}>
        <button className="win-button" onClick={handleBack} disabled={historyIdx <= 0} style={{ minWidth: '45px' }}>
          &larr; Back
        </button>
        <button className="win-button" onClick={handleForward} disabled={historyIdx >= history.length - 1} style={{ minWidth: '45px' }}>
          &rarr; Fwd
        </button>
        <button className="win-button" onClick={() => navigateTo(currentUrl)} style={{ minWidth: '55px' }}>
          🔄 Reload
        </button>
        <button className="win-button" onClick={() => navigateTo('www.google.com')} style={{ minWidth: '50px' }}>
          🏠 Home
        </button>

        {/* URL Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, marginLeft: '6px' }}>
          <span style={{ fontSize: '11px' }}>Address:</span>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigateTo(inputUrl);
            }}
            style={{ flex: 1, height: '20px' }}
          />
        </div>

        {/* Spinning IE Logo */}
        <div
          style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src="/icons/ie.svg"
            alt=""
            style={{
              width: '20px',
              height: '20px',
              animation: isLoading ? 'spin 1s linear infinite' : 'none'
            }}
          />
        </div>
      </div>

      {/* Bookmarks Bar */}
      <div style={{ display: 'flex', gap: '6px', padding: '2px 8px', background: '#dfdfdf', fontSize: '11px', borderBottom: '1px solid #808080' }}>
        <span style={{ color: '#000080', cursor: 'pointer' }} onClick={() => navigateTo('www.google.com')}>[Google 1998]</span>
        <span style={{ color: '#000080', cursor: 'pointer' }} onClick={() => navigateTo('www.geocities.com')}>[Alex's Geocities]</span>
        <span style={{ color: '#000080', cursor: 'pointer' }} onClick={() => navigateTo('www.free-mp3-download.com')}>[Free MP3s]</span>
        <span style={{ color: '#800000', cursor: 'pointer' }} onClick={() => navigateTo('www.mystery-virus.com')}>[Secret Virus Page]</span>
        <span style={{ color: '#006600', cursor: 'pointer' }} onClick={() => navigateTo('www.iitbhilai-hackathon98.org')}>[IIT Bhilai Hackathon]</span>
      </div>

      {/* Main Web Page Viewport */}
      <div className="win-inset" style={{ flex: 1, margin: '2px', overflowY: 'auto', background: '#ffffff' }}>
        {renderContent()}
      </div>

      {/* Status Bar */}
      <div className="win-statusbar">
        <div className="win-status-pane">
          {isLoading ? `Opening page ${currentUrl}...` : 'Done'}
        </div>
        <div className="win-status-pane" style={{ width: '120px' }}>
          Internet Zone (56k)
        </div>
      </div>
    </div>
  );
};
