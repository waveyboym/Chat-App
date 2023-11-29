import {useContext, useState, useEffect, createContext} from "react";
import { useNavigate } from "react-router-dom";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { loginResultsForm, loginResults__ExtProv } from "./FormHandler";
import { authProviderType } from "../types";
import { goOffline, goOnline } from "./AccessDB";

const AuthContext = createContext<authProviderType>({user: null, UserUID: null, userDB: null, isLoading: false, setLoadingTrue: () => {}, setLoadingFalse: () => {}});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<null | User>(null);
    const [userDB, setUserDB] = useState<null | DocumentData>(null);
    const [UserUID, setUserUID] = useState<string | null>(null);
    const [isLoading, set_Loading] = useState(false);
    const navigate = useNavigate();

    function setLoadingTrue(){set_Loading(true);}

    function setLoadingFalse(){set_Loading(false);}

    function SET__UserDB(){
        if(user){
            const unsub = onSnapshot(doc(db, "users", user.uid), (res) => { if(res.exists())setUserDB(res.data())});

            return () =>{unsub();}
        }
        else return () =>{} 
    }

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async(loggeduser) => {
            set_Loading(true);
            setUser(loggeduser);
            if (user){ 
                const res: boolean = navigateToCorrectProvider(user);
                if(res === true){
                    SET__UserDB();
                    setUserUID(user.uid);
                    navigate("/chat");
                    set_Loading(false);
                }
                else{
                    set_Loading(false);
                }
                goOnline();
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

function navigateToCorrectProvider(userobj: any): boolean{
    if(userobj.providerData === null || userobj.providerData[0] === null)return false;
    
    if(userobj.providerData[0].providerId === "google.com")loginResults__ExtProv("google");
    else if(userobj.providerData[0].providerId === "github.com")loginResults__ExtProv("github");
    else if(userobj.providerData[0].providerId === "password") loginResultsForm();
    else return false;

    return true;
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