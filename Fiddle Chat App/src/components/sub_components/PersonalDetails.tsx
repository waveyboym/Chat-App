import "../../styles/Settings.scss";
import { save, logout, deleteprofile, google_small, twitter_small, facebook_small, github_small,
  eyeclosed_DM, eyeopened_DM, eyeclosed_LM, eyeopened_LM, user_LM, user_DM} from "../../projectAssets";
import { motion } from "framer-motion";
import { useState, FunctionComponent } from 'react';
import { useAuth } from '../../contexts/Authcontext';
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { changePersonalDetails, deleteAccount } from "../../contexts/AccessDB";

type PersonalDetailsProps = {darklight: string}

const PersonalDetails : FunctionComponent<PersonalDetailsProps> = ({darklight}) => {

  const {userDB, setLoadingTrue}: any = useAuth();

  const [form, setform] = useState<{
    profile: string | null,
    uid: string,
    username: string,
    password: string;
    email: string,
    dob: string,
    pronouns: string,
    position: string
}>({
    profile: userDB.displayPhoto,
    uid: userDB.uid,
    username: userDB.username,
    password: '',
    email: userDB.email,
    dob: userDB.dateOfBirth,
    pronouns: userDB.pronouns,
    position: userDB.position,
  });

  const [showpassword, set_showpassword] = useState<boolean>(false);

  const [confirmDelete, set_ConfirmDelete] = useState<boolean>(false);

  const [err, setErr] = useState<boolean>(false);
  const [error_msg, setError_msg] = useState<string>("");

  function handleChange(e: any){setform({ ... form, [e.target.name] : e.target.value});}

  function uploadImg(e: any){setform({ ... form, [e.target.name] : e.target.files[0]});}

  function submitChanges(){
    setErr(false); 
    const obj: {
      oldData: any,
      newData: {
        profile: any,
        uid: string,
        username: string,
        password: string;
        email: string,
        dob: string,
        pronouns: string,
        position: string
    }} = 
    {
      oldData: userDB,
      newData: form
    };
    changePersonalDetails(obj).then((message: string) => {
      if(message === "SUCCESS")return;
      else{
        setError_msg(message);
        setErr(true);
      }
    }).catch((error: any) => {
      console.log(error);
    });
  }

  function signOutOfApp(){
    setLoadingTrue();
    
    signOut(auth);
  }

  function calldeleteAccount() {deleteAccount();}

  return (
    <div className="personal-details">
      <div className="top-bar-blur"><h1>Personal Details</h1></div>
      <div className="personal-details-box">
        <div className="users-profile-img-changer">
          <div className="user-profile-img">
            { 
              (
              () => {
                      if(userDB.displayPhoto !== null)
                      {
                          return <img src={userDB.displayPhoto} alt="icon" className="icon" referrerPolicy="no-referrer"/>;
                      }
                      else if(userDB.displayPhoto === null)
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
          <motion.label className="upload-btn-container" whileTap={{scale: 0.97}}>
            <input name="profile" type="file" accept="image/png, image/jpeg" onChange={uploadImg}/>
            upload profile
          </motion.label>
        </div>
        <Tooltip title="You cannot modify your User ID" placement="top" TransitionComponent={Zoom} followCursor>
            <div className="pd-form-object">
                <h3>User ID (friend requests)</h3>
                <input name="uid" type="text" value={form.uid} disabled style={{ pointerEvents: 'auto' }}/>
            </div>
        </Tooltip>
        <div className="pd-form-object">
            <h3>Username</h3>
            <input name="username" type="text" onChange={handleChange} value={form.username}/>
        </div>
        { userDB.loginmethod === "form" ?
            <div className="pd-form-object">
                <h3>Password</h3>
                <input name="password" 
                  type={showpassword ? "text" : "password"}
                  onChange={handleChange} 
                  value={form.password}
                  placeholder="type in a password"
                  />
                { showpassword ?
                  <motion.div whileHover={{ opacity: 0.8 }} whileTap={{scale: 0.97}}
                  onClick={() => set_showpassword(false)} className="password-control">
                    { darklight === 'light'? <img src={eyeopened_LM} alt="show-password"/>
                      : <img src={eyeopened_DM} alt="show-password"/>}
                  </motion.div>
                  :
                  <motion.div whileHover={{ opacity: 0.8 }} whileTap={{scale: 0.97}}
                  onClick={() => set_showpassword(true)} className="password-control">
                    { darklight === 'light'? <img src={eyeclosed_LM} alt="hide-password"/>
                      : <img src={eyeclosed_DM} alt="hide-password"/>}
                  </motion.div>
                }
            </div>
          : <Tooltip title="This option is not available" placement="top" TransitionComponent={Zoom} followCursor>
              <div className="pd-form-object">
                    <h3>Password</h3>
                    <input name="password" 
                      type="text"
                      value={form.password}
                      disabled 
                      style={{ pointerEvents: 'none' }}
                      />
            </div>
          </Tooltip>
        }
        { userDB.loginmethod === "form" ?
          <div className="pd-form-object">
              <h3>Email</h3>
              <input name="email" type="text" onChange={handleChange} value={form.email} />
          </div>
          :
          <Tooltip title="This option is not available" placement="top" TransitionComponent={Zoom} followCursor>
            <div className="pd-form-object">
              <h3>Email</h3>
              <input name="email" type="text" value={form.email} disabled style={{ pointerEvents: 'none' }}/>
            </div>
          </Tooltip>
        }
        
        <div className="pd-div-flexbox">
            <div className="pd-form-object">
              <h3>Date of birth</h3>
              <input name="dob" type="text" onChange={handleChange} value={form.dob}/>
            </div>
            <div className="pd-form-object">
              <h3>Pronouns</h3>
              <input name="pronouns" type="text" onChange={handleChange} value={form.pronouns}/>
            </div>
        </div>
        <div className="pd-form-object">
            <h3>Position</h3>
            <input name="position" type="text" onChange={handleChange} value={form.position}/>
        </div>
        <div className="controls">
          <motion.div className="save-changes" whileTap={{scale: 0.97}} whileHover={{opacity: 0.9}}
          onClick={submitChanges}>
            <h2>Save Changes</h2>
            <img src={save} alt="save-changes"/>
          </motion.div>
          { userDB.loginmethod === "google" ?
              <motion.div className="google-logout" whileTap={{scale: 0.97}} whileHover={{opacity: 0.9}}
                onClick={signOutOfApp}>
                <h2>Google Log Out</h2>
                <img src={google_small} alt="google"/>
              </motion.div>
            : userDB.loginmethod === "facebook" ?
              <motion.div className="facebook-logout" whileTap={{scale: 0.97}} whileHover={{opacity: 0.9}}
              onClick={signOutOfApp}>
                <h2>Facebook Log Out</h2>
                <img src={facebook_small} alt="facebook"/>
              </motion.div>
            : userDB.loginmethod === "twitter" ?
              <motion.div className="twitter-logout" whileTap={{scale: 0.97}} whileHover={{opacity: 0.9}}
              onClick={signOutOfApp}>
                <h2>Twitter Log Out</h2>
                <img src={twitter_small} alt="twitter"/>
              </motion.div>
            : userDB.loginmethod === "github" ?
              <motion.div className="github-logout" whileTap={{scale: 0.97}} whileHover={{opacity: 0.9}}
              onClick={signOutOfApp}>
                <h2>Github Log Out</h2>
                <img src={github_small} alt="github"/>
              </motion.div>
            : <motion.div className="logout" whileTap={{scale: 0.97}} whileHover={{opacity: 0.9}}
              onClick={signOutOfApp}>
                <h2>Log Out</h2>
                <img src={logout} alt="logout"/>
              </motion.div>
          }
          <motion.div className="delete-account" whileTap={{scale: 0.97}} whileHover={{opacity: 0.9}}
          onClick={() => set_ConfirmDelete(true)}>
            <h2>Delete Account</h2>
            <img src={deleteprofile} alt="delete-account"/>
          </motion.div>
        </div>
        {err && (<h6 className="error-display">{error_msg}</h6>)}
      </div>
      {confirmDelete && 
      <div className="delete-account-dialogue">
        <div className="delete-box">
          <h1>Confirm Account Deletion</h1>
          <p>Note that this action is unreversible. All of your data will be deleted, including your messages, friends etc</p>
          <div className="delete-confirm">
            <motion.div className="confirm-delete" onClick={calldeleteAccount} whileTap={{scale: 0.97}}>
              yes, delete my account
            </motion.div>
            <motion.div className="abort-delete" onClick={() => set_ConfirmDelete(false)}  whileTap={{scale: 0.97}}>
              no, take me back
            </motion.div>
          </div>
        </div>
      </div>}
    </div>
  )
}

export default PersonalDetails