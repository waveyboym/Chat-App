import "../../styles/ConstContent.scss";
import { motion } from "framer-motion";
import {room_LM, room_DM} from "../../projectAssets";
import {FunctionComponent} from 'react';

type ContactCardRoomProps = {
    darklight: string, 
    setid: string,
    setProfile: string | null,
    setName: string,
    setMsgTab: (arg: string)=> void;
  }

const ContactCardRoom : FunctionComponent<ContactCardRoomProps> = ({darklight, setid, setProfile, setName, setMsgTab}) => {

    function changeSelectedMsg(){
        let msgToSelect = document.getElementById("room" + setid);
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
        <motion.div className="room-msg-card" onClick={changeSelectedMsg} id={"room" + setid} whileTap={{scale: 0.97}}>
            <div className="room-icon">
            { 
                (
                () => {
                    if(setProfile !== null)
                    {
                        return <img className="icon" src={setProfile} referrerPolicy="no-referrer"/>;
                    }
                    else
                    {
                        if(darklight === 'light')
                        {
                            return <div className="icon-house-light"><img src={room_LM}/></div>;
                        }
                        else
                        {
                            return <div className="icon-house-dark"><img src={room_DM}/></div>;
                        }
                    }
                }
                )()
            } 
            </div>
            <h2>{setName}</h2>
        </motion.div>
    )
}

export default ContactCardRoom