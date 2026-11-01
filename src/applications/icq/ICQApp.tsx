import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../../services/soundService';
import { useStoryStore } from '../../store/storyStore';

interface ChatMessage {
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface ICQContact {
  id: string;
  name: string;
  uin: string;
  status: 'online' | 'away' | 'offline';
  initialMessages: ChatMessage[];
  responses: string[];
}

const CONTACTS: ICQContact[] = [
  {
    id: 'rahul',
    name: 'Rahul_007',
    uin: '4892019',
    status: 'online',
    initialMessages: [
      { sender: 'Rahul_007', text: 'bro my computer is making helicopter noises', time: '14:20', isMe: false },
      { sender: 'Rahul_007', text: 'i think my CPU fan is about to achieve liftoff', time: '14:21', isMe: false }
    ],
    responses: [
      'smack the side of the cabinet, it usually stops vibrating',
      'did you return my NFS II CD yet??',
      'brb mom is yelling at me to disconnect dial-up',
      'gg, my mouse ball has so much dust inside it wont scroll right'
    ]
  },
  {
    id: 'hacker',
    name: 'HackerBoy',
    uin: '1337420',
    status: 'online',
    initialMessages: [
      { sender: 'HackerBoy', text: 'I can hack NASA using telnet port 23', time: '12:05', isMe: false },
      { sender: 'HackerBoy', text: 'check out C:/Downloads/ILOVEYOU.exe, totally legit game bro', time: '12:06', isMe: false }
    ],
    responses: [
      'press ALT+F4 for unlimited AOL minutes',
      'my dialup speed just peaked at 5.2 KB/s... god mode activated',
      'the secret code is UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A',
      'im tracing your IP... 127.0.0.1... wait that is me'
    ]
  },
  {
    id: 'dad',
    name: 'ComputerDad',
    uin: '9920114',
    status: 'away',
    initialMessages: [
      { sender: 'ComputerDad', text: 'DON’T DOWNLOAD ANYTHING.', time: '09:30', isMe: false },
      { sender: 'ComputerDad', text: 'The BSNL bill was 18,000 rupees. ARE YOU RUNNING A SERVER??', time: '09:31', isMe: false }
    ],
    responses: [
      'Put the dust cover on the monitor when you finish.',
      'Did you shut down properly from Start menu or just pull the plug?',
      'Why is there an iron box on top of the computer table?',
      'Disconnecting modem in 5 minutes!'
    ]
  },
  {
    id: 'priya',
    name: 'Priya_1999',
    uin: '8839201',
    status: 'online',
    initialMessages: [
      { sender: 'Priya_1999', text: 'Hey Alex! Did you finish the lab assignment?', time: '15:10', isMe: false }
    ],
    responses: [
      'Haha your diary.txt in My Documents was so funny... wait who told you i read it?',
      'Are you coming to the Gandhi Hackathon at IIT Bhilai?',
      'My brother said he wants to challenge you in Minesweeper',
      'k.'
    ]
  },
  {
    id: 'unknown',
    name: 'UnknownUser',
    uin: '6660099',
    status: 'online',
    initialMessages: [
      { sender: 'UnknownUser', text: 'I know what you did in folder C:/Secret', time: '03:33', isMe: false }
    ],
    responses: [
      'The PC was abandoned for 27 years. Why did you wake it up?',
      'Check C:/Secret/DO_NOT_OPEN/why_this_pc_was_abandoned.txt',
      'Clippy is watching your every cursor move.',
      'Some memories never crash.'
    ]
  }
];

export const ICQApp: React.FC = () => {
  const { unlockDiscovery } = useStoryStore();
  const [activeContactId, setActiveContactId] = useState<string>('rahul');
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({
    rahul: CONTACTS[0].initialMessages,
    hacker: CONTACTS[1].initialMessages,
    dad: CONTACTS[2].initialMessages,
    priya: CONTACTS[3].initialMessages,
    unknown: CONTACTS[4].initialMessages
  });
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    unlockDiscovery('icq-chat');
  }, [unlockDiscovery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistories, activeContactId]);

  const activeContact = CONTACTS.find((c) => c.id === activeContactId) || CONTACTS[0];
  const messages = chatHistories[activeContactId] || [];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const userMsg: ChatMessage = {
      sender: 'Alex',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    const nextMessages = [...messages, userMsg];
    setChatHistories({
      ...chatHistories,
      [activeContactId]: nextMessages
    });
    setInputText('');

    // Trigger simulated reply after 1.2s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      soundService.playICQ();
      const pool = activeContact.responses;
      const replyText = pool[Math.floor(Math.random() * pool.length)];

      const botMsg: ChatMessage = {
        sender: activeContact.name,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      };

      setChatHistories((prev) => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] || []), botMsg]
      }));
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', height: '100%', background: '#c0c0c0', overflow: 'hidden' }}>
      {/* Contact List Pane */}
      <div
        className="win-inset"
        style={{
          width: '120px',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          margin: '2px',
          padding: '4px',
          overflowY: 'auto'
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#006600', marginBottom: '6px' }}>
          🌸 ICQ Contacts
        </div>
        {CONTACTS.map((c) => {
          const isSelected = activeContactId === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setActiveContactId(c.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 4px',
                fontSize: '11px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#000080' : 'transparent',
                color: isSelected ? '#ffffff' : '#000000',
                borderRadius: '2px'
              }}
            >
              <span style={{ color: c.status === 'online' ? '#00cc00' : '#ff0000', fontSize: '12px' }}>
                ●
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Chat Window Pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '2px', gap: '3px' }}>
        {/* Contact Info Header */}
        <div
          className="win-outset"
          style={{
            padding: '3px 8px',
            fontSize: '11px',
            background: '#e0e0e0',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <b>{activeContact.name}</b> (UIN: {activeContact.uin})
          </div>
          <div style={{ color: activeContact.status === 'online' ? '#006600' : '#888' }}>
            {activeContact.status.toUpperCase()}
          </div>
        </div>

        {/* Message Log */}
        <div
          className="win-inset"
          style={{
            flex: 1,
            background: '#ffffff',
            padding: '8px',
            overflowY: 'auto',
            fontSize: '12px',
            fontFamily: 'Tahoma, sans-serif'
          }}
        >
          {messages.map((m, idx) => (
            <div key={idx} style={{ marginBottom: '6px' }}>
              <span style={{ fontWeight: 'bold', color: m.isMe ? '#0000aa' : '#aa0000' }}>
                {m.sender} [{m.time}]:{' '}
              </span>
              <span>{m.text}</span>
            </div>
          ))}
          {isTyping && (
            <div style={{ color: '#888', fontStyle: 'italic', fontSize: '11px' }}>
              {activeContact.name} is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <input
            type="text"
            placeholder="Type message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            style={{ flex: 1, height: '24px' }}
          />
          <button className="win-button" onClick={handleSendMessage} style={{ minWidth: '55px' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
