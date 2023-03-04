import {useState} from 'react';
import "../../styles/Login.scss";
import { facebooksvg, githubsvg, googlesvg, twittersvg} from "../../projectAssets";
import { motion } from "framer-motion";
import { signInUser, googleprovider, facebookprovider, twitterprovider, githubprovider} from "../../contexts/FormHandler";
import { signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from '../../contexts/Authcontext';

const startLoginState = {
    password: '',
    emailaddress: ''
}

const Loginform = (props) => {
    const [form, setform] = useState(startLoginState);
    const [err, setErr] = useState(false);
    const [error_msg, setError_msg] = useState("");
    const {setLoadingTrue, setLoadingFalse} = useAuth();

    function handleChange(e){setform({ ... form, [e.target.name] : e.target.value});}

    function handleSubmit(e){
        e.preventDefault();
        setLoadingTrue();
        setErr(false);
        const message = signInUser(form);
        if(message === "" || message === ""){
            setErr(true);
            setError_msg(message);
            setLoadingFalse();
        }
        else {
            message.then((_userCredential) => {})
            .catch((error) => {
                setLoadingFalse();
                const errorCode = error.code;
                const errorMessage = error.message;
                setErr(true);
                setError_msg(errorCode + " : " + errorMessage);
            });
        }
    }

    function loginProviders(providername){
        setLoadingTrue();
        if(providername === "google")signInWithPopup(auth, googleprovider);
        else if(providername === "facebook")signInWithPopup(auth, facebookprovider);
        else if(providername === "twitter")signInWithPopup(auth, twitterprovider);
        else if(providername === "github")signInWithPopup(auth, githubprovider);
    }

    return(
        <div className="login-section">
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <div className="login-form-object">
                    <h3>Your email</h3>
                    <input name="emailaddress" type="text" onChange={handleChange} required/>
                </div>
                <div className="login-form-object">
                    <h3>Your password</h3>
                    <input name="password" type="password" onChange={handleChange} required/>
                </div>
                <motion.button type="submit" name="submit" whileHover={{ opacity: 0.8  }} whileTap={{ scale: 0.97 }}>
                    Sign In
                </motion.button>
            </form>
            <motion.h4 whileTap={{ scale: 0.97 }} whileHover={{ opacity: 0.8 }} onClick={props.callback_resetpwd}>
                forgot your password?Click here
            </motion.h4>
            <motion.h4 whileTap={{ scale: 0.97 }} whileHover={{ opacity: 0.8 }} onClick={props.callback_SignUpForm}>
                Don't have an account? Click here
            </motion.h4>
            <h5>OR</h5>
            <div className="external-auth-buttons">
                <motion.div className="auth-button" whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.97 }}
                onClick={() => { loginProviders("google");}}>
                    <img src={googlesvg} alt="google" className="google-icon-g" />
                    <h2>Google</h2>
                </motion.div>
                <motion.div className="auth-button" whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.97 }}
                onClick={() => { loginProviders("facebook");}}>
                    <img src={facebooksvg} alt="facebook" className="facebook-icon-g" />
                    <h2>Facebook</h2>
                </motion.div>
                <motion.div className="auth-button" whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.97 }}
                onClick={() => { loginProviders("twitter");}}>
                    <img src={twittersvg} alt="twitter" className="twitter-icon-g" />
                    <h2>Twitter</h2>
                </motion.div>
                <motion.div className="auth-button" whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.97 }}
                onClick={() => { loginProviders("github");}}>
                    <img src={githubsvg} alt="github" className="github-icon-g" />
                    <h2>Github</h2>
                </motion.div>
            </div>
            {err && (<h6 className="error-display">{error_msg}</h6>)}
        </div>
    );
};

export default Loginform