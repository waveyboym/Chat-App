import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import TextField from '@mui/material/TextField';
import { motion } from "framer-motion";
import {leave_room, sendmsg_LM, sendmsg_DM,
    room_LM, room_DM, user_LM, user_DM, emoji_DM, emoji_LM} from "../projectAssets";
import {MessageBubbleRoom, RoomMember} from './sub_components';
import "../styles/Room.scss";
import {useRef, useEffect, useState, FunctionComponent} from "react";
import { useAuth } from '../contexts/Authcontext';
import { doc, collection, query, orderBy, onSnapshot, limit, getDoc, DocumentReference, DocumentData, Unsubscribe, DocumentSnapshot, Query, QueryDocumentSnapshot} from "firebase/firestore";
import { db } from "../firebase";
import { handleSendingRoomMessage, handleLeaveRoom } from "../contexts/AccessDB";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import useLocalStorage from 'use-local-storage';
import { authProviderType } from '../types';

const variants = {
    open: { opacity: 1, y: "0px"},
    closed: {  opacity: 0, y: "600px"},
}

type RoomProps = {
    darklight: string,
    roomRequestID: string,
    set_accessHome: () => void;
}

const Room : FunctionComponent<RoomProps> = ({darklight, roomRequestID, set_accessHome}) => {

    const [roomdetails, setroomDetails] = useState<{id: string, profile: string | null, roomName: string}>({id: "", profile: "", roomName: ""});
    const [RoommessagesList, setmessagesList] = useState<{msgID: string, id: string, profile: string | null, name: string, latest_msg: string, date_sent: string}[]>([]);
    const onloadComplete = useRef<boolean>(false);
    const [value, setValue] = useState<string>('');
    const [RoomMembers, setRoomMembers] = useState<{
        id: string,
        username: string,
        profile: string,
        inRoom: boolean
    }[]>([]);
    const membersArrSize = useRef<number>(0);

    const defaultBG: string = "#14161F";
    const [chatbackgroundcol, setbackgroundcol] = useLocalStorage<string>('chatBackgroundcol', defaultBG);
    const [chatbackgroundimg, setchatbackgroundimg] = useLocalStorage<any>('chatbackgroundimg', null);//don't change any type because of FileReader ArrayBuffer

    const ref = useRef<null | HTMLDivElement>(null);
    const contactsLoaded = useRef<boolean>(false);
    const messagesLoaded = useRef<boolean>(false);
    const {userDB}: authProviderType = useAuth();
    const [emojipickerchngr, set_emojipickerchngr] = useState<boolean>(false);

    function showEmojiPicker(){set_emojipickerchngr(!emojipickerchngr);}

    function appendThisEmoji(emojiData: any){setValue(value + emojiData.native);}

    function handlechange(e: any){setValue(e.target.value);}

    const leaveRoom = async() => {
        const obj: {currentUser: any,roomID: string} = 
            {
                currentUser: userDB,
                roomID: roomRequestID
            };
        await handleLeaveRoom(obj);
        set_accessHome();
    }

    function sendMessage(){
        if(value === "")return;
        const obj: {user: any, roomID: string, message: string} = 
            {
                user: userDB,
                roomID: roomdetails.id,
                message: value,
            };
    
        handleSendingRoomMessage(obj).then(() =>{}).catch((_error) => {});
        
        setValue("");
    }

    const getAllRoomMembers = async(roomRef: DocumentReference<DocumentData>): Promise<() => void> => {
        setRoomMembers([]);
        const unsub: Unsubscribe = onSnapshot(collection(roomRef, "members"), (memberquery) => {
            membersArrSize.current = memberquery.size;
            memberquery.forEach(async(docdata) => {
                const memberRef: DocumentReference<DocumentData> = doc(db, "users", docdata.id);
                const memberdocSnap: DocumentSnapshot<DocumentData> = await getDoc(memberRef);
                setRoomMembers(oldMembersarr => [...oldMembersarr, {
                    id: memberdocSnap.data()?.uid,
                    username: memberdocSnap.data()?.username,
                    profile: memberdocSnap.data()?.displayPhoto,
                    inRoom: docdata.data()?.inRoom
                }]);
            })
        });

        return () =>{unsub();}
    }

    useEffect(() => {ref.current?.scrollIntoView({ behavior: "smooth"});}, [RoommessagesList])

    useEffect(() => {
        const initMessagesData = async(): Promise<() => void> => {
            if(onloadComplete.current === false)return () => {};
            if(RoomMembers.length === 0)return () => {};
            if(RoomMembers.length !== membersArrSize.current)return () => {};

            if(messagesLoaded.current === true)return () => {};
            messagesLoaded.current = true;
            
            const roomRef: DocumentReference<DocumentData> = doc(db, "rooms", roomRequestID);
            const q: Query<DocumentData> = query(collection(roomRef, "roommessages"), orderBy("timestamp", "asc"), limit(25));
            const unsub: Unsubscribe = onSnapshot(q, (querySnapshot) => {
                setmessagesList([]);
                querySnapshot.forEach((currentdoc: QueryDocumentSnapshot<DocumentData>) => {
                    //dont make a call instead check in room members array for anyone with matching uid
                    const memberObj = RoomMembers.find(obj => {return obj.id === currentdoc.data().senderID});
                    if(memberObj !== undefined){
                        setmessagesList(oldarray => [...oldarray, {
                            msgID: currentdoc.id,
                            id: currentdoc.data().senderID,
                            profile: memberObj.profile,
                            name: memberObj.username,
                            latest_msg: currentdoc.data().messageSent,
                            date_sent: currentdoc.data().timestamp
                            }]);
                        }
                })
            })

            return () =>{unsub();}
        }

        (onloadComplete.current === true) && (RoomMembers.length === membersArrSize.current) ? 
            initMessagesData() 
            : 
            () => {};
    }, [RoomMembers, onloadComplete])

    useEffect(() => {
        const initRoomData = async() => {
            if(contactsLoaded.current === true && onloadComplete.current === false)return;
            contactsLoaded.current = true;
            messagesLoaded.current = false;
            //init basic room data
            const roomRef = doc(db, "rooms", roomRequestID);
            setroomDetails({id: roomRequestID, profile: null, roomName: ""});
            const roomdocSnap = await getDoc(roomRef);
            if(roomdocSnap.exists() !== true)return;
            setroomDetails({
                            id: roomRequestID, 
                            profile: roomdocSnap.data()?.displayPhoto, 
                            roomName: roomdocSnap.data()?.roomname,
                            });
            //load room members
            getAllRoomMembers(roomRef).then(() => onloadComplete.current = true).catch((_error) => {});
        }

        roomRequestID ? initRoomData() : () => {};
    }, [roomRequestID])

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
                                signedInUserID={userDB!.uid}
                                darklight={darklight}
                                />)}
                            <div ref={ref} className="chat-aligner-plus-room"></div>
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
                        <Tooltip title={"send this message"} placement="top" TransitionComponent={Zoom}>
                            <motion.div className="nav-icon" whileHover={{ opacity: 0.8 }} whileTap={{scale: 0.97}}
                                onClick={sendMessage}>
                                { darklight === 'light'? <img src={sendmsg_LM} alt="send message"/>
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
                            darklight={darklight}/>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Room