import { motion } from "framer-motion";
import "../../styles/SmallComp.scss";
import {user_LM, user_DM, deletefriend} from "../../projectAssets";
import { useAuth } from '../../contexts/Authcontext';
import {handleDeleteFriend} from "../../contexts/AccessDB";
import { FunctionComponent } from 'react';
import { authProviderType } from "../../types";

type FriendComponentProps = {
    uid: string,
    profile: string | null,
    darklight: string,
    username: string,
    onlineStatus: boolean
}

const FriendComponent : FunctionComponent<FriendComponentProps> = ({uid, profile, darklight, username, onlineStatus}) => {
    const {userDB}: authProviderType = useAuth();

    function deleteFriend(){
        const infoObj = {
            currentUser: userDB,
            friendId: uid
        };
        handleDeleteFriend(infoObj);
    }

    return(
        <div className="friend-component">
            <div className={"user-img "  + (onlineStatus === true ? "is-online" : "is-offline")}>
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
            <motion.div className="delete-friend" onClick={deleteFriend}>
                <img src={deletefriend} alt="delete-request" />
                <h3>delete friend</h3>
            </motion.div>
        </div>
    )
}

export default FriendComponent