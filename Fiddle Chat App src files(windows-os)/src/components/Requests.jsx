import {addfriend_green, deletefriend} from "../projectAssets";
import { motion } from "framer-motion";
import "../styles/SmallComp.scss";
import {user_LM, user_DM} from "../projectAssets";
import { useAuth } from '../contexts/Authcontext';
import {acceptFriendRequest, deleteFriendRequest} from "../contexts/AccessDB";
import { doc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from 'react';

const RequestComponent = (props) => {

    const {userDB} = useAuth();

    function acceptRequest(){
        const infoObj = {
            currentUser: userDB,
            friendId: props.uid
        };
        acceptFriendRequest(infoObj);
    }

    function deleteRequest(){
        const infoObj = {
            currentUser: userDB,
            friendId: props.uid
        };
        deleteFriendRequest(infoObj);
    }

    return(
        <div className="request-message">
            <div className="user-img">
                { 
                    (
                    () => {
                            if(props.profile !== null && props.profile !== "null")
                            {
                                return <img src={props.profile} alt="user-profile" className="icon" referrerPolicy="no-referrer"/>;
                            }
                            else
                            {
                                if(props.Theme === 'light')
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
            <h2>{props.username}</h2>
            <motion.div className="accept-request" onClick={acceptRequest}>
                <img src={addfriend_green} alt="accept-request" />
                <h3>accept</h3>
            </motion.div>
            <motion.div className="delete-request" onClick={deleteRequest}>
                <img src={deletefriend} alt="delete-request" />
                <h3>reject</h3>
            </motion.div>
        </div>
    )
}

const Requests = (props) => {

    const {userDB} = useAuth();

    const [Requestslist, setRequestslist] = useState([]);
    
    useEffect(() => {
        const getAllRequests = async() => {
            const userRef = doc(db, "users", userDB.uid);
            const q = query(collection(userRef, "requests"), orderBy("timestamp", "desc"));

            const unsub = onSnapshot(q, (querySnapshot) => {setRequestslist(querySnapshot.docs);})

            return () =>{unsub();}
        }
        
        userDB.uid && getAllRequests()
    }, [])

    return (
        <div className="requests-section">
            <div className="top-bar-blur"><h1>Requests</h1></div>
            <div className="requests">
                <div className="filler-div"></div>
                {Requestslist.map((requestobj) => 
                    <RequestComponent 
                        key={requestobj._document.data.value.mapValue.fields.uid.stringValue} 
                        uid={requestobj._document.data.value.mapValue.fields.uid.stringValue} 
                        profile={requestobj._document.data.value.mapValue.fields.profile.nullValue === null ? null :
                            requestobj._document.data.value.mapValue.fields.profile.stringValue} 
                        username={requestobj._document.data.value.mapValue.fields.username.stringValue}
                        Theme={props.setTheme}
                    />
                )}
            </div>
        </div>
    )
}

export default Requests