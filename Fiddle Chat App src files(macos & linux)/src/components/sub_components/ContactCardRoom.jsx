import "../../styles/ConstContent.scss";
import { motion } from "framer-motion";
import {room_LM, room_DM} from "../../projectAssets";

const ContactCardRoom = (props) => {

    function changeSelectedMsg(){
        let msgToSelect = document.getElementById("room" + props.setid);
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
        <motion.div className="room-msg-card" onClick={changeSelectedMsg} id={"room" + props.setid} whileTap={{scale: 0.97}}>
            <div className="room-icon">
            { 
                (
                () => {
                    if(props.setProfile !== null)
                    {
                        return <img className="icon" src={props.setProfile} referrerPolicy="no-referrer"/>;
                    }
                    else
                    {
                        if(props.darkTheme === 'light')
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
            <h2>{props.setName}</h2>
        </motion.div>
    )
}

export default ContactCardRoom