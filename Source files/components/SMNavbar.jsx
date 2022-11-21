import { useState } from 'react';
import {addfriend_LM, addfriend_DM, addfriend_SLCTD, room_LM, room_DM, room_SLCTD,
  requests_LM, requests_DM, requests_SLCTD, settings_LM, settings_DM, settings_SLCTD,
  chatapplogo_IA, user_LM, user_DM} from "../projectAssets";
import "../styles/ConstContent.scss";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { motion } from "framer-motion";
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { useAuth } from '../contexts/Authcontext';

const SMNavbar = (props) => {
  const [isDarkMode, setDarkMode] = useState(props.setTheme === 'light'? false : true);
  const {userDB} = useAuth();

  function toggleDarkMode(){
    if(isDarkMode)setDarkMode(false);
    else setDarkMode(true);
    props.SwitchUserThemes();
  };

  return (
    <div className="SMNavbar-nav">
      <div className="current-logged-user-icon">
        { 
            (
            () => {
                  if(userDB !== null){
                      if(userDB.displayPhoto !== null)
                      {
                          return <img className="logged-in-user-icn" src={userDB.displayPhoto} alt="this_user_icon" referrerPolicy="no-referrer"/>;
                      }
                      else if(userDB.displayPhoto === null)
                      {
                          if(props.setTheme === 'light')
                          {
                              return <div className="icon-house-light"><img src={user_LM}/></div>;
                          }
                          else
                          {
                              return <div className="icon-house-dark"><img src={user_DM}/></div>;
                          }
                      }
                  }
                  else{
                    if(props.setTheme === 'light')
                    {
                        return <div className="icon-house-light"><img src={user_LM}/></div>;
                    }
                    else
                    {
                        return <div className="icon-house-dark"><img src={user_DM}/></div>;
                    }
                  }
                    
                }
            )()
        }
      </div>
      <div className="navigators">
        <Tooltip title="Send a friend request" placement="right" TransitionComponent={Zoom}>
          <motion.div className="nav-icon" onClick={props.set_accessAddfrnd} whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.9 }}>
          { props.currently_accessed_state === "addfriend" ? <img src={addfriend_SLCTD} alt="addfriend_SLCTD"/>
          : props.setTheme === 'light'? <img src={addfriend_LM} alt="addfriend_LM"/>
          : <img src={addfriend_DM} alt="addfriend_DM"/>}
          </motion.div>
        </Tooltip>
        <Tooltip title="Room options" placement="right" TransitionComponent={Zoom}>
          <motion.div className="nav-icon" onClick={props.set_accessJnrm} whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.9 }}>
          { props.currently_accessed_state === "joinroom" ? <img src={room_SLCTD} alt="room_SLCTD"/>
          : props.setTheme === 'light'? <img src={room_LM} alt="room_LM"/>
          : <img src={room_DM} alt="room_DM"/>}
          </motion.div>
        </Tooltip>
        <Tooltip title="see your friend requests" placement="right" TransitionComponent={Zoom}>
          <motion.div className="nav-icon" onClick={props.set_accessRqsts} whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.9 }}>
          { props.currently_accessed_state === "requests" ? <img src={requests_SLCTD} alt="requests_SLCTD"/>
          : props.setTheme === 'light'? <img src={requests_LM} alt="requests_LM"/>
          : <img src={requests_DM} alt="requests_DM"/>}
          </motion.div>
        </Tooltip>
        <Tooltip title="settings" placement="right" TransitionComponent={Zoom}>
          <motion.div className="nav-icon" onClick={props.set_accessStngs} whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.9 }}>
          { props.currently_accessed_state === "settings" ? <img src={settings_SLCTD} alt="settings_SLCTD"/>
          : props.setTheme === 'light'? <img src={settings_LM} alt="settings_LM"/>
          : <img src={settings_DM} alt="settings_DM"/>}
          </motion.div>
        </Tooltip>
      </div>
      <DarkModeSwitch
        style={{ marginTop: '4vh' }}
        checked={isDarkMode}
        onChange={toggleDarkMode}
        size={24}
        moonColor={"white"}
        sunColor={"gray"}
      />
      <img src={chatapplogo_IA} className="fiddle-chat-app-logo" alt="fiddle chat app"/>
    </div>
  )
}

export default SMNavbar