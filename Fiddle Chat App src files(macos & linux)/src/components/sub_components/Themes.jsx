import "../../styles/Settings.scss";
import { motion } from "framer-motion";
import useLocalStorage from 'use-local-storage';
import { RgbaColorPicker } from "react-colorful";
import { useState } from "react";

const Themes = () => {
  const defaultBG = "#14161F";
  const [chatbackgroundcol, setbackgroundcol] = useLocalStorage('chatBackgroundcol', defaultBG);
  const [chatbackgroundimg, setchatbackgroundimg] = useLocalStorage('chatbackgroundimg', null);
  const [RGBACP_color, setColor] = useState({ r: 200, g: 150, b: 35, a: 0.5 });

  function uploadImg(e){setchatbackgroundimg(URL.createObjectURL(e.target.files[0]));}

  function changeChatBackground(colour){setbackgroundcol(colour); setchatbackgroundimg(null);}

  function convertRGBAtoHex(obj){
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
  
  return (
    <div className="themes">
      <div className="top-bar-blur"><h1>Themes</h1></div>
      <div className="themes-box">
      <div className="currently-selected">
          <div className="currently-selected-shape">
            {chatbackgroundimg ? <img src={chatbackgroundimg} alt="background-img" className="background-img"/> :
            <div className="selected-colour" style={{background: chatbackgroundcol}}></div>}
          </div>
          <h3>Currently selected chat background colour/image</h3>
        </div>
        <motion.div className="upload-btn-container" whileTap={{scale: 0.97}}>
          <input name="background-img" type="file" accept="image/png, image/jpeg" onChange={uploadImg}/>
        </motion.div>
        <h2>Available chat background colour pallettes</h2>
        <div className="colour-palletes">
          <motion.div className="colour-circle" id="dark-blue-col" whileHover={{scale: 1.03}} whileTap={{scale: 0.97}} onClick={() => changeChatBackground("#14161F")}></motion.div>
          <motion.div className="colour-circle" id="light-white-col" whileHover={{scale: 1.03}} whileTap={{scale: 0.97}} onClick={() => changeChatBackground("#DCDBDB")}></motion.div>
          <motion.div className="colour-circle" id="pink-col" whileHover={{scale: 1.03}} whileTap={{scale: 0.97}} onClick={() => changeChatBackground("#fa88f0")}></motion.div>
          <motion.div className="colour-circle" id="red-col" whileHover={{scale: 1.03}} whileTap={{scale: 0.97}} onClick={() => changeChatBackground("#f88787")}></motion.div>
          <motion.div className="colour-circle" id="cyan-col" whileHover={{scale: 1.03}} whileTap={{scale: 0.97}} onClick={() => changeChatBackground("#87e9fa")}></motion.div>
          <motion.div className="colour-circle" id="green-col" whileHover={{scale: 1.03}} whileTap={{scale: 0.97}} onClick={() => changeChatBackground("#aef891")}></motion.div>
        </div>
        <h4>Colour picker</h4>
        <div className="colour-picker-holder">
          <RgbaColorPicker color={RGBACP_color} onChange={(colour) => convertRGBAtoHex(colour)} />
        </div>
      </div>
    </div>
  )
}

export default Themes