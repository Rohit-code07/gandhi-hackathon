import React from 'react';
import { useWindowStore } from '../../store/windowStore';
import { AppWindow } from './AppWindow';

// Application Imports
import { MyComputerApp } from '../../applications/my-computer/MyComputerApp';
import { FileExplorerApp } from '../../applications/file-explorer/FileExplorerApp';
import { NotepadApp } from '../../applications/notepad/NotepadApp';
import { PaintApp } from '../../applications/paint/PaintApp';
import { CalculatorApp } from '../../applications/calculator/CalculatorApp';
import { InternetExplorerApp } from '../../applications/internet-explorer/InternetExplorerApp';
import { OutlookExpressApp } from '../../applications/outlook-express/OutlookExpressApp';
import { ICQApp } from '../../applications/icq/ICQApp';
import { WinampApp } from '../../applications/winamp/WinampApp';
import { MemeFactoryApp } from '../../applications/meme-factory/MemeFactoryApp';
import { MinesweeperApp } from '../../applications/minesweeper/MinesweeperApp';
import { SolitaireApp } from '../../applications/solitaire/SolitaireApp';
import { SnakeApp } from '../../applications/snake/SnakeApp';
import { TerminalApp } from '../../applications/terminal/TerminalApp';
import { ControlPanelApp } from '../../applications/control-panel/ControlPanelApp';
import { SecretEventsApp } from '../../applications/secret-events/SecretEventsApp';

// Easter Egg Modals
import { FakeVirusModal } from '../easter-eggs/FakeVirusModal';
import { DialUpModal } from '../easter-eggs/DialUpModal';
import { OldPhotoModal } from '../easter-eggs/OldPhotoModal';

export const WindowManager: React.FC = () => {
  const { windows } = useWindowStore();

  const renderAppContent = (win: any) => {
    switch (win.appId) {
      case 'my-computer':
        return <MyComputerApp />;
      case 'file-explorer':
        return (
          <FileExplorerApp
            initialPath={win.initialData?.initialPath}
            searchOpen={win.initialData?.searchOpen}
          />
        );
      case 'notepad':
        return <NotepadApp initialFile={win.initialData?.file} />;
      case 'paint':
        return <PaintApp initialFile={win.initialData?.file} />;
      case 'calculator':
        return <CalculatorApp />;
      case 'ie':
        return <InternetExplorerApp />;
      case 'outlook':
        return <OutlookExpressApp />;
      case 'icq':
        return <ICQApp />;
      case 'winamp':
        return <WinampApp />;
      case 'meme-factory':
        return <MemeFactoryApp />;
      case 'minesweeper':
        return <MinesweeperApp />;
      case 'solitaire':
        return <SolitaireApp />;
      case 'snake':
        return <SnakeApp />;
      case 'terminal':
        return <TerminalApp />;
      case 'control-panel':
        return <ControlPanelApp />;
      case 'secret-events':
        return <SecretEventsApp />;
      case 'fake-virus':
        return <FakeVirusModal />;
      case 'dial-up':
        return <DialUpModal />;
      case 'old-photo':
        return <OldPhotoModal />;
      default:
        return <div>Application not found</div>;
    }
  };

  return (
    <>
      {windows.map((win) => (
        <AppWindow key={win.id} window={win}>
          {renderAppContent(win)}
        </AppWindow>
      ))}
    </>
  );
};
