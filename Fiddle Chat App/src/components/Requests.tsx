import "../styles/SmallComp.scss";
import { useAuth } from '../contexts/Authcontext';
import { doc, collection, query, orderBy, onSnapshot, DocumentData, DocumentReference, Query, Unsubscribe } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState, FunctionComponent } from 'react';
import { RequestComponent } from "./sub_components";

type RequestsProps = {darklight: string,}

const Requests : FunctionComponent<RequestsProps> = ({darklight}) => {

    const {userDB}: any = useAuth();

    const [Requestslist, setRequestslist] = useState<any[]>([]);//don't modify any type
    
    useEffect(() => {
        const getAllRequests = async() => {
            const userRef: DocumentReference<DocumentData> = doc(db, "users", userDB.uid);
            const q: Query<DocumentData> = query(collection(userRef, "requests"), orderBy("timestamp", "desc"));

            const unsub: Unsubscribe = onSnapshot(q, (querySnapshot) => {setRequestslist(querySnapshot.docs);})

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
                        darklight={darklight}
                    />
                )}
            </div>
        </div>
    )
}

export default Requests