import { motion } from "framer-motion";
import "../../styles/SmallComp.scss";
import {user_LM, user_DM, addfriend_green, deletefriend} from "../../projectAssets";
import { useAuth } from '../../contexts/Authcontext';
import {acceptFriendRequest, deleteFriendRequest} from "../../contexts/AccessDB";
import { FunctionComponent } from 'react';

type RequestComponentProps = {
    uid: string,
    profile: string | null,
    darklight: string,
    username: string,
}

const RequestComponent : FunctionComponent<RequestComponentProps> = ({uid, profile, darklight, username}) => {
    const {userDB}: any = useAuth();

    function acceptRequest(){
        const infoObj = {
            currentUser: userDB,
            friendId: uid
        };
        acceptFriendRequest(infoObj);
    }

    function deleteRequest(){
        const infoObj = {
            currentUser: userDB,
            friendId: uid
        };
        deleteFriendRequest(infoObj);
    }

    return(
        <div className="request-message">
            <div className="user-img">
                { 
                    (
                    () => {
                            if(profile !== null && profile !== "null")
                            {
                                return <img src={profile} alt="user-profile" className="icon" referrerPolicy="no-referrer"/>;
                            }
                            else
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
            <h2>{username}</h2>
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

export default RequestComponent