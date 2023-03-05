import { useState } from 'react';
import {user_LM, user_DM, themes_LM, themes_DM, about_LM, about_DM} from "../projectAssets";
import { motion } from "framer-motion";
import { About, PersonalDetails, Themes } from './sub_components';
import "../styles/Settings.scss";

const Settings = (props) => {

  const [current_sttngs_dlg, set_current_sttngs_dlg] = useState("personal-details-settings");

  function changeSelectedSettings(idnum){
    let stToSelect = document.getElementById(idnum);
    let oldSelecteed = document.querySelector(".selected-sttngs");

    if(stToSelect != null){
      stToSelect.classList.add("selected-sttngs");
    }

    if(oldSelecteed != null){
      oldSelecteed.classList.remove("selected-sttngs");
    }
    set_current_sttngs_dlg(idnum);
  }

  return (
    <div className="settings-details-box">
      <div className="settings-navigator">
        <div className="top-bar-blur"><h1>Settings</h1></div>
        <div className="settings-selection">
          <motion.div className="sttngs_dlg-state-changer selected-sttngs" 
            onClick={() => changeSelectedSettings("personal-details-settings")} 
            whileTap={{scale: 0.97}}
            id="personal-details-settings">
            { props.setTheme === 'light'? <img src={user_LM} alt="user"/>
            : <img src={user_DM} alt="user"/>}
            <h2>Personal details</h2>
          </motion.div>
          <motion.div className="sttngs_dlg-state-changer" 
            onClick={() => changeSelectedSettings("themes-settings")} 
            whileTap={{scale: 0.97}}
            id="themes-settings">
            { props.setTheme === 'light'? <img src={themes_LM} alt="themes"/>
            : <img src={themes_DM} alt="themes"/>}
            <h2>themes</h2>
          </motion.div>
          <motion.div className="sttngs_dlg-state-changer" 
            onClick={() => changeSelectedSettings("about-settings")}  
            whileTap={{scale: 0.97}}
            id="about-settings">
            { props.setTheme === 'light'? <img src={about_LM} alt="about"/>
            : <img src={about_DM} alt="about"/>}
            <h2>about</h2>
          </motion.div>
        </div>
      </div>
      {
        (
          () => {
            switch(current_sttngs_dlg){
              case "personal-details-settings":
                return <PersonalDetails Theme={props.setTheme}/>
              case "themes-settings":
                return <Themes/>
              case "about-settings":
                return <About Theme={props.setTheme}/>
              default:
                return <PersonalDetails Theme={props.setTheme}/>
            }
          }
        )()
      }
    </div>
  )
}

export default Settings