import {useState} from 'react';
import "../../styles/Login.scss";
import { emailopened } from "../../projectAssets";
import { motion } from "framer-motion";
import { sentResetpswdEmail} from "../../contexts/FormHandler";
import { useAuth } from "../../contexts/Authcontext";
const startResetpwdState = {email: ''}

const Resetpswd = (props) => {
    const [form, setform] = useState(startResetpwdState);
    const [err, setErr] = useState(false);
    const [error_msg, setError_msg] = useState("");
    const {setLoadingTrue, setLoadingFalse} = useAuth();

    function handleChange(e){setform({ ... form, [e.target.name] : e.target.value});}

    function handleSubmit(e){
        e.preventDefault();
        setLoadingTrue();
        setErr(false);
        const message = sentResetpswdEmail(form);
        if(message === "invalid email"){
            setErr(true);
            setError_msg(message);
            setLoadingFalse();
        }
        else{
            setLoadingFalse();
            message
            .then(() => { props.callback_ResetConfirm();})
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setErr(true);
                setError_msg(errorCode + " : " + errorMessage);
            })
        }
    }

    return(
        <div className="reset-pswd-section">
            <h1>Forgot Password</h1>
            <img src={emailopened} alt="email-opened" className="email-opened-g" />
            <form onSubmit={handleSubmit}>
                <div className="login-form-object">
                    <h3>Your email</h3>
                    <input name="email" type="text" onChange={handleChange} required/>
                </div>
                <motion.button type="submit" name="submit" whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.97 }}>
                    Send Reset Email
                </motion.button>
            </form>
            <motion.h4 onClick={props.callback_LoginForm} whileTap={{ scale: 0.97 }} whileHover={{ opacity: 0.8 }}>
                Actually, I remembered my password
            </motion.h4>
            {err && (<h6 className="error-display">{error_msg}</h6>)}
        </div>
    );
};

export default Resetpswd