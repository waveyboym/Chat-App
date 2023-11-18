import "../styles/SmallComp.scss";
import { addfriend_green } from "../projectAssets";
import { motion } from "framer-motion";
import { useState } from 'react';
import { useAuth } from '../contexts/Authcontext';
import { sendFriendRequestTo } from "../contexts/AccessDB";
import { authProviderType } from "../types";
import { DocumentData } from "firebase/firestore";

const AddFriend = () => {

  const [form, setform] = useState<{userID: string}>({userID: ''});
  const [err, setErr] = useState<boolean>(false);
  const [sentR, setsentR] = useState<boolean>(false);
  const [errMsg, seterrMsg] = useState<string>("");

  const {userDB}: authProviderType = useAuth();

  function handleChange(e: any){setform({ ... form, [e.target.name] : e.target.value});}

  function sendRequest(){
    setErr(false);
    setsentR(false);
    if(form.userID === ""){
      console.log(form);
      seterrMsg("friend id cannot be empty");
      setErr(true);
      return;
    }

    const infoObj: {
      currentUser: DocumentData | null,
      friendId: string
    } = {
      currentUser: userDB,
      friendId: form.userID
    };

    sendFriendRequestTo(infoObj).then((message) => {
      if(message === "SUCCESS"){
        setsentR(true);
        return;
      }
      else{
        seterrMsg(message);
        setErr(true);
        return;
      } 
    }).catch((error) => {
      seterrMsg(error);
      setErr(true);
      return;
    });
  }

  return (
    <div className="Addfriend-section">
      <div className="top-bar-blur"><h1>Add friend</h1></div>
      <div className="add-friend-section">
        <h2>Enter your friends User ID here</h2>
        <input name="userID" type="text" onChange={handleChange}/>
        <p>Example of a User ID: {userDB!.uid}</p>
        <motion.div className="send-request-btn" whileHover={{opacity: 0.9}} whileTap={{scale: 0.97}} onClick={sendRequest}>
          <h3>Send Request</h3>
          <img src={addfriend_green} alt="send-request"/>
        </motion.div>
        {err && (<h4>{errMsg}</h4>)}
        { sentR && (<h5>sent request</h5>)}
      </div>
    </div>
  )
}

export default AddFriend