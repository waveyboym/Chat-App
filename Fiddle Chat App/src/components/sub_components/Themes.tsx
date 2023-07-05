import "../../styles/Settings.scss";
import { motion } from "framer-motion";
import useLocalStorage from 'use-local-storage';
import { RgbaColor, RgbaColorPicker } from "react-colorful";
import { useState, useEffect, FunctionComponent } from "react";

type ThemesProps = {changeTheme: (arg: string) => void;}

const Themes : FunctionComponent<ThemesProps> = ({changeTheme}) => {
  const defaultBG = "#14161F";
  const [chatbackgroundcol, setbackgroundcol] = useLocalStorage<string>('chatBackgroundcol', defaultBG);
  const [themeCol, sethemeCol] = useLocalStorage<string>('themeCol', defaultBG);
  const [chatbackgroundimg, setchatbackgroundimg] = useLocalStorage<any>('chatbackgroundimg', null);//don't change any type because of FileReader ArrayBuffer
  const [RGBACP_color, setColor] = useState({ r: 200, g: 150, b: 35, a: 0.5 });
  const getCurrentTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(getCurrentTheme());  
  const mqListener = ((e: { matches: boolean | ((prevState: boolean) => boolean); }) => {setIsDarkTheme(e.matches);});

  function uploadImg(e: any){
    const image = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.addEventListener('load', () => setchatbackgroundimg(reader.result));
  }

  function convertRGBAtoHex(obj: RgbaColor){
    setColor(obj);
    let r = obj.r.toString(16);
    let g = obj.g.toString(16);
    let b = obj.b.toString(16);
    let a = Math.round(obj.a * 255).toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
    if (a.length == 1)
      a = "0" + a;
  
    setbackgroundcol( "#" + r + g + b + a);
  }

  function changeThemeColours(colour: string, theme: string){
    sethemeCol(colour);
    changeTheme(theme);
  }

  function getSystemTheme(){changeThemeColours("dark-blue-col-light-white-col", isDarkTheme === true ? "dark" : "light");}

  useEffect(() => {
      const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
      darkThemeMq.addEventListener('change',mqListener);
      return () => darkThemeMq.removeEventListener('change', mqListener);
  }, []);

  useEffect(() => {
    if(themeCol !== "dark-blue-col-light-white-col")return;
    getSystemTheme();
  }, [isDarkTheme]);
  
  return (
    <div className="themes">
      <div className="top-bar-blur"><h1>Themes</h1></div>
      <div className="themes-box">
        <h2>App Color scheme</h2>
        <div className="colour-palletes">
          <div className="theme-selector">
            <motion.div 
              className={themeCol === "dark-blue-col-light-white-col" ? "colour-circle selected-colour-circle" : "colour-circle"}
              id="dark-blue-col-light-white-col" 
              whileHover={{scale: 1.03}} 
              whileTap={{scale: 0.97}} 
              onClick={getSystemTheme}>
            </motion.div>
            <h3>System Theme</h3>
          </div>
          <div className="theme-selector">
            <motion.div 
              className={themeCol === "light-white-col" ? "colour-circle selected-colour-circle" : "colour-circle"}
              id="light-white-col"
               whileHover={{scale: 1.03}} 
               whileTap={{scale: 0.97}} 
               onClick={() => changeThemeColours("light-white-col", "light")}>
            </motion.div>
            <h3>Light Theme</h3>
          </div>
          <div className="theme-selector">
            <motion.div 
              className={themeCol === "dark-blue-col" ? "colour-circle selected-colour-circle" : "colour-circle"} 
              id="dark-blue-col" 
              whileHover={{scale: 1.03}} 
              whileTap={{scale: 0.97}} 
              onClick={() => changeThemeColours("dark-blue-col", "dark")}>
            </motion.div>
            <h3>Dark Theme</h3>
          </div>
          <div className="theme-selector">
            <motion.div 
              className={themeCol === "light-pink-col" ? "colour-circle selected-colour-circle" : "colour-circle"}
              id="light-pink-col" 
              whileHover={{scale: 1.03}} 
              whileTap={{scale: 0.97}} 
              onClick={() => changeThemeColours("light-pink-col", "lpink")}>
            </motion.div>
            <h3>Light pink theme</h3>
          </div>
          <div className="theme-selector">
            <motion.div 
              className={themeCol === "dark-pink-col" ? "colour-circle selected-colour-circle" : "colour-circle"}
              id="dark-pink-col" 
              whileHover={{scale: 1.03}} 
              whileTap={{scale: 0.97}} 
              onClick={() => changeThemeColours("dark-pink-col", "dpink")}>
            </motion.div>
            <h3>Dark pink theme</h3>
          </div>
          <div className="theme-selector">
            <motion.div 
              className={themeCol === "light-red-col" ? "colour-circle selected-colour-circle" : "colour-circle"}
              id="light-red-col" 
              whileHover={{scale: 1.03}} 
              whileTap={{scale: 0.97}} 
              onClick={() => changeThemeColours("light-red-col", "lred")}>
            </motion.div>
            <h3>Light red theme</h3>
          </div>
          <div className="theme-selector">
            <motion.div 
              className={themeCol === "dark-red-col" ? "colour-circle selected-colour-circle" : "colour-circle"}
              id="dark-red-col" 
              whileHover={{scale: 1.03}} 
              whileTap={{scale: 0.97}} 
              onClick={() => changeThemeColours("dark-red-col", "dred")}>
            </motion.div>
            <h3>Dark red theme</h3>
          </div>
          <div className="theme-selector">
            <motion.div 
              className={themeCol === "light-green-col" ? "colour-circle selected-colour-circle" : "colour-circle"}
              id="light-green-col" 
              whileHover={{scale: 1.03}} 
              whileTap={{scale: 0.97}} 
              onClick={() => changeThemeColours("light-green-col", "lgreen")}>
            </motion.div>
            <h3>Light green theme</h3>
          </div>
          <div className="theme-selector">
            <motion.div 
              className={themeCol === "dark-green-col" ? "colour-circle selected-colour-circle" : "colour-circle"}
              id="dark-green-col" 
              whileHover={{scale: 1.03}} 
              whileTap={{scale: 0.97}} 
              onClick={() => changeThemeColours("dark-green-col", "dgreen")}>
            </motion.div>
            <h3>Dark green theme</h3>
          </div>
        </div>
        <div className="currently-selected">
          <div className="currently-selected-shape">
            {chatbackgroundimg ? <img src={chatbackgroundimg} alt="background-img" className="background-img"/> :
            <div className="selected-colour" style={{background: chatbackgroundcol}}></div>}
          </div>
          <h3>Currently selected chat background colour/image</h3>
        </div>
        <motion.label className="upload-btn-container" whileTap={{scale: 0.97}}>
          <input name="background-img" type="file" accept="image/png, image/jpeg" onChange={uploadImg}/>
          upload chat wallpaper
        </motion.label>
        
        <h4>Colour picker</h4>
        <div className="colour-picker-holder">
          <RgbaColorPicker color={RGBACP_color} onChange={(colour: RgbaColor) => convertRGBAtoHex(colour)} />
        </div>
      </div>
    </div>
  )
}

export default Themes