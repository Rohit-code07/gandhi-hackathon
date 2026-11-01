import React, { useState } from 'react';
import { useStoryStore } from '../../store/storyStore';

interface EmailItem {
  id: string;
  sender: string;
  subject: string;
  date: string;
  body: string;
  isRead: boolean;
}

const DEFAULT_EMAILS: EmailItem[] = [
  {
    id: 'e1',
    sender: 'prince_abacha@nigerianroyal.ng',
    subject: 'YOU HAVE WON 10,000,000 DOLLARS (URGENT)',
    date: '1998-10-24 14:22',
    isRead: false,
    body: `DEAR RESPECTED FRIEND,
I am Prince Kenneth of Nigeria. I have 10,000,000 USD trapped in an escrow vault.
I only need your bank details and 500 rupees in postal stamps to transfer the funds to your account.
Kindly reply immediately before the government notices.
Yours sincerely,
Prince Kenneth`
  },
  {
    id: 'e2',
    sender: 'rahul_gamer@delhinet.in',
    subject: 'BROTHER PLEASE RETURN MY CD',
    date: '1999-01-14 18:30',
    isRead: false,
    body: `Alex bro,
It has been 3 months since you borrowed my Need For Speed II Special Edition CD.
My dad wants to know why the CD jewel case is empty.
Also bring the cheat code sheet you printed for GTA.
Meet me near the hostel mess at 8 PM.
- Rahul`
  },
  {
    id: 'e3',
    sender: 'security@hotmail-support.com',
    subject: 'Your Hotmail Password Expired',
    date: '1999-05-12 09:15',
    isRead: false,
    body: `Dear Hotmail User,
Your password "ilovepriya1999" has expired.
To avoid your account being purged from Microsoft servers, please send your username and password to this address.
Microsoft Internet Services 1999`
  },
  {
    id: 'e4',
    sender: 'unknown_watcher@darkweb.org',
    subject: "IMPORTANT: Don't Open Folder 1998",
    date: '2001-08-20 03:33',
    isRead: false,
    body: `Alex,
If you are reading this: do not explore C:/Secret/DO_NOT_OPEN.
The files you downloaded on KaZaA were not just MP3s.
The computer knows you are awake at night.
Press ESC if you see the blue screen.`
  },
  {
    id: 'e5',
    sender: 'bsnl_billing@mtnl.gov.in',
    subject: 'URGENT: Telephone Bill Exceeded Rs. 14,000 (Dial-Up)',
    date: '2000-03-01 11:00',
    isRead: false,
    body: `Subscriber: Mr. Sharma (Alex's Dad)
Your 56k dial-up internet session lasted 142 continuous hours in February.
Total bill due: Rs. 14,240.50.
Notice: Disconnection will occur if payment is not received by Friday.`
  },
  {
    id: 'e6',
    sender: 'grandma_sharma@vsnl.com',
    subject: "Grandma's Last Email",
    date: '2002-11-19 16:45',
    isRead: false,
    body: `Dearest Alex beta,
Your uncle bought me this computer machine.
How do I double click? The little arrow on the screen went off the desk and now the mouse is hanging on the wire.
Please eat your food and don't spend all night staring at the bright box.
Blessings,
Dadi`
  },
  {
    id: 'e7',
    sender: 'gandhi_hackathon@iitbhilai.ac.in',
    subject: 'Congratulations on 1st Prize at IIT Bhilai!',
    date: '2026-11-01 15:00',
    isRead: true,
    body: `Dear Developer,
The judges at Gandhi Hackathon, IIT Bhilai were stunned by your Windows 98 abandoned PC simulator!
The nostalgia, the authentic window management, the playable retro games and hilarious easter eggs were unmatched.
Keep inspiring the hacker community!`
  },
  {
    id: 'e8',
    sender: 'hostel_lan_party@iit.ac.in',
    subject: 'HOSTEL LAN PARTY TONIGHT: Quake II & StarCraft',
    date: '1999-09-18 20:00',
    isRead: true,
    body: `Room 204. Bring your own coaxial ethernet cable and mouse ball cleaning alcohol.
No camping with the railgun. Winner gets 2 liters of Thums Up.`
  }
];

