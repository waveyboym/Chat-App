import {useState} from 'react';
import "../styles/Login.scss";
import { app_banner_small, app_logo_small, social_friendsvg, blob, emailsent} from "../projectAssets";
import { motion } from "framer-motion";
import {Signupform, Loginform, Resetpswd} from "./sub_components";
import { useAuth } from "../contexts/Authcontext";
import { Circles } from  'react-loader-spinner';

const ResetpswdConfirm = (props) => {
    return(
        <div className="reset-pswd-confirm-section">
            <h1>Forgot Password</h1>
            <img src={emailsent} alt="email-sent" className="email-sent-g" />
            <h3>An email has been sent with reset instructions</h3>
            <motion.div className="okbutton" onClick={props.callback_LoginForm} whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.97 }}>
                Ok
            </motion.div>
        </div>
    );
}

export default function Login() {
    const [currentPage, setPage] = useState("signup");
    const {isLoading} = useAuth();

    function changeToSignUpFrom(){setPage("signup");}

    function changeToLoginForm(){setPage("login");}

    function changeToResetPSWD(){setPage("reset");}

    function changeToResetConfirmation(){setPage("resetconfirm");}

    return (
        <div className="login-home">
            <div className="circle-1"></div>
            <div className="circle-2"></div>
            <div className="circle-3"></div>
            <div className="circle-4"></div>
            <div className="login-home-blurer">
                <div className="company-logo">
                    <img src={app_logo_small} alt="app_logo_small" className="app-logo-small-g" />
                    <img src={app_banner_small} alt="app_banner_small" className="app-banner-small-g" />
                </div>

                <div className="login-content">
                    <div className="login-display-graphic">
                        <img src={blob} alt="blob" className="blob-g" />
                        <img src={social_friendsvg} alt="social_friends" className="social-friends-g" />
                    </div>
                    {currentPage === "signup" ? <Signupform callback_LoginForm={changeToLoginForm}/>
                    : currentPage === "login" ? <Loginform callback_resetpwd={changeToResetPSWD} callback_SignUpForm={changeToSignUpFrom}/>
                    : currentPage === "reset" ? <Resetpswd callback_ResetConfirm={changeToResetConfirmation} callback_LoginForm={changeToLoginForm}/>
                    : <ResetpswdConfirm callback_LoginForm={changeToLoginForm}/>
                    }
                </div>
            </div>
            {isLoading && (<div className="loading-content-page">
                                <h1>getting everything ready for you...</h1>
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