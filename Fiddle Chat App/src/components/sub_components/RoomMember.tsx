import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { motion } from "framer-motion";
import {addfriend_LM, addfriend_DM, user_LM, user_DM} from "../../projectAssets";
import "../../styles/Room.scss";
import {FunctionComponent} from "react";
import { useAuth } from '../../contexts/Authcontext';
import { sendFriendRequestTo } from "../../contexts/AccessDB";
import { authProviderType } from '../../types';

type RoomMemberProps = {
    id: string, 
    inroom: boolean, 
    profile: string | null, 
    darklight: string,
    username: string,
}

const RoomMember : FunctionComponent<RoomMemberProps> = ({id, inroom, profile, darklight, username}) => {
    const {userDB}: authProviderType = useAuth();

    const sendFriendRequest = async() => {
        if(userDB!.uid === id)return;
        const obj = {
            currentUser: userDB,
            friendId: id
        };

        const message = await sendFriendRequestTo(obj);
    }

    return(
        <>
            {
                inroom ?
                <motion.div className="room-member" whileHover={{scale: 1.03}}>
                    <Tooltip title={username} placement="left" TransitionComponent={Zoom}>
                        <div className="member-icon">
                            { 
                                (
                                () => {
                                        if(profile !== null)
                                        {
                                            return <img src={profile} alt="profile" referrerPolicy="no-referrer"/>;
                                        }
                                        else if(profile === null)
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
                    </Tooltip>
                    <h2>{username}</h2>
                    { userDB!.uid !== id ?
                        (<motion.div className="nav-icon" whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.97}} onClick={sendFriendRequest}>
                            {darklight === 'light'? <img src={addfriend_LM} alt="pronouns"/>
                            : <img src={addfriend_DM} alt="pronouns"/>}
                        </motion.div>)
                        :
                        (<div className="nav-icon"></div>)
                    }
                    
                </motion.div>
                : 
                <div></div>
            }
        </>
        
    );
}

export default RoomMember