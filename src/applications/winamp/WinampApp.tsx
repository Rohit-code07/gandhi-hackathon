import React, { useState, useEffect, useRef } from 'react';

interface Track {
  id: string;
  title: string;
  duration: string;
  bpm: number;
  melody: number[];
}

const PLAYLIST: Track[] = [
  {
    id: 't1',
    title: '1. DJ Sharma - 56k Modem Rave (1998 Mix)',
    duration: '02:35',
    bpm: 130,
    melody: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 392.0, 329.63]
  },
  {
    id: 't2',
    title: '2. Pentium II - Overclocked Anthem',
    duration: '03:12',
    bpm: 140,
    melody: [220.0, 246.94, 261.63, 329.63, 220.0, 392.0, 329.63, 261.63]
  },
  {
    id: 't3',
    title: '3. Chiptune - Y2K Bug Countdown',
    duration: '01:54',
    bpm: 125,
    melody: [349.23, 392.0, 440.0, 523.25, 587.33, 523.25, 440.0, 392.0]
  },
  {
    id: 't4',
    title: '4. IIT Bhilai - Hackathon 98 Retro Beat',
    duration: '02:48',
    bpm: 135,
    melody: [196.0, 246.94, 293.66, 392.0, 440.0, 392.0, 293.66, 246.94]
  }
];

export const WinampApp: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0);
  const [volume, setVolume] = useState<number>(80);
  const [eqBars, setEqBars] = useState<number[]>([40, 60, 80, 50, 70, 90, 65, 45, 85, 55]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<any>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Synthesize chiptune audio loop when playing
  useEffect(() => {
    if (isPlaying) {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      let noteIdx = 0;
      synthIntervalRef.current = setInterval(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const freq = currentTrack.melody[noteIdx % currentTrack.melody.length];
          noteIdx++;

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          const volFactor = volume / 100;
          gain.gain.setValueAtTime(0.08 * volFactor, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.2);

          // Animate EQ bars
          setEqBars(Array.from({ length: 10 }, () => Math.floor(Math.random() * 85) + 15));
          setElapsed((prev) => prev + 1);
        } catch (e) {}
      }, (60 / currentTrack.bpm) * 1000 * 0.5);
    } else {
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
      }
      setEqBars([10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);
    }

    return () => {
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    };
  }, [isPlaying, currentTrackIndex, volume, currentTrack.bpm, currentTrack.melody]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStop = () => {
    setIsPlaying(false);
    setElapsed(0);
  };
  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev > 0 ? prev - 1 : PLAYLIST.length - 1));
    setElapsed(0);
  };
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev < PLAYLIST.length - 1 ? prev + 1 : 0));
    setElapsed(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#232323',
        color: '#00ff00',
        fontFamily: "'Courier New', Courier, monospace",
        padding: '6px',
        userSelect: 'none'
      }}
    >
      {/* Top Main Module (Winamp classic chassis) */}
      <div
        style={{
          background: 'linear-gradient(180deg, #3d3d3d 0%, #1e1e1e 100%)',
          border: '2px solid #555',
          borderRadius: '4px',
          padding: '8px',
          marginBottom: '6px'
        }}
      >
        {/* Title display */}
        <div
          style={{
            background: '#000000',
            color: '#00ff00',
            padding: '4px 8px',
            fontSize: '11px',
            border: '1px solid #444',
            marginBottom: '6px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}
        >
          {isPlaying ? `▶ ${currentTrack.title}` : `■ [STOPPED] ${currentTrack.title}`}
        </div>

        {/* Display + Equalizer visualizer */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          {/* 7-Segment Green Timer */}
          <div
            style={{
              background: '#000000',
              border: '1px solid #333',
              padding: '6px 12px',
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#00ff44',
              letterSpacing: '2px'
            }}
          >
            {formatTime(elapsed)}
          </div>

          {/* Equalizer Bars */}
          <div
            style={{
              flex: 1,
              height: '36px',
              background: '#000000',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '3px',
              padding: '2px 4px',
              border: '1px solid #333'
            }}
          >
            {eqBars.map((height, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${height}%`,
                  background: height > 70 ? '#ff0000' : height > 45 ? '#ffff00' : '#00ff00',
                  transition: 'height 0.1s linear'
                }}
              />
            ))}
          </div>
        </div>

        {/* Transport Buttons */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button className="win-button" onClick={handlePrev} style={{ minWidth: '32px', padding: '2px' }}>
            ⏮
          </button>
          <button className="win-button" onClick={handlePlay} style={{ minWidth: '32px', padding: '2px', fontWeight: 'bold' }}>
            ▶
          </button>
          <button className="win-button" onClick={handlePause} style={{ minWidth: '32px', padding: '2px' }}>
            ⏸
          </button>
          <button className="win-button" onClick={handleStop} style={{ minWidth: '32px', padding: '2px' }}>
            ⏹
          </button>
          <button className="win-button" onClick={handleNext} style={{ minWidth: '32px', padding: '2px' }}>
            ⏭
          </button>

          {/* Volume slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
            <span style={{ fontSize: '10px', color: '#aaa' }}>VOL:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ width: '70px', height: '14px' }}
            />
          </div>
        </div>
      </div>

      {/* Playlist Window */}
      <div
        className="win-inset"
        style={{
          flex: 1,
          background: '#000000',
          border: '1px solid #444',
          padding: '4px',
          overflowY: 'auto',
          fontSize: '11px'
        }}
      >
        <div style={{ color: '#ffd700', padding: '2px 4px', borderBottom: '1px solid #333', marginBottom: '4px' }}>
          WINAMP PLAYLIST:
        </div>
        {PLAYLIST.map((track, idx) => {
          const isSelected = currentTrackIndex === idx;
          return (
            <div
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setElapsed(0);
                setIsPlaying(true);
              }}
              style={{
                padding: '3px 6px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#000080' : 'transparent',
                color: isSelected ? '#00ffff' : '#00ff00',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>{track.title}</span>
              <span style={{ color: '#888' }}>{track.duration}</span>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: '10px', color: '#666', textAlign: 'center', marginTop: '4px' }}>
        "WINAMP: It really whips the llama's ass!"
      </div>
    </div>
  );
};
