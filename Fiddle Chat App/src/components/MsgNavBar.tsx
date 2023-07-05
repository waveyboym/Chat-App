import "../styles/ConstContent.scss";
import { ContactCard, ContactCardRoom } from "./sub_components";
import {openRoomArrow_LM, openRoomArrow_DM, cross_DM, cross_LM} from "../projectAssets";
import { useEffect, useState, useRef, FunctionComponent } from 'react';
import { useAuth } from '../contexts/Authcontext';
import { doc, collection, query, orderBy, onSnapshot, limit, getDocs, getDoc, DocumentReference, DocumentData, Query, QuerySnapshot, DocumentSnapshot, Unsubscribe, where } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";

const variants = {
  open: { height: "calc(100vh - 145px)", },//change this value to "calc(100vh - 105px)" when using OS title bar otherwise "calc(100vh - 145px)"
  closed: {  height: "61px", }, 
}

type MsgNavBarProps = {
  setTheme: string, 
  darklight: string, 
  currently_accessed_state: string, 
  set_accessMsg: (arg: string) => void; 
  set_accessRoom: (arg: string) => void;
}

const MsgNavBar : FunctionComponent<MsgNavBarProps> = ({setTheme, darklight, currently_accessed_state, set_accessMsg, set_accessRoom}) => {

  const [isSearching, set_isSearching] = useState<boolean>(false);
  const {UserUID}: any = useAuth();
  const [openRoomNav, setOpenRoomNav] = useState<boolean>(false);
  const contactsLoaded = useRef<boolean>(false);
  const roomsLoaded = useRef<boolean>(false);

  const [Contactslist, setContactslist] = useState<{
      id: string,
      profile: string | null,
      name: string,
      latest_msg: string,
      already_read: boolean,//make functionality later
    }[]>([]);
  const [contactlistlength, set_contactlistlength] = useState<number>(0);
  const [roomlist, setroomlist] = useState<{
      id: string,
      profile: string | null,
      name: string
  }[]>([]);
  const [selectedID, setselectedID] = useState<string>("");
  const [searchText, setsearchText] = useState<string>("");

  const createContactObj = async(Messagesref: DocumentReference<DocumentData>, IdToGet: string) =>{
    const contactObj = Contactslist.find(obj => {return obj.id === IdToGet});
    if(contactObj !== undefined)return;  
    
    const privMessageRef: Query<DocumentData> = query(collection(Messagesref, "privatemessages"), orderBy("timestamp", "desc"), limit(1));
    const lastSentMessage: any = await getDocs(privMessageRef);
    const friendUserRef: DocumentReference<DocumentData> = doc(db, "users", IdToGet);
    const res: DocumentSnapshot<DocumentData> = await getDoc(friendUserRef);
    
    const LSM_obj = {
      id: IdToGet,
      profile: res.data()?.displayPhoto,
      name: res.data()?.username,
      latest_msg: lastSentMessage.empty ? "" : lastSentMessage.docs[0]._document.data.value.mapValue.fields.messageSent.stringValue,
      already_read: true,//make functionality later
    };
    setContactslist(oldArray => [...oldArray, LSM_obj]);
  }


  function handleSearch(e: any){
    set_isSearching(true);
    if(e.key === "Enter"){
      if(openRoomNav)searchForRoom(searchText);
      else searchForContact(searchText);
    }
    else{setsearchText(e.target.value);}
  }

  const cancelSearch = async() =>{
    set_isSearching(false);
    setsearchText("");
    if(openRoomNav){
      const userRef: DocumentReference<DocumentData> = doc(db, "users", UserUID);
      const q: Query<DocumentData> = query(collection(userRef, "rooms"));

      setroomlist([]);
      const roomquery = await getDocs(q);
      if(roomlist.length != 0)setroomlist([]);
      setroomlist([]);
      roomquery.forEach(async(roomdoc) => {
        const roomref: DocumentReference<DocumentData> = doc(db,"rooms", roomdoc.id);
        const roomdata: DocumentSnapshot<DocumentData> = await getDoc(roomref);
        if(roomdata.exists()){
          setroomlist(oldArray => [...oldArray, {
            id: roomdata.id,
            profile: roomdata.data().displayPhoto,
            name: roomdata.data().roomname,
          }]);
        }
      });
    }
    else{
      const userRef: DocumentReference<DocumentData> = doc(db, "users", UserUID);
      const q: Query<DocumentData> = query(collection(userRef, "friends"), orderBy("timestamp", "desc"), limit(25));

      const querySnapshot = await getDocs(q);
      set_contactlistlength(querySnapshot.size);
      setContactslist([]);
      if(Contactslist.length != 0)setContactslist([]);

      querySnapshot.forEach(async(currentdoc) => {
        if(currentdoc.data().messageHolder === true){
          //go and find ref with message and push to array from this user
          const messagesRef: DocumentReference<DocumentData> = doc(userRef, "messages", currentdoc.data().friendID);
          await createContactObj(messagesRef, currentdoc.data().friendID);
        }
        else{
          //go to friend ref with message and push to array from them
          const friendRef: DocumentReference<DocumentData> = doc(db, "users", currentdoc.data().friendID);
          const messagesRef: DocumentReference<DocumentData> = doc(friendRef, "messages", UserUID);
          await createContactObj(messagesRef, currentdoc.data().friendID);
        }
      })
    }
  }

  function changeSelectedIdTo(idtoset: string){setselectedID(idtoset); set_accessMsg(idtoset);}

  function reselectSelectedMsg(){
    let msgToSelect: HTMLElement | null = document.getElementById(selectedID);
    let oldSelecteed: Element | null = document.querySelector(".selected-contact-msg");

    if(msgToSelect !== null)msgToSelect.classList.add("selected-contact-msg");
    if(oldSelecteed !== null)oldSelecteed.classList.remove("selected-contact-msg");
  }

  const getAllContacts = async() => {
      if(contactsLoaded.current === true)return;
      contactsLoaded.current = true;

      const userRef: DocumentReference<DocumentData> = doc(db, "users", UserUID);
      const q: Query<DocumentData> = query(collection(userRef, "friends"), orderBy("timestamp", "desc"), limit(25));

      const unsub: Unsubscribe = onSnapshot(q, (querySnapshot) => {
        set_contactlistlength(querySnapshot.size);
        setContactslist([]);
        if(Contactslist.length != 0)setContactslist([]);

        querySnapshot.forEach(async(currentdoc) => {
          if(currentdoc.data().messageHolder === true){
            //go and find ref with message and push to array from this user
            const messagesRef: DocumentReference<DocumentData> = doc(userRef, "messages", currentdoc.data().friendID);
            await createContactObj(messagesRef, currentdoc.data().friendID);
          }
          else{
            //go to friend ref with message and push to array from them
            const friendRef: DocumentReference<DocumentData> = doc(db, "users", currentdoc.data().friendID);
            const messagesRef: DocumentReference<DocumentData> = doc(friendRef, "messages", UserUID);
            await createContactObj(messagesRef, currentdoc.data().friendID);
          }
        })
      })

      return () =>{unsub();}
  }

  const searchForContact = async(arg: string) => {
    const q: Query<DocumentData> = query(collection(db, "users"), orderBy("timestamp", "desc"), where("username", "==", arg), limit(25));

    const querySnapshot = await getDocs(q);
    set_contactlistlength(querySnapshot.size);
    setContactslist([]);
    if(Contactslist.length != 0)setContactslist([]);
    querySnapshot.forEach(async(currentdoc) => {
      const LSM_obj = {
        id: currentdoc.data()?.uid,
        profile: currentdoc.data()?.displayPhoto,
        name: currentdoc.data()?.username,
        latest_msg: "",
        already_read: true,//make functionality later
      };
      setContactslist(oldArray => [...oldArray, LSM_obj]);
    });
  }

  const getAllRooms = async() => {
    if(roomsLoaded.current === true)return;
    roomsLoaded.current = true;

    const userRef: DocumentReference<DocumentData> = doc(db, "users", UserUID);
    const unsub: Unsubscribe = onSnapshot(collection(userRef, "rooms"), (roomquery) => {
      setroomlist([]);
      roomquery.forEach(async(roomdoc) => {
        const roomref: DocumentReference<DocumentData> = doc(db,"rooms", roomdoc.id);
        const roomdata: DocumentSnapshot<DocumentData> = await getDoc(roomref);
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

  const searchForRoom = async(arg: string) => {
    const q: Query<DocumentData> = query(collection(db, "rooms"), orderBy("timestamp", "desc"), where("roomname", "==", arg), limit(25));

    setroomlist([]);
    const querySnapshot = await getDocs(q);
    if(roomlist.length != 0)setroomlist([]);
    querySnapshot.forEach(async(currentdoc) => {
      setroomlist(oldArray => [...oldArray, {
        id: currentdoc.id,
        profile: currentdoc.data().displayPhoto,
        name: currentdoc.data().roomname,
      }]);
    });
  }

  useEffect(() => {
    /** WHY THIS useEffect EXISTS
     * 
     * firebase has a onSnapshot function that runs when there are changes made to the backend database
     * When changes are made "Contactslist" array is reset and set to new data
     * This function will reselect a contact if a contact was previously selected
     * 
     *  */    
    //reselect previously selected item
    //check that all contacts have been loaded by checking length of contactslist array
    if(Contactslist.length !== contactlistlength || contactsLoaded.current === false)return;
    if(currently_accessed_state === "privmessages")reselectSelectedMsg();
  }, [Contactslist])

  useEffect(() => {
    const loadsetup = async() => {
      await getAllContacts();
      await getAllRooms();
    }
    
    UserUID ? loadsetup() : () => {}
  }, [UserUID])

  return (
    <div className="MsgNavBar-navbar" data-theme={setTheme}>
      <div className="constant-msg-header">
        <div className="h1-container"><h1>{openRoomNav ? "Rooms" : "Messages"}</h1></div>
        <div className="search-bar">
          <input name="searchbox" type="text" onKeyDown={(e: any) => handleSearch(e)} placeholder={openRoomNav ? "Search for a room" : "Search for a user"}/>
          {
            darklight === 'light' && isSearching ? 
            <img className="cancel-search" src={cross_LM} alt="cancel-search" onClick={cancelSearch}/>
            : isSearching ?
            <img className="cancel-search" src={cross_DM} alt="cancel-search" onClick={cancelSearch}/> 
            : <></>
          }
        </div>
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
              darklight={darklight}
              />
          )}
      </div>
      <motion.div className="room-nav-container"
        animate={openRoomNav ? "open" : "closed"}
        variants={variants}
        style={{overflowY: openRoomNav ? "auto" : "hidden"}}
      >
        {roomlist.map((rooms) =>
          <ContactCardRoom 
            key={"room" + rooms.id}
            setid={rooms.id}
            setProfile={rooms.profile}
            setName={rooms.name}
            setMsgTab={set_accessRoom}
            darklight={darklight}
          />
        )}
        {
          darklight === 'light' ? 
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