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
  
  return (
    <ThemeProvider theme={Theme}>
      <div className="container">
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
