import {useState, FunctionComponent} from 'react';
import "../../styles/Login.scss";
import { githubsvg, googlesvg} from "../../projectAssets";
import { motion } from "framer-motion";
import { regTestSignIn, signInUser, googleprovider, githubprovider} from "../../contexts/FormHandler";
import { UserCredential, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from '../../contexts/Authcontext';
import { authProviderType } from '../../types';

const startLoginState = {
    password: '',
    emailaddress: ''
}

type LoginformProps = {callback_resetpwd: () => void; callback_SignUpForm: () => void;}

const Loginform : FunctionComponent<LoginformProps> = ({callback_resetpwd, callback_SignUpForm}) => {
    const [form, setform] = useState<{password: string, emailaddress: string}>(startLoginState);
    const [err, setErr] = useState<boolean>(false);
    const [error_msg, setError_msg] = useState<string>("");
    const {setLoadingTrue, setLoadingFalse}: authProviderType = useAuth();

    function handleChange(e: any){setform({ ... form, [e.target.name] : e.target.value});}

    function handleSubmit(e: any){
        e.preventDefault();
        setLoadingTrue();
        setErr(false);
        const message: string = regTestSignIn(form);
        if(message !== "SUCCESS"){
            setErr(true);
            setError_msg(message);
            setLoadingFalse();
        }
        else {
            signInUser(form).then((_userCredential) => {})
            .catch((error) => {
                setLoadingFalse();
                const errorCode: any = error.code;
                const errorMessage: any = error.message;
                setErr(true);
                setError_msg(errorCode + " : " + errorMessage);
            });
        }
    }

    async function loginProviders(providername: string){
        setLoadingTrue();
        try{
            if(providername === "google"){
                const result: UserCredential = await signInWithPopup(auth, googleprovider);
                console.log(result);
            }
            else if(providername === "github"){
                const result: UserCredential = await signInWithPopup(auth, githubprovider);
                console.log(result);
            }
        }
        catch(e){
            setLoadingFalse();
            const result = (e as Error).message;
            if(result !== "Firebase: Error (auth/popup-closed-by-user)."){
                setErr(true);
                setError_msg(result);
            }
        }
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
            <motion.h4 whileTap={{ scale: 0.97 }} whileHover={{ opacity: 0.8 }} onClick={callback_resetpwd}>
                forgot your password?Click here
            </motion.h4>
            <motion.h4 whileTap={{ scale: 0.97 }} whileHover={{ opacity: 0.8 }} onClick={callback_SignUpForm}>
                Don't have an account? Click here
            </motion.h4>
            <h5>OR</h5>
            <div className="external-auth-buttons">
                <motion.div className="auth-button" whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.97 }}
                onClick={() => { loginProviders("google");}}>
                    <img src={googlesvg} alt="google" className="google-icon-g" />
                    <h2>Google Login</h2>
                </motion.div>
                <motion.div className="auth-button" whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.97 }}
                onClick={() => { loginProviders("github");}}>
                    <img src={githubsvg} alt="github" className="github-icon-g" />
                    <h2>Github Login</h2>
                </motion.div>
            </div>
            {err && (<h6 className="error-display">{error_msg}</h6>)}
        </div>
    );
};

export default Loginform