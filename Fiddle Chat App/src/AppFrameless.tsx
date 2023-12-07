import { useEffect } from "react";
import { appWindow } from '@tauri-apps/api/window';
import {min_w_10,min_w_12,min_w_15,min_w_20,min_w_24,min_w_30,max_w_10,max_w_12,max_w_15,
        max_w_20,max_w_24,max_w_30, restore_w_10,restore_w_12,restore_w_15,restore_w_20,
        restore_w_24,restore_w_30, close_w_10,close_w_12,close_w_15,close_w_20,close_w_24,close_w_30} from "./assets/window-icons";
import "./styles/App.scss";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';
import Login from './pages/Login';
import Chats from './pages/Chats';
import { AuthProvider } from "./contexts/Authcontext";
import { Theme, ThemeProvider, createTheme } from '@mui/material/styles';
import { goOffline } from "./contexts/AccessDB";

const theme: Theme = createTheme({
    typography: {
        fontFamily: [
            'Baloo Bhai 2',
            'cursive'
            ].join(','),
    },
});

function AppFrameless() {
    const defaultDark: boolean = true;
    const [colourtheme, setTheme] = useLocalStorage<string>('colourtheme', defaultDark ? 'dark' : 'light');
    const [DARKLIGHT, setDARKLIGHT] = useLocalStorage<string>("DARKLIGHT", colourtheme.startsWith("l") ? "light" : "dark");

    function switchThemes(colour: string){
        setTheme(colour);
        setDARKLIGHT(colour.startsWith("l") ? "light" : "dark");
    }

    useEffect(() => {
        const minimizeID: HTMLElement | null = document.getElementById('minimize');
        const maximizeID: HTMLElement | null = document.getElementById('maximize');
        const restoreID: HTMLElement | null = document.getElementById('restore');
        const closeID: HTMLElement | null = document.getElementById('close');

        const handleScreenResize = async() => {
            const isMaximized: boolean = await appWindow.isMaximized();
            if(isMaximized === true){
                const maximizebtn: HTMLElement | null = document.getElementById("maximize");
                const restorebtn: HTMLElement | null = document.getElementById("restore");

                if(maximizebtn)maximizebtn.style.visibility = "hidden";
                if(restorebtn)restorebtn.style.visibility = "visible";
            }
            else{
                const maximizebtn: HTMLElement | null = document.getElementById("maximize");
                const restorebtn: HTMLElement | null = document.getElementById("restore");

                if(maximizebtn)maximizebtn.style.visibility = "visible";
                if(restorebtn)restorebtn.style.visibility = "hidden";
            }
        }

        const minimizeWindow = () => appWindow.minimize();
        const togglemaximizeWindow = () => appWindow.toggleMaximize();
        const closeWindow = () => {
            goOffline().then(() => appWindow.close()).catch((_error) => appWindow.close());
        }
    
        window.addEventListener("resize", handleScreenResize);
        if(minimizeID)minimizeID.addEventListener('click', minimizeWindow);
        if(maximizeID)maximizeID.addEventListener('click', togglemaximizeWindow);
        if(restoreID)restoreID.addEventListener('click', togglemaximizeWindow);
        if(closeID)closeID.addEventListener('click', closeWindow);
        
        return () => {
            window.removeEventListener("resize", handleScreenResize);
            if(minimizeID)minimizeID.removeEventListener('click', minimizeWindow);
            if(maximizeID)maximizeID.removeEventListener('click', togglemaximizeWindow);
            if(restoreID)restoreID.removeEventListener('click', togglemaximizeWindow);
            if(closeID)closeID.removeEventListener('click', closeWindow);
        };
    }, [])

    return (
        <ThemeProvider theme={theme}>
        <div className="container AppFrameless">
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
                            <Route path="/chat" element={<Chats changeTheme={switchThemes} curr_Theme={colourtheme} darklight={DARKLIGHT}/>}/>
                        </Routes>
                    </AuthProvider>
                </Router>
            </div>
        </div>
        </ThemeProvider>
    );
}

export default AppFrameless;