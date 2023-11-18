import {useState} from 'react';
import "../styles/Login.scss";
import { app_banner_small, app_logo_small, social_friendsvg, blob} from "../projectAssets";
import {Signupform, Loginform, Resetpswd, ResetpswdConfirm} from "../components/sub_components";
import { useAuth } from "../contexts/Authcontext";
import {  MutatingDots } from  'react-loader-spinner';
import { authProviderType } from '../types';

export default function Login() {
    const [currentPage, setPage] = useState<string>("signup");
    const {isLoading}: authProviderType = useAuth();

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
                                <p>please note, if you cancelled your login, this loader may still show for a couple of seconds. This is a limitation from firebase itself</p>
                                <MutatingDots 
                                    height="100"
                                    width="100"
                                    color="#E6E6E6"
                                    secondaryColor= "#E6E6E6"
                                    radius='12.5'
                                    ariaLabel="mutating-dots-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                />
                            </div>)}
        </div>
    )
}