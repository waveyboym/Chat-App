import {useState, FunctionComponent} from 'react';
import "../../styles/Login.scss";
import { githubsvg, googlesvg} from "../../projectAssets";
import { motion } from "framer-motion";
import { createNewUser, googleprovider, githubprovider } from "../../contexts/FormHandler";
import { UserCredential, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from '../../contexts/Authcontext';
import { authProviderType } from '../../types';

const startSignUpState = {
    emailaddress: '',
    password: '',
    username: ''
}

type SignupformProps = {callback_LoginForm: () => void;}

const Signupform : FunctionComponent<SignupformProps> = ({callback_LoginForm}) => {
    const [form, setform] = useState<{emailaddress: string, password: string, username: string}>(startSignUpState);
    const [err, setErr] = useState<boolean>(false);
    const [error_msg, setError_msg] = useState<string>("");
    const {setLoadingTrue, setLoadingFalse}: authProviderType = useAuth();

    function handleChange(e: any){setform({ ... form, [e.target.name] : e.target.value});}

    function handleSubmit(e: any){
        e.preventDefault();
        setLoadingTrue();
        setErr(false);
        const message: string = createNewUser(form);
        setLoadingFalse();
        if(message === "SUCCESS")return;
        setLoadingFalse();
        setErr(true);
        setError_msg(message);
    }

    async function signUpProviders(providername: string){
        setLoadingTrue();
        if(providername === "google"){
            const result: UserCredential = await signInWithPopup(auth, googleprovider);
            console.log(result);
        }
        else if(providername === "github"){
            signInWithPopup(auth, githubprovider);
        }
    }

    return (
        <div className="signup-section">
            <h1>SIGN-UP</h1>
            <form onSubmit={handleSubmit}>
                <div className="login-form-object">
                    <h3>Your email</h3>
                    <input name="emailaddress" type="text" onChange={handleChange} required/>
                </div>
                <div className="login-form-object">
                    <h3>Your password</h3>
                    <input name="password" type="password" onChange={handleChange} required/>
                </div>
                <div className="login-form-object">
                    <h3>Your username</h3>
                    <input name="username" type="text" onChange={handleChange} required/>
                </div>
                <motion.button type="submit" name="submit" whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.97 }}>
                    Sign Up
                </motion.button>
            </form>
            <motion.h4 whileTap={{ scale: 0.97 }} whileHover={{ opacity: 0.8 }} onClick={callback_LoginForm}>
                Already have an account? Click here
            </motion.h4>
            <h5>OR</h5>
            <div className="external-auth-buttons">
                <motion.div className="auth-button" whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.97 }}
                onClick={() => { signUpProviders("google");}}>
                    <img src={googlesvg} alt="google" className="google-icon-g" />
                    <h2>Google Sign Up</h2>
                </motion.div>
                <motion.div className="auth-button" whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.97 }}
                onClick={() => { signUpProviders("github");}}>
                    <img src={githubsvg} alt="github" className="github-icon-g" />
                    <h2>Github Sign Up</h2>
                </motion.div>
            </div>
            {err && (<h6 className="error-display">{error_msg}</h6>)}
        </div>
    );
};

export default Signupform