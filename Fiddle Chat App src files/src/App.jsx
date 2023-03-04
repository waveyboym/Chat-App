import { useEffect } from "react";
import { appWindow } from '@tauri-apps/api/window';
import {min_w_10,min_w_12,min_w_15,min_w_20,min_w_24,min_w_30,max_w_10,max_w_12,max_w_15,max_w_20,max_w_24,max_w_30,
      restore_w_10,restore_w_12,restore_w_15,restore_w_20,restore_w_24,restore_w_30,
      close_w_10,close_w_12,close_w_15,close_w_20,close_w_24,close_w_30
  } from "./assets/window-icons";
import "./App.css";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';
import Login from './components/Login';
import Chats from './components/Chats';
import { AuthProvider } from "./contexts/Authcontext";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const Theme = createTheme({
    typography: {
        fontFamily: [
            'Baloo Bhai 2',
            'cursive'
            ].join(','),
    },
});

function App() {
  const defaultDark = true;
  const [colourtheme, setTheme] = useLocalStorage('colourtheme', defaultDark ? 'dark' : 'light');

  function switchThemes(){setTheme(colourtheme === 'light' ? 'dark' : 'light');}

  useEffect(() => {
    const minimizeID = document.getElementById('minimize');
    const maximizeID = document.getElementById('maximize');
    const restoreID = document.getElementById('restore');
    const closeID = document.getElementById('close');

    const handleScreenResize = async() => {
      const isMaximized = await appWindow.isMaximized();
      if(isMaximized === true){
        const maximizebtn = document.getElementById("maximize");
        const restorebtn = document.getElementById("restore");

        maximizebtn.style.visibility = "hidden";
        restorebtn.style.visibility = "visible";
      }
      else{
        const maximizebtn = document.getElementById("maximize");
        const restorebtn = document.getElementById("restore");

        maximizebtn.style.visibility = "visible";
        restorebtn.style.visibility = "hidden";
      }
    }
  
    window.addEventListener("resize", handleScreenResize);
    if(minimizeID)minimizeID.addEventListener('click', () => appWindow.minimize());
    if(maximizeID)maximizeID.addEventListener('click', () => appWindow.toggleMaximize());
    if(restoreID)restoreID.addEventListener('click', () => appWindow.toggleMaximize());
    if(closeID)closeID.addEventListener('click', () => appWindow.close());
    return () => {
      window.removeEventListener("resize", handleScreenResize);
      if(minimizeID)minimizeID.removeEventListener('click', () => appWindow.minimize());
      if(maximizeID)maximizeID.removeEventListener('click', () => appWindow.toggleMaximize());
      if(restoreID)restoreID.removeEventListener('click', () => appWindow.toggleMaximize());
      if(closeID)closeID.removeEventListener('click', () => appWindow.close());
    };
  }, [])
  
  return (
    <ThemeProvider theme={Theme}>
      <div className="container">
        <div data-tauri-drag-region id="titleBarContainer" data-theme={colourtheme}>
              <h1>Fiddle Chat App</h1>
              <div className="window-controls-section">
                  <div className="button-area" id="minimize">
                      <img className="icon" srcSet={`${min_w_10} 1x, ${min_w_12} 1.25x, ${min_w_15} 1.5x, ${min_w_15} 1.75x,
                          ${min_w_20} 2x, ${min_w_20} 2.25x, ${min_w_24} 2.5x, ${min_w_30} 3x, ${min_w_30} 3.5x`}/>
                  </div>
                  <div className="inter-changeable-btn">
                    <div className="button-area" id="maximize">
                        <img className="icon" srcSet={`${max_w_10} 1x, ${max_w_12} 1.25x, ${max_w_15} 1.5x, ${max_w_15} 1.75x,
                            ${max_w_20} 2x, ${max_w_20} 2.25x, ${max_w_24} 2.5x, ${max_w_30} 3x, ${max_w_30} 3.5x`}/>
                    </div>
                    <div className="button-area" id="restore">
                        <div className="restore-sub-area">
                            <img className="icon" srcSet={`${restore_w_10} 1x, ${restore_w_12} 1.25x, ${restore_w_15} 1.5x, ${restore_w_15} 1.75x,
                                ${restore_w_20} 2x, ${restore_w_20} 2.25x, ${restore_w_24} 2.5x, ${restore_w_30} 3x, ${restore_w_30} 3.5x`}/>
                        </div>
                    </div>
                  </div>
                  
                  <div className="button-area" id="close">
                      <img className="icon" srcSet={`${close_w_10} 1x, ${close_w_12} 1.25x, ${close_w_15} 1.5x, ${close_w_15} 1.75x,
                          ${close_w_20} 2x, ${close_w_20} 2.25x, ${close_w_24} 2.5x, ${close_w_30} 3x, ${close_w_30} 3.5x`}/>
                  </div>
              </div>
        </div>
        <div className="body-main-content">
            <Router>
                <AuthProvider>
                    <Routes> 
                        <Route path="/" element={<Login />}/>
                        <Route path="/chat" element={<Chats changeTheme={switchThemes} curr_Theme={colourtheme}/>}/>
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
