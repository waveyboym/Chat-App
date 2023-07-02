import { FunctionComponent } from 'react';
import {addfriend_LM, addfriend_DM, addfriend_SLCTD, room_LM, room_DM, room_SLCTD,
  requests_LM, requests_DM, requests_SLCTD, settings_LM, settings_DM, settings_SLCTD,
  chatapplogo_IA, user_LM, user_DM, user_SLCTD} from "../projectAssets";
import "../styles/ConstContent.scss";
import { motion } from "framer-motion";
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { useAuth } from '../contexts/Authcontext';

type SMNavbarProps = {
  darklight: string,
  currently_accessed_state: string,
  set_accessfrndList: () => void;
  set_accessAddfrnd: () => void;
  set_accessJnrm: () => void;
  set_accessRqsts: () => void;
  set_accessStngs: () => void;
}

const SMNavbar : FunctionComponent<SMNavbarProps> = ({
  darklight, 
  currently_accessed_state,
  set_accessfrndList,
  set_accessAddfrnd,
  set_accessJnrm,
  set_accessRqsts,
  set_accessStngs
}) => {
  const {userDB}: any = useAuth();

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
                          if(darklight === 'light')
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
                    if(darklight === 'light')
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
      <Tooltip title="See all your friends" placement="right" TransitionComponent={Zoom}>
          <motion.div className="nav-icon" onClick={set_accessfrndList} whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.9 }}>
          { currently_accessed_state === "friendlist" ? <img src={user_SLCTD} alt="friend_SLCTD"/>
          : darklight === 'light'? <img src={user_LM} alt="friend_LM"/>
          : <img src={user_DM} alt="friend_DM"/>}
          </motion.div>
        </Tooltip>
        <Tooltip title="Send a friend request" placement="right" TransitionComponent={Zoom}>
          <motion.div className="nav-icon" onClick={set_accessAddfrnd} whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.9 }}>
          { currently_accessed_state === "addfriend" ? <img src={addfriend_SLCTD} alt="addfriend_SLCTD"/>
          : darklight === 'light'? <img src={addfriend_LM} alt="addfriend_LM"/>
          : <img src={addfriend_DM} alt="addfriend_DM"/>}
          </motion.div>
        </Tooltip>
        <Tooltip title="Room options" placement="right" TransitionComponent={Zoom}>
          <motion.div className="nav-icon" onClick={set_accessJnrm} whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.9 }}>
          { currently_accessed_state === "joinroom" ? <img src={room_SLCTD} alt="room_SLCTD"/>
          : darklight === 'light'? <img src={room_LM} alt="room_LM"/>
          : <img src={room_DM} alt="room_DM"/>}
          </motion.div>
        </Tooltip>
        <Tooltip title="see your friend requests" placement="right" TransitionComponent={Zoom}>
          <motion.div className="nav-icon" onClick={set_accessRqsts} whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.9 }}>
          { currently_accessed_state === "requests" ? <img src={requests_SLCTD} alt="requests_SLCTD"/>
          : darklight === 'light'? <img src={requests_LM} alt="requests_LM"/>
          : <img src={requests_DM} alt="requests_DM"/>}
          </motion.div>
        </Tooltip>
        <Tooltip title="settings" placement="right" TransitionComponent={Zoom}>
          <motion.div className="nav-icon" onClick={set_accessStngs} whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.9 }}>
          { currently_accessed_state === "settings" ? <img src={settings_SLCTD} alt="settings_SLCTD"/>
          : darklight === 'light'? <img src={settings_LM} alt="settings_LM"/>
          : <img src={settings_DM} alt="settings_DM"/>}
          </motion.div>
        </Tooltip>
      </div>
      <img src={chatapplogo_IA} className="fiddle-chat-app-logo" alt="fiddle chat app"/>
    </div>
  )
}

export default SMNavbar