import "../styles/SmallComp.scss";
import { useAuth } from '../contexts/Authcontext';
import { doc, collection, query, orderBy, onSnapshot, DocumentData, DocumentReference, Query, Unsubscribe, DocumentSnapshot, getDoc, } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState, useRef, FunctionComponent } from 'react';
import { FriendComponent } from "./sub_components";

type RequestsProps = {darklight: string,}

const FriendList : FunctionComponent<RequestsProps> = ({ darklight }) => {
    const {userDB}: any = useAuth();
    const friendsLoaded = useRef<boolean>(false);

    const [friendslist, setFriendslist] = useState<{id: string, username: string, profile: string | null}[]>([]);
    
    useEffect(() => {
        const getAllFriends = async() => {
            if(friendsLoaded.current === true)return;
            friendsLoaded.current = true;
            const userRef: DocumentReference<DocumentData> = doc(db, "users", userDB.uid);
            const q: Query<DocumentData> = query(collection(userRef, "friends"), orderBy("timestamp", "asc"));

            const unsub: Unsubscribe = onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach(async(docdata) => {
                    const friendRef: DocumentReference<DocumentData> = doc(db, "users", docdata.id);
                    const frienddocSnap: DocumentSnapshot<DocumentData> = await getDoc(friendRef);
                    setFriendslist(oldFriendsarr => [...oldFriendsarr, {
                        id: frienddocSnap.data()?.uid,
                        username: frienddocSnap.data()?.username,
                        profile: frienddocSnap.data()?.displayPhoto,
                    }]);
                })
            });
    
            return () =>{unsub();}
        }
        
        userDB.uid && getAllFriends()
    }, [])

    return (
        <div className="friends-section">
            <div className="top-bar-blur"><h1>Friends</h1></div>
            <div className="friends">
                <div className="filler-div"></div>
                {friendslist.map((friends) => 
                    <FriendComponent 
                        key={"FriendList" + friends.id} 
                        uid={friends.id} 
                        profile={friends.profile === null ? null : friends.profile} 
                        username={friends.username}
                        darklight={darklight}
                    />
                )}
            </div>
        </div>
    )
}

export default FriendList