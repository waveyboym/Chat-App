import React, {useContext, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { loginResultsForm, loginResults__ExtProv } from "./FormHandler";

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userDB, setUserDB] = useState(null);
    const [UserUID, setUserUID] = useState(null);
    const [isLoading, set_Loading] = useState(false);
    const navigate = useNavigate();

    function setLoadingTrue(){set_Loading(true);}

    function setLoadingFalse(){set_Loading(false);}

    function SET__UserDB(){
        const unsub = onSnapshot(doc(db, "users", user.uid), (res) => { if(res.exists())setUserDB(res.data())});

        return () =>{unsub();}
    }

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async(loggeduser) => {
            set_Loading(true);
            setUser(loggeduser);
            if (user){ 
                navigateToCorrectProvider(user);
                SET__UserDB();
                setUserUID(user.uid);
                navigate("/chat");
                set_Loading(false);
            }
            else {
                navigate("/");/* User is signed out*/
                set_Loading(false);
            }
        })

        return () =>{unsub();}
    }, [user, navigate]);

    return (
        <AuthContext.Provider value={{user, UserUID, userDB, isLoading,setLoadingTrue, setLoadingFalse}}>
            {children}
        </AuthContext.Provider>
    )
}

function navigateToCorrectProvider(userobj){
    if(userobj.providerData === null || userobj.providerData[0] === null)return;
    
    if(userobj.providerData[0].providerId === "google.com")loginResults__ExtProv("google");
    else if(userobj.providerData[0].providerId === "facebook.com")loginResults__ExtProv("facebook");
    else if(userobj.providerData[0].providerId === "twitter.com")loginResults__ExtProv("twitter");
    else if(userobj.providerData[0].providerId === "github.com")loginResults__ExtProv("github");
    else if(userobj.providerData[0].providerId === "password") loginResultsForm();
}

/*EmailAuthProviderID: password
PhoneAuthProviderID: phone
GoogleAuthProviderID: google.com
FacebookAuthProviderID: facebook.com
TwitterAuthProviderID: twitter.com
GitHubAuthProviderID: github.com
AppleAuthProviderID: apple.com
YahooAuthProviderID: yahoo.com
MicrosoftAuthProviderID: hotmail.com*/