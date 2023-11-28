import { type } from '@tauri-apps/api/os';
import { useEffect, useState } from "react";
import AppFrameless from './AppFrameless';
import AppFrame from './AppFrame';

function App() {
  const [ostype, setOsType] = useState<string>('Windows_NT');

  useEffect(() => {
    const checkOS = async() => {
      const osType = await type();
      setOsType(osType.toString());
    }

    checkOS();
  }, [])
  
  return (
    <>
    {
      ostype === "Windows_NT" ?
        <AppFrameless />
        :
        <AppFrame />
    }
    </>
  );
}

export default App;