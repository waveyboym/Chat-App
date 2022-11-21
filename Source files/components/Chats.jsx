import "../styles/ConstContent.scss";
import Messages from './Messages';
import Settings from './Settings';
import AddFriend from './AddFriend';
import JoinRoom from './JoinRoom';
import Requests from './Requests';
import SMNavbar from './SMNavbar';
import MsgNavBar from './MsgNavBar';
import Room from "./Room";
import { useState } from 'react';
import { chatapplogo_IA } from "../projectAssets";
import { useAuth } from "../contexts/Authcontext";
import { Circles } from  'react-loader-spinner';

const Home = (props) => {
  return (
    <div className="blank-page" data-theme={props.setTheme}>
      <h1>Hello, Welcome to Fiddle Chat App</h1>
      <img className="icon" src={chatapplogo_IA}/>
    </div>
  )
}

function Chats(props) {
  const [current_state, set_current_state] = useState("home");
  const [messageAccess, set_messageAccess] = useState("");
  const {isLoading} = useAuth();

  function unselectMsg(){
    let oldSelecteed = document.querySelector(".selected-contact-msg");
    if(oldSelecteed != null)oldSelecteed.classList.remove("selected-contact-msg");
  }

  function accessHome(){set_current_state("home"); unselectMsg();}

  function accessPrivMsg(Uid){set_messageAccess(Uid); set_current_state("home"); set_current_state("privmessages");}

  function accessRoom(Uid){set_messageAccess(Uid); set_current_state("home"); set_current_state("room");}

  function accessStngs(){set_current_state("settings"); unselectMsg();}

  function accessAddfrnd(){set_current_state("addfriend"); unselectMsg();}

  function accessJnrm(){set_current_state("joinroom"); unselectMsg();}

  function accessRqsts(){set_current_state("requests"); unselectMsg();}

  return (
    <div className="all-content" data-theme={props.curr_Theme}>
      <div className="constant-top-navbar"></div>
      <div className="Chat-App-Main-Content">
          <div className="constant-side-navbar">
              <SMNavbar setTheme={props.curr_Theme} SwitchUserThemes={props.changeTheme}
                set_accessStngs={accessStngs}
                set_accessAddfrnd={accessAddfrnd}
                set_accessJnrm={accessJnrm}
                set_accessRqsts={accessRqsts}
                currently_accessed_state={current_state}
              />
              <MsgNavBar setTheme={props.curr_Theme} 
              set_accessMsg={accessPrivMsg} 
              set_accessRoom={accessRoom}
              currently_accessed_state={current_state}
              />
          </div>
          {
            (
              () => {
                switch(current_state){
                  case "privmessages":
                    return <Messages setTheme={props.curr_Theme} msgRequestID={messageAccess} set_accessHome={accessHome}/>
                  case "room":
                    return <Room setTheme={props.curr_Theme} roomRequestID={messageAccess} set_accessHome={accessHome}/>
                  case "settings":
                    return <Settings setTheme={props.curr_Theme}/>
                  case "addfriend":
                    return <AddFriend setTheme={props.curr_Theme}/>
                  case "joinroom":
                    return <JoinRoom setTheme={props.curr_Theme} set_accessRoom={accessRoom}/>
                  case "requests":
                    return <Requests setTheme={props.curr_Theme}/>
                  default:
                    return <Home setTheme={props.curr_Theme}/>
                }
              }
            )()
          }
      </div>
      {isLoading && (<div className="loading-content-page">
                        <h1>loading content...</h1>
                        <Circles
                            height="80"
                            width="80"
                            color="#E6E6E6"
                            ariaLabel="circles-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                            />
                    </div>)}
    </div>
  )
}

export default Chats