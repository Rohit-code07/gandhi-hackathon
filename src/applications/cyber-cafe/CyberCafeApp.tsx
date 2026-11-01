import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../../services/soundService';
import { useAchievementsStore } from '../../store/achievementsStore';
import { useWindowStore } from '../../store/windowStore';

export type CustomerType = 'orkut' | 'gamer' | 'student' | 'office' | 'downloader' | 'suspicious';

interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  request: string;
  patience: number; // 100 to 0
  payAmount: number;
  sessionDuration: number; // in seconds
  elapsed: number;
  needsPrint?: boolean;
}

interface Computer {
  id: number;
  name: string;
  status: 'empty' | 'active' | 'hung' | 'broken';
  currentCustomer: Customer | null;
  ramMB: number; // 128, 256, 512
}

export const CyberCafeApp: React.FC = () => {
  const { unlockAchievement } = useAchievementsStore();
  const { openWindow } = useWindowStore();

  const [gameState, setGameState] = useState<'start' | 'playing' | 'paused' | 'gameover' | 'ending'>('start');
  const [day, setDay] = useState<number>(1);
  const [inGameHour, setInGameHour] = useState<number>(9); // 9 AM to 9 PM (21)
  const [inGameMinute, setInGameMinute] = useState<number>(0);
  const [money, setMoney] = useState<number>(500);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('win98_cybercafe_highscore') || 500);
  });
  const [satisfaction, setSatisfaction] = useState<number>(100);
  const [servedCount, setServedCount] = useState<number>(0);

  // Café Infrastructure
  const [internetType, setInternetType] = useState<'dialup' | 'isdn' | 'dsl' | 'fiber'>('dialup');
  const [hasUps, setHasUps] = useState<boolean>(false);
  const [hasLaserPrinter, setHasLaserPrinter] = useState<boolean>(false);
  const [printerPaperJam, setPrinterPaperJam] = useState<boolean>(false);
  const [modemConnected, setModemConnected] = useState<boolean>(true);

  // Computers
  const [computers, setComputers] = useState<Computer[]>([
    { id: 1, name: 'CABIN 1', status: 'empty', currentCustomer: null, ramMB: 128 },
    { id: 2, name: 'CABIN 2', status: 'empty', currentCustomer: null, ramMB: 128 },
    { id: 3, name: 'CABIN 3', status: 'empty', currentCustomer: null, ramMB: 128 },
    { id: 4, name: 'CABIN 4', status: 'empty', currentCustomer: null, ramMB: 128 },
    { id: 5, name: 'CABIN 5', status: 'empty', currentCustomer: null, ramMB: 128 }
  ]);

  // Queue of waiting customers
  const [queue, setQueue] = useState<Customer[]>([]);
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);

  // Notifications and events
  const [activeDialogue, setActiveDialogue] = useState<string | null>(null);
  const [endingType, setEndingType] = useState<'good' | 'bad' | 'secret'>('good');
  const [showShop, setShowShop] = useState<boolean>(false);

  const startNewGame = () => {
    setGameState('playing');
    setDay(1);
    setInGameHour(9);
    setInGameMinute(0);
    setMoney(500);
    setSatisfaction(100);
    setServedCount(0);
    setInternetType('dialup');
    setHasUps(false);
    setHasLaserPrinter(false);
    setPrinterPaperJam(false);
    setModemConnected(true);
    setComputers([
      { id: 1, name: 'CABIN 1', status: 'empty', currentCustomer: null, ramMB: 128 },
      { id: 2, name: 'CABIN 2', status: 'empty', currentCustomer: null, ramMB: 128 },
      { id: 3, name: 'CABIN 3', status: 'empty', currentCustomer: null, ramMB: 128 },
      { id: 4, name: 'CABIN 4', status: 'empty', currentCustomer: null, ramMB: 128 },
      { id: 5, name: 'CABIN 5', status: 'empty', currentCustomer: null, ramMB: 128 }
    ]);
    setQueue([]);
    setSelectedQueueId(null);
    setActiveDialogue('Sharma Cyber Café is OPEN! Serve customers before their patience runs out.');
    setTimeout(() => setActiveDialogue(null), 3500);
    soundService.playDing();
  };

  // Customer Generator
  const generateCustomer = (): Customer => {
    const types: CustomerType[] = ['orkut', 'gamer', 'student', 'office', 'downloader', 'suspicious'];
    const type = types[Math.floor(Math.random() * types.length)];
    const id = `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    switch (type) {
      case 'orkut':
        return {
          id,
          name: 'Rohan (Orkut)',
          type,
          request: 'Check Orkut scraps & testimonials',
          patience: 100,
          payAmount: 25,
          sessionDuration: 12,
          elapsed: 0
        };
      case 'gamer':
        return {
          id,
          name: 'Vikram (CS 1.6)',
          type,
          request: 'Counter-Strike 1.6 de_dust2 match',
          patience: 100,
          payAmount: 45,
          sessionDuration: 18,
          elapsed: 0
        };
      case 'student':
        return {
          id,
          name: 'Anjali (Student)',
          type,
          request: 'Print engineering assignment report',
          patience: 100,
          payAmount: 35,
          sessionDuration: 10,
          elapsed: 0,
          needsPrint: true
        };
      case 'office':
        return {
          id,
          name: 'Mr. Gupta (Accountant)',
          type,
          request: 'Urgent email to head office on Yahoo!',
          patience: 100,
          payAmount: 30,
          sessionDuration: 14,
          elapsed: 0
        };
      case 'downloader':
        return {
          id,
          name: 'Bunty (KaZaA)',
          type,
          request: 'Download full movie on 56k dial-up',
          patience: 100,
          payAmount: 60,
          sessionDuration: 22,
          elapsed: 0
        };
      case 'suspicious':
      default:
        return {
          id,
          name: 'Chintu (47 Tabs)',
          type,
          request: 'Opens 47 browser tabs at once',
          patience: 90,
          payAmount: 20,
          sessionDuration: 8,
          elapsed: 0
        };
    }
  };

  // Main Simulation Loop (1 second = 20 in-game minutes)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      // 1. Advance in-game clock
      setInGameMinute((m) => {
        if (m + 20 >= 60) {
          setInGameHour((h) => {
            const nextH = h + 1;
            if (nextH >= 21) {
              // 9:00 PM -> End of day!
              handleDayEnd();
              return 9; // reset to 9 AM
            }
            return nextH;
          });
          return 0;
        }
        return m + 20;
      });

      // 2. Spawn customer in queue if queue < 4
      if (Math.random() < 0.45 && queue.length < 4) {
        setQueue((q) => [...q, generateCustomer()]);
      }

      // 3. Decrease patience of waiting customers
      setQueue((q) => {
        const nextQ: Customer[] = [];
        for (const cust of q) {
          const nextPatience = cust.patience - 4;
          if (nextPatience <= 0) {
            // Customer leaves angry!
            setSatisfaction((s) => Math.max(10, s - 8));
            soundService.playError();
            setActiveDialogue(`${cust.name} left angrily: "Itna slow cybercafé kabhi nahi dekha!"`);
          } else {
            nextQ.push({ ...cust, patience: nextPatience });
          }
        }
        return nextQ;
      });

      // 4. Update Active Computers & Session progress
      setComputers((prevComputers) => {
        return prevComputers.map((comp) => {
          if (comp.status === 'active' && comp.currentCustomer) {
            // Check if modem is down
            if (!modemConnected) return comp;

            const nextElapsed = comp.currentCustomer.elapsed + 1;

            // Chance for computer to hang if RAM is low
            if (comp.ramMB === 128 && Math.random() < 0.04) {
              soundService.playError();
              setActiveDialogue(`${comp.name} HUNG! Click it to restart/smack cabinet.`);
              return { ...comp, status: 'hung' };
            }

            // Session completed?
            if (nextElapsed >= comp.currentCustomer.sessionDuration) {
              // If student still needs print, don't finish yet
              if (comp.currentCustomer.needsPrint) {
                return {
                  ...comp,
                  currentCustomer: { ...comp.currentCustomer, elapsed: nextElapsed }
                };
              }
            }

            return {
              ...comp,
              currentCustomer: {
                ...comp.currentCustomer,
                elapsed: nextElapsed
              }
            };
          }
          return comp;
        });
      });

      // 5. Random Events trigger
      if (Math.random() < 0.05 && !activeDialogue) {
        triggerCafeEvent();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, queue, modemConnected, computers, hasUps, activeDialogue]);

  // Handle End of Business Day
  const handleDayEnd = () => {
    soundService.playSuccess();

    if (internetType === 'dialup') {
      unlockAchievement('cafe-dialup-survivor');
    }

    if (day >= 5) {
      // Game Over: Evaluate 3 Endings
      if (money >= 2500 && satisfaction >= 70) {
        // Good Ending
        setEndingType('good');
        unlockAchievement('cafe-king');
      } else if (money < 200 || satisfaction < 40) {
        // Bad Ending
        setEndingType('bad');
      } else {
        // Secret Ending
        setEndingType('secret');
      }
      setGameState('ending');
    } else {
      setDay((d) => d + 1);
      setActiveDialogue(`☀️ DAY ${day + 1} BEGINS! Electricity bills paid. Ready for new customers.`);
    }
  };

  // Random Café Events
  const triggerCafeEvent = () => {
    const events = ['chai_spill', 'power_cut', 'modem_drop', 'paper_jam', 'dad_call'];
    const chosen = events[Math.floor(Math.random() * events.length)];

    if (chosen === 'power_cut') {
      if (hasUps) {
        setActiveDialogue('⚡ Power Cut! But your Inverter/UPS saved the computers!');
        soundService.playDing();
      } else {
        soundService.playError();
        setActiveDialogue('⚡ BATTI GUL! No UPS! All active computers shut down!');
        setComputers((prev) =>
          prev.map((c) => ({ ...c, status: 'empty', currentCustomer: null }))
        );
        setSatisfaction((s) => Math.max(10, s - 25));
      }
    } else if (chosen === 'modem_drop') {
      setModemConnected(false);
      soundService.playError();
      setActiveDialogue('📞 Dial-up dropped! Someone kicked the telephone wire. Click modem to reconnect!');
    } else if (chosen === 'paper_jam') {
      setPrinterPaperJam(true);
      setActiveDialogue('🖨️ Printer paper jam! Click printer to clear paper.');
    } else if (chosen === 'chai_spill') {
      // Hang one random computer
      const activePc = computers.find((c) => c.status === 'active');
      if (activePc) {
        soundService.playError();
        setActiveDialogue(`☕ Chai spilled on ${activePc.name} keyboard! Click to clean.`);
        setComputers((prev) =>
          prev.map((c) => (c.id === activePc.id ? { ...c, status: 'hung' } : c))
        );
      }
    } else if (chosen === 'dad_call') {
      setActiveDialogue('📞 Dad on phone: "Chai piyo aur hisab theek se likhna register mein!"');
    }
  };

  // Assign Customer to Computer
  const handleAssignToPc = (comp: Computer) => {
    if (comp.status !== 'empty') {
      // If customer finished session, collect cash!
      if (comp.currentCustomer && comp.currentCustomer.elapsed >= comp.currentCustomer.sessionDuration) {
        collectBill(comp);
        return;
      }
      // If computer hung, repair it
      if (comp.status === 'hung') {
        repairComputer(comp);
        return;
      }
      return;
    }

    if (!selectedQueueId) {
      setActiveDialogue('Select a waiting customer from the queue first!');
      return;
    }

    const customer = queue.find((c) => c.id === selectedQueueId);
    if (!customer) return;

    soundService.playClick();
    setComputers((prev) =>
      prev.map((c) =>
        c.id === comp.id
          ? { ...c, status: 'active', currentCustomer: customer }
          : c
      )
    );

    setQueue((prev) => prev.filter((c) => c.id !== selectedQueueId));
    setSelectedQueueId(null);
  };

  // Collect Payment & Free Computer
  const collectBill = (comp: Computer) => {
    if (!comp.currentCustomer) return;
    const earned = comp.currentCustomer.payAmount;

    soundService.playCash();
    const nextMoney = money + earned;
    setMoney(nextMoney);

    if (nextMoney >= 1000) {
      unlockAchievement('cafe-first-1000');
    }

    if (nextMoney > highScore) {
      setHighScore(nextMoney);
      localStorage.setItem('win98_cybercafe_highscore', String(nextMoney));
    }

    setSatisfaction((s) => Math.min(100, s + 4));
    setServedCount((sc) => {
      const next = sc + 1;
      if (next >= 20) unlockAchievement('cafe-100-customers');
      return next;
    });

    setActiveDialogue(`Collected ₹${earned} from ${comp.currentCustomer.name}!`);

    setComputers((prev) =>
      prev.map((c) =>
        c.id === comp.id ? { ...c, status: 'empty', currentCustomer: null } : c
      )
    );
  };

  // Repair / Reboot Hung Computer
  const repairComputer = (comp: Computer) => {
    soundService.playClick();
    setActiveDialogue(`SMACK! Percussive maintenance applied to ${comp.name}. System rebooted!`);
    setComputers((prev) =>
      prev.map((c) => (c.id === comp.id ? { ...c, status: 'empty', currentCustomer: null } : c))
    );
  };

  // Print Document for Student
  const handlePrintDocument = () => {
    if (printerPaperJam) {
      setPrinterPaperJam(false);
      soundService.playClick();
      setActiveDialogue('Cleared paper jam from printer!');
      return;
    }

    // Find student needing print
    const studentComp = computers.find(
      (c) => c.status === 'active' && c.currentCustomer?.needsPrint
    );

    if (studentComp && studentComp.currentCustomer) {
      soundService.playDing();
      setActiveDialogue(`Printed assignment for ${studentComp.currentCustomer.name}! (+₹15 print fee)`);
      setMoney((m) => m + 15);
      setComputers((prev) =>
        prev.map((c) =>
          c.id === studentComp.id
            ? {
                ...c,
                currentCustomer: { ...c.currentCustomer!, needsPrint: false }
              }
            : c
        )
      );
    } else {
      setActiveDialogue('Printer is ready (No student currently requesting printouts).');
    }
  };

  // Reconnect Modem
  const handleReconnectModem = () => {
    soundService.playClick();
    setModemConnected(true);
    setActiveDialogue('56k Dial-Up modem reconnected! All internet sessions resumed.');
  };

  // Buy Upgrades
  const buyUpgrade = (type: string, cost: number) => {
    if (money < cost) {
      alert('Bhaiya, paise kam hain! (Not enough money)');
      return;
    }
    soundService.playCash();
    setMoney((m) => m - cost);

    if (type === 'ram') {
      setComputers((prev) => prev.map((c) => ({ ...c, ramMB: 512 })));
      alert('Upgraded all PCs to 512MB RAM! Systems will no longer hang.');
    } else if (type === 'ups') {
      setHasUps(true);
      alert('Installed Heavy Inverter/UPS! Protected against all electricity cuts.');
    } else if (type === 'laser') {
      setHasLaserPrinter(true);
      alert('Bought Canon High-Speed Laser Printer! Printing earns +₹25 per page.');
    } else if (type === 'dsl') {
      setInternetType('dsl');
      alert('Upgraded to 256kbps DSL Broadband! Sessions are 30% faster.');
    } else if (type === 'pc') {
      const nextId = computers.length + 1;
      setComputers((prev) => [
        ...prev,
        { id: nextId, name: `CABIN ${nextId}`, status: 'empty', currentCustomer: null, ramMB: 256 }
      ]);
      alert(`Purchased CABIN ${nextId}! Cyber café expanded.`);
    }
    setShowShop(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#c0c0c0',
        fontFamily: 'Tahoma, Arial, sans-serif',
        userSelect: 'none',
        position: 'relative',
        fontSize: '11px'
      }}
    >
      {/* Menubar */}
      <div className="win-menubar">
        <div className="win-menu-item" onClick={startNewGame}><u>N</u>ew Game</div>
        <div className="win-menu-item" onClick={() => setShowShop(true)}>🛒 <u>U</u>pgrades Shop</div>
        <div className="win-menu-item" onClick={() => openWindow('achievements')}>🏆 <u>A</u>chievements</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', paddingRight: '6px' }}>
          <span>High Score: <b>₹{highScore}</b></span>
        </div>
      </div>

      {/* START SCREEN */}
      {gameState === 'start' && (
        <div
          className="win-inset"
          style={{
            flex: 1,
            margin: '4px',
            background: 'linear-gradient(135deg, #1f2d3d 0%, #111a24 100%)',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <img src="/icons/cyber-cafe.svg" alt="" style={{ width: '64px', height: '64px', marginBottom: '8px' }} />
          <h1 style={{ margin: 0, fontSize: '24px', color: '#00ffcc', textShadow: '2px 2px #000' }}>
            CYBER CAFÉ SIMULATOR 2005
          </h1>
          <p style={{ margin: '4px 0 16px 0', fontSize: '12px', color: '#ffd700' }}>
            Sharma Cyber Café &amp; STD PCO - Time Management &amp; Strategy
          </p>

          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              border: '1px solid #4a627a',
              padding: '12px',
              maxWidth: '500px',
              textAlign: 'left',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}
          >
            <b>HOW TO RUN YOUR CYBER CAFÉ:</b>
            <ul style={{ margin: '4px 0', paddingLeft: '18px' }}>
              <li>Select customers waiting in queue and seat them at empty computer cabins.</li>
              <li>Collect cash when their timer completes.</li>
              <li>Students will ask for assignment printouts — click the Printer!</li>
              <li>Fix hanging systems, clean spilled chai, and reconnect the 56k modem.</li>
              <li>Buy RAM upgrades, extra PCs, and an Inverter to survive all 5 Days!</li>
            </ul>
          </div>

          <button
            className="win-button"
            onClick={startNewGame}
            style={{ fontWeight: 'bold', fontSize: '13px', padding: '6px 24px', backgroundColor: '#00ffcc', color: '#000' }}
          >
            ▶ OPEN CYBER CAFÉ
          </button>
        </div>
      )}

      {/* ENDING SCREEN */}
      {gameState === 'ending' && (
        <div
          className="win-inset"
          style={{
            flex: 1,
            margin: '4px',
            backgroundColor: endingType === 'good' ? '#004d26' : endingType === 'bad' ? '#660000' : '#102040',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>
            {endingType === 'good' ? '👑' : endingType === 'bad' ? '🔒' : '🎮'}
          </div>

          <h2 style={{ margin: 0, fontSize: '22px', color: '#ffdd00' }}>
            {endingType === 'good'
              ? 'GOOD ENDING: CYBER CAFÉ TYCOON!'
              : endingType === 'bad'
              ? 'BAD ENDING: SHUT DOWN BY BSNL!'
              : 'SECRET ENDING: NATIONAL ESPORTS LEGEND!'}
          </h2>

          <p style={{ maxWidth: '440px', lineHeight: '1.5', margin: '8px 0 16px 0', fontSize: '12px' }}>
            {endingType === 'good'
              ? 'You earned massive profits, upgraded to high-speed broadband, and became the most famous internet cafe in the whole city!'
              : endingType === 'bad'
              ? 'Customers rioted over system hangs and unpaid electricity bills. BSNL cut your dial-up connection!'
              : 'Your cyber café became the legendary underground training ground for the national Counter-Strike champions!'}
          </p>

          <div className="win-outset" style={{ padding: '10px 24px', background: '#c0c0c0', color: '#000', marginBottom: '14px' }}>
            <div>Final Cash: <b>₹{money}</b></div>
            <div>Customers Served: <b>{servedCount}</b></div>
            <div>Satisfaction: <b>{satisfaction}%</b></div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="win-button" onClick={startNewGame} style={{ fontWeight: 'bold' }}>
              Play Again
            </button>
            <button className="win-button" onClick={() => openWindow('achievements')}>
              View Trophies
            </button>
          </div>
        </div>
      )}

      {/* UPGRADES SHOP MODAL */}
      {showShop && (
        <div
          className="win-outset"
          style={{
            position: 'absolute',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '420px',
            backgroundColor: '#c0c0c0',
            zIndex: 1000,
            padding: '4px',
            boxShadow: '4px 4px 12px rgba(0,0,0,0.5)'
          }}
        >
          <div className="win-titlebar">
            <span>🛒 Sharma Electronics &amp; Hardware Upgrades</span>
            <button className="win-titlebar-btn" onClick={() => setShowShop(false)}>✕</button>
          </div>

          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #aaa', paddingBottom: '4px' }}>
              <div>
                <b>Add Extra Computer Booth (PC {computers.length + 1})</b>
                <div style={{ color: '#555', fontSize: '10px' }}>Seat more customers at once</div>
              </div>
              <button className="win-button" onClick={() => buyUpgrade('pc', 400)}>
                Buy ₹400
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #aaa', paddingBottom: '4px' }}>
              <div>
                <b>Upgrade RAM to 512MB (All PCs)</b>
                <div style={{ color: '#555', fontSize: '10px' }}>Completely prevents computer hangs</div>
              </div>
              <button className="win-button" onClick={() => buyUpgrade('ram', 300)}>
                Buy ₹300
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #aaa', paddingBottom: '4px' }}>
              <div>
                <b>Inverter &amp; Heavy UPS Backup</b>
                <div style={{ color: '#555', fontSize: '10px' }}>Protects against all power cuts</div>
              </div>
              <button className="win-button" disabled={hasUps} onClick={() => buyUpgrade('ups', 500)}>
                {hasUps ? 'Owned' : 'Buy ₹500'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #aaa', paddingBottom: '4px' }}>
              <div>
                <b>256kbps DSL Broadband Connection</b>
                <div style={{ color: '#555', fontSize: '10px' }}>30% faster downloads &amp; browsing</div>
              </div>
              <button className="win-button" disabled={internetType !== 'dialup'} onClick={() => buyUpgrade('dsl', 600)}>
                {internetType !== 'dialup' ? 'Owned' : 'Buy ₹600'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE GAMEPLAY DASHBOARD */}
      {gameState === 'playing' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px', gap: '4px' }}>
          {/* Top Status Bar (Money, Day, Time, Satisfaction) */}
          <div
            className="win-outset"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 8px',
              backgroundColor: '#e4e4e4'
            }}
          >
            <div>Day: <b>{day} of 5</b></div>
            <div>Time: <b>{inGameHour}:{inGameMinute < 10 ? `0${inGameMinute}` : inGameMinute} {inGameHour < 12 ? 'AM' : 'PM'}</b></div>
            <div>Cash: <b style={{ color: '#008000', fontSize: '13px' }}>₹{money}</b></div>
            <div>
              Satisfaction: <b style={{ color: satisfaction > 60 ? '#008000' : '#800000' }}>{satisfaction}%</b>
            </div>
            <div>
              Net: <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{internetType}</span>
            </div>
          </div>

          {/* Alert Dialogue Banner */}
          {activeDialogue && (
            <div
              style={{
                backgroundColor: '#ffffdd',
                border: '1px solid #998800',
                padding: '4px 8px',
                color: '#800000',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              {activeDialogue}
            </div>
          )}

          {/* Main Floor Layout: Left = Customer Queue, Right = Computer Booths */}
          <div style={{ flex: 1, display: 'flex', gap: '4px', overflow: 'hidden' }}>
            {/* Customer Queue on Left */}
            <div
              className="win-outset"
              style={{
                width: '180px',
                display: 'flex',
                flexDirection: 'column',
                padding: '4px',
                gap: '4px',
                backgroundColor: '#dfdfdf'
              }}
            >
              <div style={{ fontWeight: 'bold', borderBottom: '1px solid #808080', paddingBottom: '3px' }}>
                🚶 Waiting Queue ({queue.length}/4)
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                {queue.map((cust) => {
                  const isSelected = selectedQueueId === cust.id;
                  return (
                    <div
                      key={cust.id}
                      onClick={() => setSelectedQueueId(cust.id)}
                      className={isSelected ? 'win-inset' : 'win-outset'}
                      style={{
                        padding: '4px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#000080' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#000000',
                        fontSize: '10px'
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>{cust.name}</div>
                      <div style={{ fontSize: '9px', opacity: 0.85 }}>{cust.request}</div>
                      <div style={{ marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Patience:</span>
                        <span style={{ color: isSelected ? '#ffdd00' : cust.patience < 40 ? '#ff0000' : '#008000', fontWeight: 'bold' }}>
                          {cust.patience}%
                        </span>
                      </div>
                      <div style={{ fontSize: '9px', color: isSelected ? '#88ffff' : '#008000', fontWeight: 'bold' }}>
                        Pays: ₹{cust.payAmount}
                      </div>
                    </div>
                  );
                })}
                {queue.length === 0 && (
                  <div style={{ color: '#666', textAlign: 'center', marginTop: '30px' }}>
                    No waiting customers. Next customer walking in...
                  </div>
                )}
              </div>

              {/* Reception Counter Actions */}
              <div style={{ borderTop: '1px solid #808080', paddingTop: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <button
                  className="win-button"
                  onClick={handlePrintDocument}
                  style={{
                    backgroundColor: printerPaperJam ? '#ff4444' : '#e0e0e0',
                    color: printerPaperJam ? '#fff' : '#000',
                    fontWeight: 'bold'
                  }}
                >
                  🖨️ {printerPaperJam ? 'Fix Paper Jam!' : 'Printer Desk'}
                </button>
                {!modemConnected && (
                  <button
                    className="win-button"
                    onClick={handleReconnectModem}
                    style={{ backgroundColor: '#ff0000', color: '#fff', fontWeight: 'bold' }}
                  >
                    📞 Reconnect Modem!
                  </button>
                )}
              </div>
            </div>

            {/* Computer Booths Grid on Right */}
            <div
              className="win-inset"
              style={{
                flex: 1,
                backgroundColor: '#2b3a4a',
                padding: '8px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '8px',
                overflowY: 'auto'
              }}
            >
              {computers.map((comp) => {
                const isFinished =
                  comp.currentCustomer &&
                  comp.currentCustomer.elapsed >= comp.currentCustomer.sessionDuration &&
                  !comp.currentCustomer.needsPrint;

                return (
                  <div
                    key={comp.id}
                    onClick={() => handleAssignToPc(comp)}
                    className="win-outset"
                    style={{
                      height: '135px',
                      padding: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: comp.status === 'hung' ? '#ff9999' : '#c0c0c0',
                      cursor: 'pointer'
                    }}
                  >
                    {/* PC Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10px' }}>
                      <span>{comp.name}</span>
                      <span style={{ fontSize: '9px', color: '#666' }}>{comp.ramMB}MB</span>
                    </div>

                    {/* CRT Monitor Illustration */}
                    <div
                      className="win-inset"
                      style={{
                        height: '60px',
                        backgroundColor: comp.status === 'empty' ? '#000' : comp.status === 'hung' ? '#0000aa' : '#008080',
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '3px 0',
                        fontSize: '9px',
                        textAlign: 'center',
                        padding: '2px'
                      }}
                    >
                      {comp.status === 'empty' ? (
                        <div style={{ color: '#00ff00' }}>[READY]<br />Click to seat</div>
                      ) : comp.status === 'hung' ? (
                        <div style={{ color: '#ffff00', fontWeight: 'bold' }}>
                          ⚠️ HUNG (BSOD)<br />Click to smack
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{comp.currentCustomer?.name}</div>
                          <div style={{ color: '#ffdd00', fontSize: '8px' }}>
                            {comp.currentCustomer?.needsPrint ? '🖨️ Needs Print' : 'Browsing Web'}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Customer Status / Action Button */}
                    <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                      {comp.status === 'active' && comp.currentCustomer && (
                        <div>
                          {isFinished ? (
                            <button
                              className="win-button"
                              style={{ width: '100%', fontWeight: 'bold', backgroundColor: '#00cc00', color: '#fff', padding: '1px' }}
                            >
                              Collect ₹{comp.currentCustomer.payAmount}
                            </button>
                          ) : (
                            <div style={{ fontSize: '9px' }}>
                              Time: {comp.currentCustomer.elapsed}/{comp.currentCustomer.sessionDuration}s
                            </div>
                          )}
                        </div>
                      )}
                      {comp.status === 'hung' && (
                        <button className="win-button" style={{ width: '100%', fontSize: '9px', fontWeight: 'bold' }}>
                          Smack to Fix
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="win-statusbar">
            <div className="win-status-pane">
              Customers Served: <b>{servedCount}</b> | UPS Backup: {hasUps ? 'INSTALLED' : 'NONE'}
            </div>
            <div className="win-status-pane" style={{ width: '120px' }}>
              Modem: {modemConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
