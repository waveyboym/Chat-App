import "../styles/ConstContent.scss";
import { ContactCard, ContactCardRoom } from "./sub_components";
import {openRoomArrow_LM, openRoomArrow_DM} from "../projectAssets";
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/Authcontext';
import { doc, collection, query, orderBy, onSnapshot, limit, getDocs, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";

const variants = {
  open: { height: "175px", overflowY: "scroll" },
  closed: {  height: "61px", overflowY: "hidden" },
}

const MsgNavBar = (props) => {

  //const [isSearching, set_isSearching] = useState(false);
  //const {user} = useAuth();
  //const searchobj = null;
  const {UserUID} = useAuth();
  const [openRoomNav, setOpenRoomNav] = useState(false);

  const [Contactslist, setContactslist] = useState([]);
  const [contactlistlength, set_contactlistlength] = useState(0);
  const [roomlist, setroomlist] = useState([]);
  const [selectedID, setselectedID] = useState("");

  const createContactObj = async(Messagesref, IdToGet) =>{
      const privMessageRef = query(collection(Messagesref, "privatemessages"), orderBy("timestamp", "desc"), limit(1));
      const lastSentMessage = await getDocs(privMessageRef);
      const friendUserRef = doc(db, "users", IdToGet);
      const res = await getDoc(friendUserRef);
      const contactObj = Contactslist.find(obj => {return obj.id === IdToGet});
      if(contactObj != undefined)Contactslist([]);

      const LSM_obj = {
        id: IdToGet,
        profile: res.data().displayPhoto,
        name: res.data().username,
        latest_msg: lastSentMessage.empty ? "" : lastSentMessage.docs[0]._document.data.value.mapValue.fields.messageSent.stringValue,
        already_read: true,//make functionality later
      };
      setContactslist(oldArray => [...oldArray, LSM_obj]);
  }

  function handleSearch(){
    //set_isSearching(true);
   // searchobj = msgobjarr.map((obj) => );
  }

  function changeSelectedIdTo(idtoset){setselectedID(idtoset); props.set_accessMsg(idtoset);}

  function reselectSelectedMsg(){
    let msgToSelect = document.getElementById(selectedID);
    let oldSelecteed = document.querySelector(".selected-contact-msg");

    if(msgToSelect != null){
      msgToSelect.classList.add("selected-contact-msg");
    }

    if(oldSelecteed != null){
      oldSelecteed.classList.remove("selected-contact-msg");
    }
  }

  useEffect(() => {
    //reselect previously selected item
    //check that all contacts have been loaded by checking length of contactslist array
    if(Contactslist.length !== contactlistlength)return;
    if(props.currently_accessed_state === "privmessages")reselectSelectedMsg();
  }, [Contactslist])

  useEffect(() => {
    const getAllRooms = async() => {
      const userRef = doc(db, "users", UserUID);
      const unsub = onSnapshot(collection(userRef, "rooms"), (roomquery) => {
        setroomlist([]);
        roomquery.forEach(async(roomdoc) => {
          const roomref = doc(db,"rooms", roomdoc.id);
          const roomdata = await getDoc(roomref);
          if(roomdata.exists()){
            setroomlist(oldArray => [...oldArray, {
              id: roomdata.id,
              profile: roomdata.data().displayPhoto,
              name: roomdata.data().roomname,
            }]);
          }
        });
      });

      return () =>{unsub();}
    }

    UserUID ?  getAllRooms() : () => {}
  }, [UserUID])

  useEffect(() => {
    const getAllContacts = async() => {
        const userRef = doc(db, "users", UserUID);
        const q = query(collection(userRef, "friends"), orderBy("timestamp", "desc"), limit(25));

        const unsub = onSnapshot(q, (querySnapshot) => {
          set_contactlistlength(querySnapshot.size);
          setContactslist([]);
          if(Contactslist.length != 0)setContactslist([]);

          querySnapshot.forEach(async(currentdoc) => {
            if(currentdoc.data().messageHolder === true){
              //go and find ref with message and push to array from this user
              const messagesRef = doc(userRef, "messages", currentdoc.data().friendID);
              await createContactObj(messagesRef, currentdoc.data().friendID);
            }
            else{
              //go to friend ref with message and push to array from them
              const friendRef = doc(db, "users", currentdoc.data().friendID);
              const messagesRef = doc(friendRef, "messages", UserUID);
              await createContactObj(messagesRef, currentdoc.data().friendID);
            }
          })
        })

        return () =>{unsub();}
    }
    
    UserUID ?  getAllContacts() : () => {}
  }, [UserUID])

  return (
    <div className="MsgNavBar-navbar" data-theme={props.setTheme}>
      <div className="constant-msg-header">
        <div className="h1-container"><h1>Messages</h1></div>
        <input name="searchbox" type="text" onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search for a user"/>
      </div>
      <div className="contacts">
        {Contactslist.map((contactobj) => 
            <ContactCard 
              key={contactobj.id}
              setid={contactobj.id}
              setProfile={contactobj.profile} 
              setName={contactobj.name} 
              setLtstMsg={contactobj.latest_msg} 
              setRead={contactobj.already_read}
              setMsgTab={changeSelectedIdTo}
              darkTheme={props.setTheme}
              />
          )}
      </div>
      <motion.div className="room-nav-container"
        animate={openRoomNav ? "open" : "closed"}
        variants={variants}
      >
        {roomlist.map((rooms) =>
          <ContactCardRoom 
            key={"room" + rooms.id}
            setid={rooms.id}
            setProfile={rooms.profile}
            setName={rooms.name}
            setMsgTab={props.set_accessRoom}
            darkTheme={props.setTheme}
          />
        )}
        {
          props.setTheme === 'light' ? 
          <motion.img className="openarrow" src={openRoomArrow_LM} alt="openarrow"
            onClick={() => setOpenRoomNav(!openRoomNav)}
            animate={{rotate: openRoomNav ? 180 : 0}}
            whileTap={{scale: 0.97}}
          />
          : 
          <motion.img className="openarrow" src={openRoomArrow_DM} alt="openarrow"
            onClick={() => setOpenRoomNav(!openRoomNav)}
            animate={{rotate: openRoomNav ? 180 : 0}}
            whileTap={{scale: 0.97}}
          /> 
        }
      </motion.div>
    </div>
  )
}

export default MsgNavBar