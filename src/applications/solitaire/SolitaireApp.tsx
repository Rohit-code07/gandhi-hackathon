import React, { useState, useEffect } from 'react';
import { soundService } from '../../services/soundService';

type Suit = '♠' | '♥' | '♦' | '♣';

interface Card {
  suit: Suit;
  value: number; // 1 (Ace) to 13 (King)
  isFaceUp: boolean;
  color: 'red' | 'black';
}

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];

const getCardLabel = (value: number) => {
  if (value === 1) return 'A';
  if (value === 11) return 'J';
  if (value === 12) return 'Q';
  if (value === 13) return 'K';
  return String(value);
};

export const SolitaireApp: React.FC = () => {
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [tableaus, setTableaus] = useState<Card[][]>([[], [], [], [], [], [], []]);
  const [score, setScore] = useState<number>(0);
  const [hasWon, setHasWon] = useState<boolean>(false);

  const initGame = () => {
    let deck: Card[] = [];
    for (let s of SUITS) {
      for (let v = 1; v <= 13; v++) {
        deck.push({
          suit: s,
          value: v,
          isFaceUp: false,
          color: s === '♥' || s === '♦' ? 'red' : 'black'
        });
      }
    }

    // Shuffle
    deck.sort(() => Math.random() - 0.5);

    // Deal 7 tableaus
    let newTableaus: Card[][] = [[], [], [], [], [], [], []];
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j <= i; j++) {
        const card = deck.pop()!;
        if (j === i) card.isFaceUp = true;
        newTableaus[i].push(card);
      }
    }

    setTableaus(newTableaus);
    setFoundations([[], [], [], []]);
    setWaste([]);
    setStock(deck);
    setScore(0);
    setHasWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleStockClick = () => {
    soundService.playClick();
    if (stock.length === 0) {
      // Recycle waste into stock
      setStock(waste.map((c) => ({ ...c, isFaceUp: false })).reverse());
      setWaste([]);
    } else {
      const top = { ...stock[stock.length - 1], isFaceUp: true };
      setStock(stock.slice(0, stock.length - 1));
      setWaste([...waste, top]);
    }
  };

  // Try auto-moving a card to foundations or valid tableau
  const tryMoveCard = (card: Card, sourceColIndex: number, isWaste: boolean = false) => {
    // 1. Try moving to foundation
    for (let f = 0; f < 4; f++) {
      const fPile = foundations[f];
      const targetVal = fPile.length === 0 ? 1 : fPile[fPile.length - 1].value + 1;
      const targetSuit = fPile.length === 0 ? card.suit : fPile[fPile.length - 1].suit;

      if (card.value === targetVal && card.suit === targetSuit) {
        soundService.playClick();
        const nextFoundations = foundations.map((pile, idx) => (idx === f ? [...pile, card] : pile));
        setFoundations(nextFoundations);
        setScore((prev) => prev + 10);

        if (isWaste) {
          setWaste(waste.slice(0, waste.length - 1));
        } else {
          const nextTableaus = [...tableaus];
          nextTableaus[sourceColIndex].pop();
          if (nextTableaus[sourceColIndex].length > 0) {
            nextTableaus[sourceColIndex][nextTableaus[sourceColIndex].length - 1].isFaceUp = true;
          }
          setTableaus(nextTableaus);
        }

        // Check Win
        const totalInFoundations = nextFoundations.reduce((sum, p) => sum + p.length, 0);
        if (totalInFoundations === 52) {
          setHasWon(true);
          soundService.playStartup();
        }
        return;
      }
    }

    // 2. Try moving to another tableau column
    for (let t = 0; t < 7; t++) {
      if (t === sourceColIndex && !isWaste) continue;
      const destCol = tableaus[t];
      const destTop = destCol.length > 0 ? destCol[destCol.length - 1] : null;

      const isValidMove =
        (destTop === null && card.value === 13) ||
        (destTop !== null && destTop.color !== card.color && destTop.value === card.value + 1);

      if (isValidMove) {
        soundService.playClick();
        const nextTableaus = [...tableaus];
        nextTableaus[t].push(card);

        if (isWaste) {
          setWaste(waste.slice(0, waste.length - 1));
        } else {
          nextTableaus[sourceColIndex].pop();
          if (nextTableaus[sourceColIndex].length > 0) {
            nextTableaus[sourceColIndex][nextTableaus[sourceColIndex].length - 1].isFaceUp = true;
          }
        }

        setTableaus(nextTableaus);
        setScore((prev) => prev + 5);
        return;
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#008000',
        padding: '8px',
        userSelect: 'none'
      }}
    >
      {/* Solitaire Menubar */}
      <div className="win-menubar" style={{ marginBottom: '6px' }}>
        <div className="win-menu-item" onClick={initGame}><u>G</u>ame: Deal New</div>
        <div className="win-menu-item" style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
          Score: {score}
        </div>
      </div>

      {/* Top Row: Stock, Waste, and 4 Foundations */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        {/* Stock & Waste */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Stock */}
          <div
            onClick={handleStockClick}
            style={{
              width: '56px',
              height: '78px',
              border: '2px solid #ffffff',
              borderRadius: '4px',
              backgroundColor: stock.length > 0 ? '#000080' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '11px'
            }}
          >
            {stock.length > 0 ? '🂠' : '↺'}
          </div>

          {/* Waste */}
          <div
            onClick={() => waste.length > 0 && tryMoveCard(waste[waste.length - 1], -1, true)}
            style={{
              width: '56px',
              height: '78px',
              border: '1px solid #005000',
              borderRadius: '4px',
              backgroundColor: waste.length > 0 ? '#ffffff' : 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: waste.length > 0 ? 'pointer' : 'default',
              color: waste.length > 0 && waste[waste.length - 1].color === 'red' ? '#ff0000' : '#000000'
            }}
          >
            {waste.length > 0 && (
              <>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
                  {getCardLabel(waste[waste.length - 1].value)} {waste[waste.length - 1].suit}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 4 Foundations */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {foundations.map((fPile, idx) => {
            const top = fPile.length > 0 ? fPile[fPile.length - 1] : null;
            return (
              <div
                key={idx}
                style={{
                  width: '56px',
                  height: '78px',
                  border: '2px solid #005000',
                  borderRadius: '4px',
                  backgroundColor: top ? '#ffffff' : 'rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: top && top.color === 'red' ? '#ff0000' : '#000000',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}
              >
                {top ? `${getCardLabel(top.value)} ${top.suit}` : SUITS[idx]}
              </div>
            );
          })}
        </div>
      </div>

      {/* 7 Tableau Columns */}
      <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
        {tableaus.map((col, colIdx) => (
          <div
            key={colIdx}
            style={{
              flex: 1,
              minHeight: '200px',
              border: col.length === 0 ? '1px dashed rgba(255,255,255,0.3)' : 'none',
              borderRadius: '4px',
              position: 'relative'
            }}
          >
            {col.map((card, cardIdx) => (
              <div
                key={cardIdx}
                onClick={() => card.isFaceUp && tryMoveCard(card, colIdx, false)}
                style={{
                  position: 'absolute',
                  top: `${cardIdx * 16}px`,
                  left: 0,
                  right: 0,
                  height: '74px',
                  border: '1px solid #000000',
                  borderRadius: '3px',
                  backgroundColor: card.isFaceUp ? '#ffffff' : '#000080',
                  color: card.color === 'red' ? '#ff0000' : '#000000',
                  padding: '3px 4px',
                  boxShadow: '1px 1px 2px rgba(0,0,0,0.4)',
                  cursor: card.isFaceUp ? 'pointer' : 'default',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}
              >
                {card.isFaceUp ? (
                  <div>
                    {getCardLabel(card.value)} {card.suit}
                  </div>
                ) : (
                  <div style={{ color: '#fff', textAlign: 'center', fontSize: '10px' }}>░░░</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {hasWon && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#ffff00',
            border: '3px solid #ff0000',
            padding: '16px 24px',
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center',
            boxShadow: '4px 4px 10px rgba(0,0,0,0.5)'
          }}
        >
          🏆 YOU WON SOLITAIRE! 🏆
        </div>
      )}
    </div>
  );
};