export const OutlookExpressApp: React.FC = () => {
  const [emails, setEmails] = useState<EmailItem[]>(DEFAULT_EMAILS);
  const [selectedEmailId, setSelectedEmailId] = useState<string>(DEFAULT_EMAILS[0].id);
  const [showCompose, setShowCompose] = useState<boolean>(false);
  const [composeTo, setComposeTo] = useState<string>('');
  const [composeSubj, setComposeSubj] = useState<string>('');
  const [composeBody, setComposeBody] = useState<string>('');

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];

  const handleSelect = (id: string) => {
    setSelectedEmailId(id);
    setEmails(emails.map((e) => (e.id === id ? { ...e, isRead: true } : e)));
  };

  const handleDelete = () => {
    setEmails(emails.filter((e) => e.id !== selectedEmailId));
    if (emails.length > 1) {
      setSelectedEmailId(emails[0].id);
    }
  };

  const handleSend = () => {
    if (!composeTo.trim()) {
      alert('Please specify a recipient!');
      return;
    }
    const newMail: EmailItem = {
      id: `mail-${Date.now()}`,
      sender: 'alex.sharma@pentium2.net',
      subject: composeSubj || '(No Subject)',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      body: composeBody,
      isRead: true
    };
    setEmails([newMail, ...emails]);
    setShowCompose(false);
    setComposeTo('');
    setComposeSubj('');
    setComposeBody('');
    alert('Message queued in Outbox for 56k dial-up transmission!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0' }}>
      {/* Menubar */}
      <div className="win-menubar">
        <div className="win-menu-item" onClick={() => setShowCompose(true)}><u>N</u>ew Mail</div>
        <div className="win-menu-item" onClick={handleDelete}><u>D</u>elete</div>
        <div className="win-menu-item" onClick={() => setShowCompose(true)}><u>R</u>eply</div>
      </div>

      {/* Main Mail View */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '2px', gap: '3px' }}>
        {/* Left Folder Tree */}
        <div
          className="win-inset"
          style={{
            width: '150px',
            background: '#ffffff',
            padding: '6px',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ fontWeight: 'bold', color: '#000080' }}>📂 Outlook Express</div>
          <div style={{ paddingLeft: '12px', cursor: 'pointer', background: '#000080', color: '#fff' }}>
            📥 Inbox ({emails.filter((e) => !e.isRead).length})
          </div>
          <div style={{ paddingLeft: '12px', cursor: 'pointer' }}>📤 Outbox (0)</div>
          <div style={{ paddingLeft: '12px', cursor: 'pointer' }}>📨 Sent Items</div>
          <div style={{ paddingLeft: '12px', cursor: 'pointer' }}>🗑 Deleted Items</div>
          <div style={{ paddingLeft: '12px', cursor: 'pointer' }}>📝 Drafts</div>
        </div>

        {/* Right Area: Email List + Preview Pane */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '3px' }}>
          {/* Email List Table */}
          <div
            className="win-inset"
            style={{
              height: '45%',
              overflowY: 'auto',
              background: '#ffffff',
              fontSize: '11px'
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#dfdfdf', textAlign: 'left', borderBottom: '1px solid #808080' }}>
                  <th style={{ padding: '2px 6px', width: '30%' }}>From</th>
                  <th style={{ padding: '2px 6px', width: '50%' }}>Subject</th>
                  <th style={{ padding: '2px 6px', width: '20%' }}>Received</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((email) => {
                  const isSelected = selectedEmailId === email.id;
                  return (
                    <tr
                      key={email.id}
                      onClick={() => handleSelect(email.id)}
                      style={{
                        backgroundColor: isSelected ? '#000080' : 'transparent',
                        color: isSelected ? '#ffffff' : '#000000',
                        fontWeight: !email.isRead ? 'bold' : 'normal',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ padding: '3px 6px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {email.sender}
                      </td>
                      <td style={{ padding: '3px 6px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {email.subject}
                      </td>
                      <td style={{ padding: '3px 6px' }}>{email.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Email Body Preview Pane */}
          <div
            className="win-inset"
            style={{
              flex: 1,
              overflowY: 'auto',
              background: '#ffffff',
              padding: '10px',
              fontSize: '12px',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            {selectedEmail ? (
              <div>
                <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '6px', marginBottom: '8px' }}>
                  <div><b>From:</b> {selectedEmail.sender}</div>
                  <div><b>Subject:</b> {selectedEmail.subject}</div>
                  <div><b>Date:</b> {selectedEmail.date}</div>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                  {selectedEmail.body}
                </div>
              </div>
            ) : (
              <div style={{ color: '#888' }}>No email selected.</div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div
          className="win-outset"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '20px',
            zIndex: 100,
            background: '#c0c0c0',
            display: 'flex',
            flexDirection: 'column',
            padding: '8px'
          }}
        >
          <div className="win-titlebar" style={{ marginBottom: '6px' }}>
            <span>New Message</span>
            <button className="win-titlebar-btn" onClick={() => setShowCompose(false)}>✕</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '60px', fontSize: '11px' }}>To:</span>
              <input
                type="text"
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
                style={{ flex: 1 }}
                placeholder="recipient@1998.com"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '60px', fontSize: '11px' }}>Subject:</span>
              <input
                type="text"
                value={composeSubj}
                onChange={(e) => setComposeSubj(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
            <textarea
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              style={{ flex: 1, resize: 'none' }}
              placeholder="Write message..."
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="win-button" onClick={handleSend} style={{ fontWeight: 'bold' }}>
                Send
              </button>
              <button className="win-button" onClick={() => setShowCompose(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="win-statusbar">
        <div className="win-status-pane">{emails.length} message(s)</div>
        <div className="win-status-pane" style={{ width: '120px' }}>Connected (56k)</div>
      </div>
    </div>
  );
};
