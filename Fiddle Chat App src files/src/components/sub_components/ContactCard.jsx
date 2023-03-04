import "../../styles/ConstContent.scss";
import { motion } from "framer-motion";
import { user_LM, user_DM} from "../../projectAssets";

const ContactCard = (props) => {

  function changeSelectedMsg(){
    let msgToSelect = document.getElementById(props.setid);
    let oldSelecteed = document.querySelector(".selected-contact-msg");

    if(msgToSelect != null){
      msgToSelect.classList.add("selected-contact-msg");
    }

    if(oldSelecteed != null){
      oldSelecteed.classList.remove("selected-contact-msg");
    }

    props.setMsgTab(props.setid);
  }

  return (
      <motion.div className="contact-msg-card" onClick={changeSelectedMsg} id={props.setid} whileTap={{scale: 0.97}}>
        <div className="friends-icon">
          { 
            (
              () => {
                if(props.setProfile === null)
                {
                  if(props.darkTheme === 'light')
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
                  return <img className="icon" src={props.setProfile} referrerPolicy="no-referrer"/>;
                  }
              }
            )()
          } 
        </div>
        <div className="name-and-message">
          <h2>{props.setName}</h2>
          <h3>{props.setLtstMsg}</h3>
        </div>
        {props.setRead === false && (<div className="unread-message-circle"></div>)}
      </motion.div>
  )
}
export default ContactCard