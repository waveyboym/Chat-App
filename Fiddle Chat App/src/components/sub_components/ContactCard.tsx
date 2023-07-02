import "../../styles/ConstContent.scss";
import { motion } from "framer-motion";
import { user_LM, user_DM} from "../../projectAssets";
import {FunctionComponent} from 'react';

type ContactCardProps = {
  darklight: string, 
  setid: string,
  setProfile: string | null,
  setName: string,
  setLtstMsg: string,
  setRead: boolean,
  setMsgTab: (arg: string)=> void;
}

const ContactCard : FunctionComponent<ContactCardProps> = ({darklight, setid, setProfile, setName, setLtstMsg, setRead, setMsgTab}) => {

  function changeSelectedMsg(){
    let msgToSelect = document.getElementById(setid);
    let oldSelecteed = document.querySelector(".selected-contact-msg");

    if(msgToSelect != null){
      msgToSelect.classList.add("selected-contact-msg");
    }

    if(oldSelecteed != null){
      oldSelecteed.classList.remove("selected-contact-msg");
    }

    setMsgTab(setid);
  }

  return (
      <motion.div className="contact-msg-card" onClick={changeSelectedMsg} id={setid} whileTap={{scale: 0.97}}>
        <div className="friends-icon">
          { 
            (
              () => {
                if(setProfile === null)
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
                else//if(props.setProfile != null)
                { 
                  return <img className="icon" src={setProfile} referrerPolicy="no-referrer"/>;
                  }
              }
            )()
          } 
        </div>
        <div className="name-and-message">
          <h2>{setName}</h2>
          <h3>{setLtstMsg}</h3>
        </div>
        {setRead === false && (<div className="unread-message-circle"></div>)}
      </motion.div>
  )
}
export default ContactCard