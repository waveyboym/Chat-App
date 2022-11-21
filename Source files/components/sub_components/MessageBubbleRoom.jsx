import "../../styles/Room.scss";
import {user_LM, user_DM} from "../../projectAssets";

/**<ReactTimeAgo date={props.timesent.toDate()} locale="en-US"/> */

const MessageBubbleRoom = (props) => {
    return (
            <div>
                {
                    props.id === props.signedInUserID ? 
                    <div className="right-message-bubble">
                        <div className="message-bubble sent-msg">
                            <p>{props.message}</p>
                        </div>
                        <div className="user-info-dlg">
                            <div className="friends-icon">
                                { 
                                    (
                                    () => {
                                            if(props.userProfile !== null)
                                            {
                                                return <img className="icon" src={props.userProfile} alt="icon" referrerPolicy="no-referrer"/>;
                                            }
                                            else 
                                            {
                                                if(props.theme === 'light')
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
                            <h2>{props.userName}</h2>
                        </div>
                    </div>
                    :
                    <div className="left-message-bubble">
                        <div className="user-info-dlg">
                            <div className="friends-icon">
                                { 
                                    
                                    (
                                    () => {
                                            if(props.userProfile !== null)
                                            {
                                                return <img className="icon" src={props.userProfile} alt="icon" referrerPolicy="no-referrer"/>;
                                            }
                                            else
                                            {
                                                if(props.theme === 'light')
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
                            <h2>{props.userName}</h2>
                        </div>
                        <div className="message-bubble received-msg">
                            <p>{props.message}</p>
                        </div>
                    </div>
                }
            </div>
    )
}

export default MessageBubbleRoom