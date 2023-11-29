import { type } from '@tauri-apps/api/os';
import { useEffect, useState } from "react";
import AppFrameless from './AppFrameless';
import AppFrame from './AppFrame';
import { appWindow } from '@tauri-apps/api/window';
import { goOffline } from './contexts/AccessDB';
import { confirm } from '@tauri-apps/api/dialog';

function App() {
  const [ostype, setOsType] = useState<string>('Windows_NT');

  useEffect(() => {
    const checkOS = async() => {
      const osType = await type();
      setOsType(osType.toString());
    }

    const checkIfWindowIsClosed = () => {
      appWindow.onCloseRequested(async (event) => {
        goOffline();
        const confirmed = await confirm('Are you sure?');
        if (!confirmed) {
          // user did not confirm closing the window; let's prevent it
          event.preventDefault();
        }
        
      });
    }

    checkOS();
    checkIfWindowIsClosed();
  }, [])
  
  return (
    <div>
    {
      ostype === "Windows_NT" ?
        <AppFrameless />
        :
        <AppFrame />
    }
    </div>
  );
}

export default App;