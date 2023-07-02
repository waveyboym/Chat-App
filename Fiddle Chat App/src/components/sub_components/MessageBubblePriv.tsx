import "../../styles/Messages.scss";
import {user_LM, user_DM} from "../../projectAssets";
import {FunctionComponent} from "react";

type MessageBubblePrivProps = {
    id: string, 
    signedInUserID: string, 
    message: string, 
    userProfile: string | null, 
    darklight: string,
    userName: string,
    timesent: string
}

const MessageBubblePriv : FunctionComponent<MessageBubblePrivProps> = ({id, signedInUserID, message, userProfile, darklight, userName, timesent}) => {
    return (
        <div>
            {
                id === signedInUserID ? 
                <div className="right-message-bubble">
                    <div className="message-bubble sent-msg">
                        <p>{message}</p>
                    </div>
                    <div className="user-info-dlg">
                        <div className="friends-icon">
                            { 
                                (
                                () => {
                                        if(userProfile !== null)
                                        {
                                            return <img className="icon" src={userProfile} alt="icon" referrerPolicy="no-referrer"/>;
                                        }
                                        else if(userProfile === null)
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
                        <h2>{userName}</h2>
                        
                    </div>
                </div>
                :
                <div className="left-message-bubble">
                    <div className="user-info-dlg">
                        <div className="friends-icon">
                            { 
                                (
                                () => {
                                        if(userProfile !== null)
                                        {
                                            return <img className="icon" src={userProfile} alt="icon" referrerPolicy="no-referrer" onError={() => console.log(userProfile)}/>;
                                        }
                                        else if(userProfile === null)
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
                        <h2>{userName}</h2>
                        
                    </div>
                    <div className="message-bubble received-msg">
                        <p>{message}</p>
                    </div>
                </div>
            }
        </div>
    )
}

export default MessageBubblePriv