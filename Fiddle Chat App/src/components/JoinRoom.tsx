import {join_room, create_room} from "../projectAssets";
import { motion } from "framer-motion";
import { useState, FunctionComponent } from 'react';
import "../styles/SmallComp.scss";
import { useAuth } from '../contexts/Authcontext';
import { handleJoinRoom, handleCreateRoom } from "../contexts/AccessDB";

type JoinRoomProps = {set_accessRoom: (arg: string) => void;}

const JoinRoom : FunctionComponent<JoinRoomProps> = ({set_accessRoom}) => {
  const [form, setform] = useState<{roomID: string}>({roomID: ''});
  const [roomName, setRoomName] = useState<{roomName: string}>({roomName: ''});
  const [err, setErr] = useState<boolean>(false);
  const [errMsg, seterrMsg] = useState<string>("");
  const {userDB}: any = useAuth();

  function handleChange(e: any){setform({ ... form, [e.target.name] : e.target.value});}

  function handleRoomName(e: any){setRoomName({ ... roomName, [e.target.name] : e.target.value});}

  function changeSelectedMsg(uid: string){
    let msgToSelect = document.getElementById("room" + uid);
    let oldSelecteed = document.querySelector(".selected-contact-msg");

    if(msgToSelect != null){
      msgToSelect.classList.add("selected-contact-msg");
    }

    if(oldSelecteed != null){
      oldSelecteed.classList.remove("selected-contact-msg");
    }

    set_accessRoom(uid);
  }

  function joinRoom(){
    setErr(false);
    if(form.roomID === ""){
      seterrMsg("The room Id cannot be empty");
      setErr(true);
      return;
    }
    const obj = {roomID: form.roomID, user: userDB}

    handleJoinRoom(obj).then((message) => {
      if(message === form.roomID){
        //select room component in msgnavbar.jsx
        //open room chat
        changeSelectedMsg(message);
      }
      else{
        seterrMsg(message);
        setErr(true);
      }
    })
    .catch((error) => {
      seterrMsg(error);
      setErr(true);
    });
  }

  function createRoom(){
    setErr(false);
    if(roomName.roomName === ""){
      seterrMsg("The room name cannot be empty");
      setErr(true);
      return;
    }
    const obj = {roomname: roomName.roomName, user: userDB}

    handleCreateRoom(obj).then((theNewRoomsId) => {
      //select room component in msgnavbar.jsx
      //open room chat
      changeSelectedMsg(theNewRoomsId);
    })
    .catch((error) => {
      seterrMsg(error);
      setErr(true);
    });
  }

  return (
    <div className="JoinRoom-section">
      <div className="top-bar-blur"><h1>Join Room</h1></div>
      <div className="join-room-section">
        <h2>Enter RoomID here</h2>
        <input name="roomID" type="text" onChange={handleChange}/>
        <p>room ID can be obtained from room members</p>
        <motion.div className="send-request-btn" whileHover={{opacity: 0.9}} whileTap={{scale: 0.97}} onClick={joinRoom}>
          <h3>Join Room</h3>
          <img src={join_room} alt="join-room"/>
        </motion.div>

        <h1>OR</h1>

        <h2>create a new room by entering a custom name</h2>
        <input name="roomName" type="text" onChange={handleRoomName}/>
        <p>room name can be named anything</p>
        <motion.div className="send-request-btn" whileHover={{opacity: 0.9}} whileTap={{scale: 0.97}} onClick={createRoom}>
          <h3>Create Room</h3>
          <img src={create_room} alt="create-room"/>
        </motion.div>
        {err && (<h4>{errMsg}</h4>)}
      </div>
    </div>
  )
}

export default JoinRoom