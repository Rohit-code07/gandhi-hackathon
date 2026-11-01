import React, { useState, useEffect } from 'react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [memory, setMemory] = useState<number>(0);

  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (nextOp: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const current = prevValue || 0;
      let result = current;
      if (operator === '+') result = current + inputValue;
      else if (operator === '-') result = current - inputValue;
      else if (operator === '*') result = current * inputValue;
      else if (operator === '/') result = inputValue !== 0 ? current / inputValue : 0;

      setPrevValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOp);
  };

  const handleEquals = () => {
    if (operator === null || prevValue === null) return;
    const inputValue = parseFloat(display);
    let result = prevValue;

    if (operator === '+') result = prevValue + inputValue;
    else if (operator === '-') result = prevValue - inputValue;
    else if (operator === '*') result = prevValue * inputValue;
    else if (operator === '/') result = inputValue !== 0 ? prevValue / inputValue : 0;

    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleSqrt = () => {
    const val = parseFloat(display);
    if (val >= 0) setDisplay(String(Math.sqrt(val)));
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const handleToggleSign = () => {
    const val = parseFloat(display);
    setDisplay(String(val * -1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
      else if (e.key === '.') handleDecimal();
      else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') handleOperator(e.key);
      else if (e.key === 'Enter' || e.key === '=') handleEquals();
      else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') handleClear();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0', padding: '6px' }}>
      {/* Display Screen */}
      <div
        className="win-inset"
        style={{
          height: '32px',
          backgroundColor: '#ffffff',
          color: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 8px',
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '8px'
        }}
      >
        {display}
      </div>

      {/* Button Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', flex: 1 }}>
        <button className="win-button" onClick={() => setMemory(0)} style={{ color: '#000080', minWidth: 'auto' }}>MC</button>
        <button className="win-button" onClick={() => handleDigit('7')} style={{ minWidth: 'auto', fontWeight: 'bold' }}>7</button>
        <button className="win-button" onClick={() => handleDigit('8')} style={{ minWidth: 'auto', fontWeight: 'bold' }}>8</button>
        <button className="win-button" onClick={() => handleDigit('9')} style={{ minWidth: 'auto', fontWeight: 'bold' }}>9</button>
        <button className="win-button" onClick={() => handleOperator('/')} style={{ color: '#800000', minWidth: 'auto', fontWeight: 'bold' }}>/</button>

        <button className="win-button" onClick={() => setDisplay(String(memory))} style={{ color: '#000080', minWidth: 'auto' }}>MR</button>
        <button className="win-button" onClick={() => handleDigit('4')} style={{ minWidth: 'auto', fontWeight: 'bold' }}>4</button>
        <button className="win-button" onClick={() => handleDigit('5')} style={{ minWidth: 'auto', fontWeight: 'bold' }}>5</button>
        <button className="win-button" onClick={() => handleDigit('6')} style={{ minWidth: 'auto', fontWeight: 'bold' }}>6</button>
        <button className="win-button" onClick={() => handleOperator('*')} style={{ color: '#800000', minWidth: 'auto', fontWeight: 'bold' }}>*</button>

        <button className="win-button" onClick={() => setMemory(parseFloat(display))} style={{ color: '#000080', minWidth: 'auto' }}>MS</button>
        <button className="win-button" onClick={() => handleDigit('1')} style={{ minWidth: 'auto', fontWeight: 'bold' }}>1</button>
        <button className="win-button" onClick={() => handleDigit('2')} style={{ minWidth: 'auto', fontWeight: 'bold' }}>2</button>
        <button className="win-button" onClick={() => handleDigit('3')} style={{ minWidth: 'auto', fontWeight: 'bold' }}>3</button>
        <button className="win-button" onClick={() => handleOperator('-')} style={{ color: '#800000', minWidth: 'auto', fontWeight: 'bold' }}>-</button>

        <button className="win-button" onClick={() => setMemory(memory + parseFloat(display))} style={{ color: '#000080', minWidth: 'auto' }}>M+</button>
        <button className="win-button" onClick={() => handleDigit('0')} style={{ minWidth: 'auto', fontWeight: 'bold' }}>0</button>
        <button className="win-button" onClick={handleToggleSign} style={{ minWidth: 'auto' }}>+/-</button>
        <button className="win-button" onClick={handleDecimal} style={{ minWidth: 'auto', fontWeight: 'bold' }}>.</button>
        <button className="win-button" onClick={() => handleOperator('+')} style={{ color: '#800000', minWidth: 'auto', fontWeight: 'bold' }}>+</button>

        <button className="win-button" onClick={handleClear} style={{ color: '#800000', minWidth: 'auto', gridColumn: 'span 2', fontWeight: 'bold' }}>Clear</button>
        <button className="win-button" onClick={handleSqrt} style={{ minWidth: 'auto' }}>sqrt</button>
        <button className="win-button" onClick={handlePercent} style={{ minWidth: 'auto' }}>%</button>
        <button className="win-button" onClick={handleEquals} style={{ color: '#000080', minWidth: 'auto', fontWeight: 'bold', background: '#e0e0e0' }}>=</button>
      </div>
    </div>
  );
};
