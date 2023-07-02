import "../styles/ConstContent.scss";
import {Messages, Settings, AddFriend, JoinRoom, Requests, SMNavbar, MsgNavBar, Room, Home, FriendList} from "../components";
import { useState, FunctionComponent } from 'react';
import { useAuth } from "../contexts/Authcontext";
import { Circles } from  'react-loader-spinner';

type HomeProps = {curr_Theme: string, darklight: string, changeTheme: (arg: string) => void;}

const Chats : FunctionComponent<HomeProps> = ({curr_Theme, darklight, changeTheme}) => {
  const [current_state, set_current_state] = useState<string>("home");
  const [messageAccess, set_messageAccess] = useState<string>("");
  const {isLoading}: any = useAuth();

  function unselectMsg(){
    let oldSelecteed = document.querySelector(".selected-contact-msg");
    if(oldSelecteed != null)oldSelecteed.classList.remove("selected-contact-msg");
  }

  function accessHome(){set_current_state("home"); unselectMsg();}

  function accessPrivMsg(Uid: string){set_messageAccess(Uid); set_current_state("home"); set_current_state("privmessages");}

  function accessRoom(Uid: string){set_messageAccess(Uid); set_current_state("home"); set_current_state("room");}

  function accessStngs(){set_current_state("settings"); unselectMsg();}

  function accessAddfrnd(){set_current_state("addfriend"); unselectMsg();}

  function accessJnrm(){set_current_state("joinroom"); unselectMsg();}

  function accessRqsts(){set_current_state("requests"); unselectMsg();}

  function accessFriendList(){set_current_state("friendlist"); unselectMsg();}

  return (
    <div className="all-content" data-theme={curr_Theme}>
      <div className="constant-top-navbar"></div>
      <div className="Chat-App-Main-Content">
          <div className="constant-side-navbar">
              <SMNavbar darklight={darklight}
                set_accessfrndList={accessFriendList}
                set_accessStngs={accessStngs}
                set_accessAddfrnd={accessAddfrnd}
                set_accessJnrm={accessJnrm}
                set_accessRqsts={accessRqsts}
                currently_accessed_state={current_state}
              />
              <MsgNavBar setTheme={curr_Theme}
              darklight={darklight} 
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
                    return <Messages darklight={darklight} msgRequestID={messageAccess} set_accessHome={accessHome}/>
                  case "room":
                    return <Room darklight={darklight} roomRequestID={messageAccess} set_accessHome={accessHome}/>
                  case "settings":
                    return <Settings darklight={darklight} changeTheme={changeTheme}/>
                  case "addfriend":
                    return <AddFriend/>
                  case "joinroom":
                    return <JoinRoom set_accessRoom={accessRoom}/>
                  case "requests":
                    return <Requests darklight={darklight}/>
                  case "friendlist":
                    return <FriendList darklight={darklight}/>
                  default:
                    return <Home setTheme={curr_Theme}/>
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