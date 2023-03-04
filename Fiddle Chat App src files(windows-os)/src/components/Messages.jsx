import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import TextField from '@mui/material/TextField';
import { motion } from "framer-motion";
import {deletefriend, user_LM, user_DM, dob_LM,  dob_DM, pronouns_LM, pronouns_DM, sendmsg_LM, sendmsg_DM , emoji_DM, emoji_LM} from "../projectAssets";
import {MessageBubblePriv} from './sub_components';
import "../styles/Messages.scss";
import {useRef, useEffect, useState} from "react";
import { useAuth } from '../contexts/Authcontext';
import { doc, collection, query, orderBy, onSnapshot, limit, getDoc} from "firebase/firestore";
import { db } from "../firebase";
import { handleSendingPrivateMessage, handleDeleteFriend } from "../contexts/AccessDB";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import useLocalStorage from 'use-local-storage';

const variants = {
  open: { opacity: 1, y: "0px"},
  closed: {  opacity: 0, y: "600px"},
}

const Messages = (props) => {
  const ref = useRef();
  const {userDB} = useAuth();

  const [friendsProfile, setfriendsProfile] = useState({
    id: props.msgRequestID, 
    username: "", 
    profile: null, 
    dob: "", 
    pronouns: ""
  });
  const [onloadComplete, setonloadComplete] = useState(false);
  const [messagesList, setmessagesList] = useState([]);
  const [value, setValue] = useState('');
  const [msgHolder, setmsgHolder] = useState(false);

  const [emojipickerchngr, set_emojipickerchngr] = useState(false);
  const defaultBG = "#14161F";
  const [chatbackgroundcol, setbackgroundcol] = useLocalStorage('chatBackgroundcol', defaultBG);
  const [chatbackgroundimg, setchatbackgroundimg] = useLocalStorage('chatbackgroundimg', null);

  const [blockMSG, setblockMSG] = useState(false);

  const deletePerson = async() =>{
    const obj = {
      currentUser: userDB,
      friendId: props.msgRequestID
    };
    handleDeleteFriend(obj).then((msg) => {
      if(msg === "SUCCESS")props.set_accessHome();
      else console.log(msg);
    }).catch((error) => {
      console.log(error);
    });
  }

  function showEmojiPicker(){set_emojipickerchngr(!emojipickerchngr);}

  function appendThisEmoji(emojiData){setValue(value + emojiData.native);}

  function handlechange(e){setValue(e.target.value);}

  function sendMessage(){
    if(value === "")return;
    if(blockMSG === true)return;
    const obj = {
      id: friendsProfile.id,
      user: userDB,
      friendId: props.msgRequestID,
      messageholder: msgHolder,
      message: value
    };
    handleSendingPrivateMessage(obj).then((boolval) => setblockMSG(!boolval)).catch((error) => console.log(error));
    
    setValue("");
  }

  const initFriend = async(friendRef) => {
    const frienddocSnap = await getDoc(friendRef);
    if(frienddocSnap.exists() !== true)return "FAILED";
    const objToInsert = {
      username: frienddocSnap.data().username,
      profile: frienddocSnap.data().displayPhoto,
      dob: frienddocSnap.data().dateOfBirth,
      pronouns: frienddocSnap.data().pronouns,
    }
    setfriendsProfile(objToInsert);
    return "SUCCESS";
  }

  const getMessageRef = () => {
    if(msgHolder === true){
      const userRef = doc(db, "users", userDB.uid);
      return doc(userRef, "messages", props.msgRequestID);
    }
    else{
      const friendRef = doc(db, "users", props.msgRequestID);
      return doc(friendRef, "messages", userDB.uid);
    }
  }

  useEffect(() => {
    const initMessages = async() => {
      if(onloadComplete === false)return;

      const messagesRef = getMessageRef();
      const q = query(collection(messagesRef, "privatemessages"), orderBy("timestamp", "asc"), limit(25));
      const unsub = onSnapshot(q, (querySnapshot) => {
        setmessagesList([]);
        querySnapshot.forEach((currentdoc) => {
          if(currentdoc.data().senderID === userDB.uid){
            setmessagesList(oldarray => [...oldarray, {
              msgid: currentdoc.id,
              id: userDB.uid,
              profile: userDB.displayPhoto,
              name: userDB.username,
              latest_msg: currentdoc.data().messageSent,
              date_sent: currentdoc.data().timestamp
            }]);
          }
          else{
            setmessagesList(oldarray => [...oldarray, {
              msgid: currentdoc.id,
              id: friendsProfile.id,
              profile: friendsProfile.profile,
              name: friendsProfile.username,
              latest_msg: currentdoc.data().messageSent,
              date_sent: currentdoc.data().timestamp
            }]);
          }
        })
      })
      return () =>{unsub();}
    }
    
    userDB && userDB.uid ? initMessages() : () => {};
  }, [friendsProfile, onloadComplete])

  useEffect(() => {ref.current?.scrollIntoView({ behavior: "smooth"});}, [messagesList])
  
  useEffect(() => {
    const loadSetup = async() => {
        setonloadComplete(false);
        //init basic user profile data
        const userRef = doc(db, "users", userDB.uid);
        const friendRef = doc(db, "users", props.msgRequestID);
        const msg = await initFriend(friendRef);
        //prepare ref to retrieve messages from
        if(msg === "SUCCESS"){
          const onfriendListRef = doc(userRef, "friends", props.msgRequestID);
          const MessageHolderSnap = await getDoc(onfriendListRef);
          if(MessageHolderSnap.exists() !== true){
            setblockMSG(true);
            return;
          }

          if(MessageHolderSnap.data().messageHolder === true)setmsgHolder(true);
          else setmsgHolder(false);
        }
        setonloadComplete(true);
    }
    
    userDB && userDB.uid ? loadSetup() : () => {};
  }, [props.msgRequestID])

  return (
    <div className="messages-details-box">
      <div className="messages-box">
        <div className="top-bar-blur">
          <div className="friends-icon">
            { 
                (
                () => {
                        if(friendsProfile.profile !== null)
                        {
                            return <img className="icon" src={friendsProfile.profile} referrerPolicy="no-referrer"/>;
                        }
                        else if(friendsProfile.profile === null)
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
                )()
            }
          </div>
          <h1>{friendsProfile.username}</h1>
        </div>
        <div className="text-messages-box">
              <div className="text-messages-container-plain">
                  {chatbackgroundimg ? (<div className='background-img-container'>
                      <img src={chatbackgroundimg} alt="background-img" className="background-img"/>
                    </div>) : (<div className='background-img-container' style={{background: chatbackgroundcol}}></div>)}
                  <div className="chat-bg-layer" style={chatbackgroundimg ? {background: "transparent"} : {}}>
                  <div className="chat-aligner"></div>
                  <h3 className='chat-messages-begin'>This is the beginning of your conversation with {friendsProfile.username}</h3>
                  {messagesList.map((messageobj) => <MessageBubblePriv
                                                      key={"privatemessage" + messageobj.msgid}
                                                      id={messageobj.id}
                                                      userProfile={messageobj.profile} 
                                                      userName={messageobj.name} 
                                                      message={messageobj.latest_msg} 
                                                      timesent={messageobj.date_sent}
                                                      signedInUserID={userDB.uid}
                                                      />)}
                  {blockMSG ? 
                    <h3 className='chat-messages-begin'>{friendsProfile.username} has deleted you from their friend list</h3>
                    : 
                    <div></div>
                  }
                  <div ref={ref} className="chat-aligner-plus"></div>
                </div>
              </div>
          <div className="textback-box">
            <div className="friends-icon">
              { 
                  (
                  () => {
                          if(userDB.displayPhoto !== null)
                          {
                              return <img className="icon" src={userDB.displayPhoto} referrerPolicy="no-referrer"/>;
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
                  )()
              }
            </div>
            <div className="input-holder">
              <TextField
                id="filled-multiline-flexible"
                multiline
                maxRows={4}
                value={value}
                onChange={handlechange}
                placeholder="Say something here..."
                color="primary"
                variant="standard"
                className="messageSendingObject"
                inputProps={{ style: { color: props.setTheme ==='light'? '#444444' : '#E6E6E6', fontFamily: 'Baloo Bhai 2 ,cursive' } }}
              />
            </div>
            <Tooltip title="select emoji's: " placement="top" TransitionComponent={Zoom}>
              <motion.div className="emoji-icon" whileHover={{ opacity: 0.8, scale: 1.03 }} whileTap={{scale: 0.97}} onClick={showEmojiPicker}>
                { props.setTheme ==='light'? <img src={emoji_LM} alt="select emoji"/>
                : <img src={emoji_DM} alt="select emoji"/>}
              </motion.div>
            </Tooltip>
            <Tooltip title={"send this message to: " + friendsProfile.username} placement="top" TransitionComponent={Zoom}>
              <motion.div className="nav-icon" whileHover={{ opacity: 0.8, scale: 1.03 }} whileTap={{scale: 0.97}} onClick={sendMessage}>
                { props.setTheme ==='light'? <img src={sendmsg_LM} alt="send message"/>
                : <img src={sendmsg_DM} alt="send message"/>}
              </motion.div>
            </Tooltip>
            <motion.div className='emoji-picker-holder'
              animate={emojipickerchngr ? "open" : "closed"}
              variants={variants}
            >
            <Picker 
              data={data} 
              onEmojiSelect={emojidata => appendThisEmoji(emojidata)}
              theme={props.setTheme ==='light'? "light" : "dark"}
              icons={"outline"}
              set={"native"} 
              perLine={8}
              previewPosition={"none"}
              skinTonePosition={"search"}
              />
            </motion.div>
          </div>
        </div>
      </div>
      <div className="details-box">
        <div className="friends-icon">
          { 
            (
            () => {
                    if(friendsProfile.profile !== null)
                    {
                        return <img className="icon" src={friendsProfile.profile} referrerPolicy="no-referrer"/>;
                    }
                    else if(friendsProfile.profile === null)
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
            )()
        }
        </div>
        <Tooltip title={"username: " + friendsProfile.username} placement="left" TransitionComponent={Zoom}>
          <motion.div className="nav-icon" whileHover={{ opacity: 0.8 }}>
            { props.setTheme ==='light'? <img src={user_LM} alt="user"/>
            : <img src={user_DM} alt="user"/>}
          </motion.div>
        </Tooltip>
        <Tooltip title={"date of birth: " + friendsProfile.dob} placement="left" TransitionComponent={Zoom}>
          <motion.div className="nav-icon" whileHover={{ opacity: 0.8 }}>
            { props.setTheme ==='light'? <img src={dob_LM} alt="date of birth"/>
            : <img src={dob_DM} alt="date of birth"/>}
          </motion.div>
        </Tooltip>
        <Tooltip title={"pronouns: " + friendsProfile.pronouns} placement="left" TransitionComponent={Zoom}>
          <motion.div className="nav-icon" whileHover={{ opacity: 0.8 }}>
            { props.setTheme ==='light'? <img src={pronouns_LM} alt="pronouns"/>
            : <img src={pronouns_DM} alt="pronouns"/>}
          </motion.div>
        </Tooltip>
        <Tooltip title={"delete " + friendsProfile.username} placement="left" TransitionComponent={Zoom}>
          <motion.div className="nav-icon" onClick={deletePerson} whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.9 }} style={{cursor: "pointer"}}>
            <img src={deletefriend} alt="delete person"/>
          </motion.div>
        </Tooltip>
      </div>
    </div>
  )
}

export default Messages