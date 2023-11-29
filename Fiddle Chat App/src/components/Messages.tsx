import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import TextField from '@mui/material/TextField';
import { motion } from "framer-motion";
import {deletefriend, user_LM, user_DM, dob_LM,  dob_DM, pronouns_LM, pronouns_DM, sendmsg_LM, sendmsg_DM , emoji_DM, emoji_LM} from "../projectAssets";
import {MessageBubblePriv} from './sub_components';
import "../styles/Messages.scss";
import {useRef, useEffect, useState, FunctionComponent} from "react";
import { useAuth } from '../contexts/Authcontext';
import { doc, collection, query, orderBy, onSnapshot, limit, getDoc, DocumentReference, DocumentData, DocumentSnapshot, Query, Unsubscribe} from "firebase/firestore";
import { db } from "../firebase";
import { handleSendingPrivateMessage, handleDeleteFriend } from "../contexts/AccessDB";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import useLocalStorage from 'use-local-storage';
import { authProviderType } from '../types';

const variants = {
  open: { opacity: 1, y: "0px"},
  closed: {  opacity: 0, y: "600px"},
}

type MessagesProps = {msgRequestID: string, darklight: string, set_accessHome: () => void;}

const Messages : FunctionComponent<MessagesProps> = ({msgRequestID, darklight, set_accessHome}) => {
  const ref = useRef<null | HTMLDivElement>(null);
  const { userDB }: authProviderType = useAuth();

  const [friendsProfile, setfriendsProfile] = useState<{
    id: string, 
    username: string, 
    profile: null| string, 
    dob: string, 
    pronouns: string
  }>({id: msgRequestID, username: "", profile: null, dob: "", pronouns: ""});

  const onloadComplete = useRef<boolean>(false);
  const [messagesList, setmessagesList] = useState<{
      msgid: string, id: string, profile: string | null, name: string, latest_msg: string, date_sent: string
    }[]>([]);
  const [value, setValue] = useState<string>('');
  const msgHolder= useRef<boolean>(false);
  const tempProfile = useRef<string | null>(null);
  const tempUsername = useRef<string>("");

  const [emojipickerchngr, set_emojipickerchngr] = useState<boolean>(false);
  const defaultBG: string = "#14161F";
  const [chatbackgroundcol, setbackgroundcol] = useLocalStorage<string>('chatBackgroundcol', defaultBG);
  const [chatbackgroundimg, setchatbackgroundimg] = useLocalStorage<any>('chatbackgroundimg', null);//don't change any type because of FileReader ArrayBuffer

  const [blockMSG, setblockMSG] = useState<boolean>(false);

  const deletePerson = async(): Promise<void> =>{
    const obj: {currentUser: any,friendId: string} = 
    {
      currentUser: userDB,
      friendId: msgRequestID
    };
    handleDeleteFriend(obj).then((msg: string) => {
      if(msg === "SUCCESS")set_accessHome();
      else console.log(msg);
    }).catch((error: any) => {
      console.log(error);
    });
  }

  function showEmojiPicker(): void{set_emojipickerchngr(!emojipickerchngr);}

  function appendThisEmoji(emojiData: any): void{setValue(value + emojiData.native);}

  function handlechange(e: any): void{setValue(e.target.value);}

  function sendMessage(): void{
    if(value === "")return;
    if(blockMSG === true)return;
    const obj: {id: string, user: any, friendId: string, messageholder: boolean, message: string} = 
      {
        id: friendsProfile.id,
        user: userDB,
        friendId: msgRequestID,
        messageholder: msgHolder.current,
        message: value
      };
    handleSendingPrivateMessage(obj).then((boolval) => setblockMSG(!boolval)).catch((error) => console.log(error));
    
    setValue("");
  }

  const initFriend = async(friendRef: DocumentReference<DocumentData>): Promise<"FAILED" | "SUCCESS"> => {
    setfriendsProfile({id: msgRequestID,username: "",profile: null,dob: "",pronouns: ""});
    const frienddocSnap: DocumentSnapshot<DocumentData> = await getDoc(friendRef);
    if(frienddocSnap.exists() !== true)return "FAILED";
    else{
      const objToInsert: {id: string, username: string, profile: string | null, dob: string, pronouns: string} = 
        {
          id: msgRequestID,
          username: frienddocSnap.data()?.username,
          profile: frienddocSnap.data()?.displayPhoto,
          dob: frienddocSnap.data()?.dateOfBirth,
          pronouns: frienddocSnap.data()?.pronouns,
        }
      tempProfile.current = frienddocSnap.data()?.displayPhoto;
      tempUsername.current = frienddocSnap.data()?.username;
      setfriendsProfile(objToInsert);
      return "SUCCESS";
    }
  }

  const getMessageRef = (): DocumentReference<DocumentData> => {
    if(msgHolder.current === true){
      const userRef: DocumentReference<DocumentData> = doc(db, "users", userDB!.uid);
      return doc(userRef, "messages", msgRequestID);
    }
    else{
      const friendRef:  DocumentReference<DocumentData> = doc(db, "users", msgRequestID);
      return doc(friendRef, "messages", userDB!.uid);
    }
  }

  const initMessages = async(): Promise<() => void> => {
    setmessagesList([]);
    const messagesRef: DocumentReference<DocumentData> = getMessageRef();
    const q: Query<DocumentData> = query(collection(messagesRef, "privatemessages"), orderBy("timestamp", "asc"), limit(25));
    const unsub: Unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messagesarr: {
          msgid: string, 
          id: string, 
          profile: string | null, 
          name: string, 
          latest_msg: string, 
          date_sent: string
        }[] = [];

      querySnapshot.forEach((currentdoc) => {
        if(currentdoc.data().senderID === userDB!.uid){
          messagesarr.push({
            msgid: currentdoc.id,
            id: userDB!.uid,
            profile: userDB!.displayPhoto,
            name: userDB!.username,
            latest_msg: currentdoc.data().messageSent,
            date_sent: currentdoc.data().timestamp
          });
        }
        else{
          messagesarr.push({
            msgid: currentdoc.id,
            id: msgRequestID,
            profile: tempProfile.current,
            name: tempUsername.current,
            latest_msg: currentdoc.data().messageSent,
            date_sent: currentdoc.data().timestamp
          });
        }
      })
      setmessagesList(messagesarr);
    })
    return () =>{unsub();}
  }
  
  useEffect(() => {ref.current?.scrollIntoView({ behavior: "smooth"});}, [messagesList])
  
  useEffect(() => {
    const loadSetup = async() => {
        if(onloadComplete.current === true)return;
        onloadComplete.current = true;
        //init basic user profile data
        const userRef = doc(db, "users", userDB!.uid);
        const friendRef: DocumentReference<DocumentData> = doc(db, "users", msgRequestID);
        const msg = await initFriend(friendRef);
        //prepare ref to retrieve messages from
        if(msg === "SUCCESS"){
          const onfriendListRef = doc(userRef, "friends", msgRequestID);
          const MessageHolderSnap = await getDoc(onfriendListRef);
          if(MessageHolderSnap.exists() !== true){
            setblockMSG(true);
            return;
          }
          else{
            msgHolder.current = MessageHolderSnap.data()?.messageHolder === true ? true : false;
            await initMessages();
          }
          
        }
    }
    
    userDB! && userDB!.uid ? loadSetup() : () => {};
  }, [msgRequestID])

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
                                                  darklight={darklight}
                                                  userName={messageobj.name} 
                                                  message={messageobj.latest_msg} 
                                                  timesent={messageobj.date_sent}
                                                  signedInUserID={userDB!.uid}
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
                          if(userDB!.displayPhoto !== null)
                          {
                              return <img className="icon" src={userDB!.displayPhoto} referrerPolicy="no-referrer"/>;
                          }
                          else if(userDB!.displayPhoto === null)
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
                inputProps={{ style: { color: darklight ==='light'? '#444444' : '#E6E6E6', fontFamily: 'Baloo Bhai 2 ,cursive' } }}
              />
            </div>
            <Tooltip title=" select emoji's: " placement="top" TransitionComponent={Zoom}>
              <motion.div className="emoji-icon" whileHover={{ opacity: 0.8, scale: 1.03 }} whileTap={{scale: 0.97}} onClick={showEmojiPicker}>
                { darklight ==='light'? <img src={emoji_LM} alt="select emoji"/>
                : <img src={emoji_DM} alt="select emoji"/>}
              </motion.div>
            </Tooltip>
            <Tooltip title={"send this message to: " + friendsProfile.username} placement="top" TransitionComponent={Zoom}>
              <motion.div className="nav-icon" whileHover={{ opacity: 0.8, scale: 1.03 }} whileTap={{scale: 0.97}} onClick={sendMessage}>
                { darklight ==='light'? <img src={sendmsg_LM} alt="send message"/>
                : <img src={sendmsg_DM} alt="send message"/>}
              </motion.div>
            </Tooltip>
            <motion.div className='emoji-picker-holder'
              animate={emojipickerchngr ? "open" : "closed"}
              variants={variants}
            >
            <Picker 
              data={data} 
              onEmojiSelect={(emojidata: any) => {appendThisEmoji(emojidata)}}
              theme={darklight ==='light'? "light" : "dark"}
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
        <Tooltip title={"username: " + friendsProfile.username} placement="left" TransitionComponent={Zoom}>
          <motion.div className="nav-icon" whileHover={{ opacity: 0.8 }}>
            { darklight ==='light'? <img src={user_LM} alt="user"/>
            : <img src={user_DM} alt="user"/>}
          </motion.div>
        </Tooltip>
        <Tooltip title={"date of birth: " + friendsProfile.dob} placement="left" TransitionComponent={Zoom}>
          <motion.div className="nav-icon" whileHover={{ opacity: 0.8 }}>
            { darklight ==='light'? <img src={dob_LM} alt="date of birth"/>
            : <img src={dob_DM} alt="date of birth"/>}
          </motion.div>
        </Tooltip>
        <Tooltip title={"pronouns: " + friendsProfile.pronouns} placement="left" TransitionComponent={Zoom}>
          <motion.div className="nav-icon" whileHover={{ opacity: 0.8 }}>
            { darklight ==='light'? <img src={pronouns_LM} alt="pronouns"/>
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