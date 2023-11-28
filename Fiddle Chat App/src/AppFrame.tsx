import "./styles/App.scss";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';
import Login from './pages/Login';
import Chats from './pages/Chats';
import { AuthProvider } from "./contexts/Authcontext";
import { Theme, ThemeProvider, createTheme } from '@mui/material/styles';

const theme: Theme = createTheme({
    typography: {
        fontFamily: [
            'Baloo Bhai 2',
            'cursive'
            ].join(','),
    },
});

function AppFrame() {
    const defaultDark: boolean = true;
    const [colourtheme, setTheme] = useLocalStorage<string>('colourtheme', defaultDark ? 'dark' : 'light');
    const [DARKLIGHT, setDARKLIGHT] = useLocalStorage<string>("DARKLIGHT",
    colourtheme === "light" || colourtheme === "lpink" || colourtheme === "lred" || colourtheme === "lgreen"
        ? "light" : "dark");

    function switchThemes(colour: string){
        setTheme(colour);
        setDARKLIGHT(colour === "light" || colour === "lpink" || colour === "lred" || colour === "lgreen" ? "light" : "dark");
    }

    return (
        <ThemeProvider theme={theme}>
        <div className="container AppFrame">
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

export default AppFrame;