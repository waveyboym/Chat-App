import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import TextField from '@mui/material/TextField';
import { motion } from "framer-motion";
import {leave_room, addfriend_LM, addfriend_DM, sendmsg_LM, sendmsg_DM,
    room_LM, room_DM, user_LM, user_DM, emoji_DM, emoji_LM} from "../projectAssets";
import {MessageBubbleRoom} from './sub_components';
import "../styles/Room.scss";
import {useRef, useEffect, useState} from "react";
import { useAuth } from '../contexts/Authcontext';
import { doc, collection, query, orderBy, onSnapshot, limit, getDoc} from "firebase/firestore";
import { db } from "../firebase";
import { handleSendingRoomMessage, sendFriendRequestTo, handleLeaveRoom } from "../contexts/AccessDB";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import useLocalStorage from 'use-local-storage';

const variants = {
    open: { opacity: 1, y: "0px"},
    closed: {  opacity: 0, y: "600px"},
}

const RoomMember = (props) => {
    const {userDB} = useAuth();

    const sendFriendRequest = async() => {
        if(userDB.uid === props.id)return;
        const obj = {
            currentUser: userDB,
            friendId: props.id
        };

        const message = await sendFriendRequestTo(obj);
    }

    return(
        <>
            {
                props.inroom ?
                <motion.div className="room-member" whileHover={{scale: 1.03}}>
                    <Tooltip title={props.username} placement="left" TransitionComponent={Zoom}>
                        <div className="member-icon">
                            { 
                                (
                                () => {
                                        if(props.profile !== null)
                                        {
                                            return <img src={props.profile} alt="profile" referrerPolicy="no-referrer"/>;
                                        }
                                        else if(props.profile === null)
                                        {
                                            if(props.theme === 'light')
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
                    </Tooltip>
                    <h2>{props.username}</h2>
                    { userDB.uid !== props.id ?
                        (<motion.div className="nav-icon" whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.97}} onClick={sendFriendRequest}>
                            { props.theme === 'light'? <img src={addfriend_LM} alt="pronouns"/>
                            : <img src={addfriend_DM} alt="pronouns"/>}
                        </motion.div>)
                        :
                        (<div className="nav-icon"></div>)
                    }
                    
                </motion.div>
                : 
                <div></div>
            }
        </>
        
    );
}

const Room = (props) => {

    const [roomdetails, setroomDetails] = useState({});
    const [RoommessagesList, setmessagesList] = useState([]);
    const [onloadComplete, setonloadComplete] = useState(false);
    const [value, setValue] = useState('');
    const [RoomMembers, setRoomMembers] = useState([]);
    const [membersArrSize, setmembersArrSize] = useState(0);

    const defaultBG = "#14161F";
    const [chatbackgroundcol, setbackgroundcol] = useLocalStorage('chatBackgroundcol', defaultBG);
    const [chatbackgroundimg, setchatbackgroundimg] = useLocalStorage('chatbackgroundimg', null);

    const ref = useRef();
    const {userDB} = useAuth();
    const [emojipickerchngr, set_emojipickerchngr] = useState(false);

    function showEmojiPicker(){set_emojipickerchngr(!emojipickerchngr);}

    function appendThisEmoji(emojiData){setValue(value + emojiData.native);}

    function handlechange(e){setValue(e.target.value);}

    const leaveRoom = async() => {
        const obj = {
            currentUser: userDB,
            roomID: props.roomRequestID
        };
        await handleLeaveRoom(obj);
        props.set_accessHome();
    }

    function sendMessage(){
        if(value === "")return;
        const obj = {
            user: userDB,
            roomID: roomdetails.id,
            message: value,
        };
    
        handleSendingRoomMessage(obj).then(() =>{}).catch((_error) => {});
        
        setValue("");
    }

    const getAllRoomMembers = async(roomRef) => {
        const unsub = onSnapshot(collection(roomRef, "members"), (memberquery) => {
            setRoomMembers([]);
            setmembersArrSize(memberquery.size);
            memberquery.forEach(async(docdata) => {
                const memberRef = doc(db, "users", docdata.id);
                const memberdocSnap = await getDoc(memberRef);
                setRoomMembers(oldMembersarr => [...oldMembersarr, {
                    id: memberdocSnap.data().uid,
                    username: memberdocSnap.data().username,
                    profile: memberdocSnap.data().displayPhoto,
                    inRoom: docdata.data().inRoom
                }]);
            })
        });

        return () =>{unsub();}
    }

    useEffect(() => {ref.current?.scrollIntoView({ behavior: "smooth"});}, [RoommessagesList])

    useEffect(() => {
        const initMessagesData = async() => {
            if(onloadComplete === false)return;
            if(RoomMembers.length === 0)return;
            if(RoomMembers.length !== membersArrSize)return;

            const roomRef = doc(db, "rooms", props.roomRequestID);
            const q = query(collection(roomRef, "roommessages"), orderBy("timestamp", "asc"), limit(25));
            const unsub = onSnapshot(q, (querySnapshot) => {
                setmessagesList([]);
                querySnapshot.forEach((currentdoc) => {
                    //dont make a call instead check in room members array for anyone with matching uid
                    const memberObj = RoomMembers.find(obj => {return obj.id === currentdoc.data().senderID});
                    setmessagesList(oldarray => [...oldarray, {
                        msgID: currentdoc.id,
                        id: currentdoc.data().senderID,
                        profile: memberObj.profile,
                        name: memberObj.username,
                        latest_msg: currentdoc.data().messageSent,
                        date_sent: currentdoc.data().timestamp
                        }]);
                })
            })

            return () =>{unsub();}
        }

        (onloadComplete === true) && (RoomMembers.length > 0) && (RoomMembers.length === membersArrSize) ? 
            initMessagesData() 
            : 
            () => {};
    }, [RoomMembers, onloadComplete])

    useEffect(() => {
        const initRoomData = async() => {
            //init basic room data
            setonloadComplete(false)
            const roomRef = doc(db, "rooms", props.roomRequestID);

            const roomdocSnap = await getDoc(roomRef);
            if(roomdocSnap.exists() !== true)return;
            setroomDetails({
                            id: props.roomRequestID, 
                            profile: roomdocSnap.data().displayPhoto, 
                            roomName: roomdocSnap.data().roomname,
                            });
            //load room members
            getAllRoomMembers(roomRef).then(() => {
                setonloadComplete(true);
            }).catch((_error) => {});
        }

        props.roomRequestID ? initRoomData() : () => {};
    }, [])

    return (
        <div className="Room-section">
            <div className="messages-box">
                <div className="top-bar-blur">
                    <div className="friends-icon">
                    { 
                        (
                        () => {
                                if(roomdetails.profile !== null)
                                {
                                    return <img className="icon" src={roomdetails.profile} referrerPolicy="no-referrer"/>;
                                }
                                else if(roomdetails.profile === null)
                                {
                                    if(props.setTheme === 'light')
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
                <h1>{roomdetails.roomName}</h1>
                </div>
                <div className="text-messages-box-room">
                    <div className="text-messages-container-plain-room">
                        {chatbackgroundimg ? (<div className='background-img-container-room'>
                            <img src={chatbackgroundimg} alt="background-img" className="background-img-room"/>
                        </div>) : (<div className='background-img-container-room' style={{background: chatbackgroundcol}}></div>)}
                        <div className="chat-bg-layer-room" style={chatbackgroundimg ? {background: "transparent"} : {}}>
                            <div className="chat-aligner-room"></div>
                            <h3 className="chat-messages-begin-room">This is the beginning of all conversations in this room</h3>
                            {RoommessagesList.map((obj) =>
                                <MessageBubbleRoom
                                key={"roomMessage" + obj.msgID}
                                id={obj.id}
                                userProfile={obj.profile} 
                                userName={obj.name} 
                                message={obj.latest_msg} 
                                timesent={obj.date_sent}
                                signedInUserID={userDB.uid}
                                theme={props.setTheme}
                                />)}
                            <div ref={ref} className="chat-aligner-plus-room"></div>
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
                        <Tooltip title={"send this message"} placement="top" TransitionComponent={Zoom}>
                            <motion.div className="nav-icon" whileHover={{ opacity: 0.8 }} whileTap={{scale: 0.97}}
                                onClick={sendMessage}>
                                { props.setTheme === 'light'? <img src={sendmsg_LM} alt="send message"/>
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
                <h1>Room</h1>
                <div className="room-controls">
                    <h2>ID: {roomdetails.id}</h2>
                    <motion.div className="leave-room-btn" whileHover={{ opacity: 0.8 }} whileTap={{scale: 0.97}} onClick={leaveRoom}>
                        <h3>Leave Room</h3>
                        <div className="leave-room-icon">
                            <img src={leave_room} alt="leave-room"/>
                        </div>
                    </motion.div>
                </div>
                <div className="members-section">
                    <h1>Members</h1>
                    {RoomMembers.map((obj) =>
                        <RoomMember 
                            key={"roomMember" + obj.id} 
                            id={obj.id} profile={obj.profile} 
                            username={obj.username} 
                            inroom={obj.inRoom}
                            theme={props.setTheme}/>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Room