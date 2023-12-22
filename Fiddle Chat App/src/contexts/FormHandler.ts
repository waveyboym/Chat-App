import { auth, db } from "../firebase";
import { GoogleAuthProvider, createUserWithEmailAndPassword,
    signInWithEmailAndPassword, sendPasswordResetEmail, getRedirectResult,
    GithubAuthProvider, updateProfile, signInWithCredential, User } from "firebase/auth";
import { doc, setDoc, collection, query, where , getDocs} from "firebase/firestore";

import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/api/shell';
import { ResponseType, fetch } from "@tauri-apps/api/http";
import callbacktemplate from "./callbacktemplate";

const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const validPassword = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$');
const validusername = new RegExp('^(?=.*?[a-z]).{4,}$');
export const googleprovider = new GoogleAuthProvider();
export const githubprovider = new GithubAuthProvider();

export const createNewUser = (props: any) => {
    const emailclean = props.emailaddress;
    const passwordclean = props.password;
    const usernameclean = props.username;

    if (!emailclean.match(validEmail)) {
        return "invalid email";
    }
    if (!validPassword.test(passwordclean)) {
        return "password should have at least one lower and upper case letter, one number and be at least 8 characters long";
    }
    if (!validusername.test(usernameclean)) {
        return "username should have at least one lowercase letter and be at least 4 characters long";
    }

    createUserWithEmailAndPassword(auth, emailclean, passwordclean)
        .then((_userCredential) => {
            // Signed in thus return
            if(auth.currentUser){
                updateProfile(auth.currentUser, {displayName: usernameclean})
                    .then(() => { return "SUCCESS";})
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        //todo create a proper error handler
                        console.log( errorCode + " : " + errorMessage);
                    }); 
            }
            else{
                console.log( "Not logged in : ");
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            //todo create a proper error handler
            console.log( errorCode + " : " + errorMessage);
        });
    
    return "SUCCESS";
}

export const regTestSignIn = (props: {password: string, emailaddress: string}) => {
    const emailclean = props.emailaddress;
    const passwordclean = props.password;

    if (!emailclean.match(validEmail)) {
        return "invalid email";
    }
    if (!validPassword.test(passwordclean)) {
        return "password should have at least one lower and upper case letter, one number and be at least 8 characters long";
    }
    return "SUCCESS";
}

export const signInUser = (props: {password: string, emailaddress: string}) => {
    const emailclean = props.emailaddress;
    const passwordclean = props.password;
    return signInWithEmailAndPassword(auth, emailclean, passwordclean);
}

export const loginResults__ExtProv = async(userobj: User, providername: string): Promise<boolean> => {
    // The signed-in user info.
    const user = userobj;
    if(user === null)return false;
    
    const usersRef = query(collection(db, "users"), where("uid", "==", user.uid));
    const snapshot = await getDocs(usersRef);
    if(snapshot.docs.length !== 0)return true;

    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayPhoto: user.providerData[0].photoURL,
        username: user.providerData[0].displayName,
        email: user.providerData[0].email,
        dateOfBirth: "N/A",
        pronouns: "N/A",
        position: "N/A",
        loginmethod: providername,
        lastUpdate: new Date(),
        AccountActive: true,
        OnlineStatus: true
    });

    const userRef = doc(db, "users", user.uid);
    await setDoc(doc(userRef, "messages", user.uid), {});
    await setDoc(doc(userRef, "requests", user.uid), {});
    await setDoc(doc(userRef, "friends", user.uid), {});
    return true;
}

//This code belongs to this repo: https://github.com/igorjacauna/tauri-firebase-login
export const signInHandlerGoogle = () => {
    // Wait for callback from tauri oauth plugin
    listen('oauth://url', (data) => {
        googleSignIn(data.payload as string);
    });
    
    // Start tauri oauth plugin. When receive first request
    // When it starts, will return the server port
    // it will kill the server
    invoke('plugin:oauth|start', {
        config: {
        // Optional config, but use here to more friendly callback page
        response: callbacktemplate,
        },
    }).then((port) => {
        openGoogleSignIn(port as string);
    });
} 

export const signInHandlerGithub = () => {
    // Wait for callback from tauri oauth plugin
    listen('oauth://url', (data) => {
        requestGithubSignIn(data.payload as string);
    });
    
    // Start tauri oauth plugin. When receive first request
    // When it starts, will return the server port
    // it will kill the server
    invoke('plugin:oauth|start', {
        config: {
        // Optional config, but use here to more friendly callback page
        response: callbacktemplate,
        },
    }).then((port) => {
        openRequestGithubIdentity(port as string);
    });
}
//end of external code

export const loginResultsForm = async(): Promise<boolean> => {
    const user = auth.currentUser;
    if(user === null)return false;

    try {
        // The signed-in user info.
        const usersRef = query(collection(db, "users"), where("uid", "==", user.uid));
        const snapshot = await getDocs(usersRef);
        if(snapshot.docs.length !== 0)return true;

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,          
            displayPhoto: null,         
            username: user.displayName,      
            email: user.email,          
            dateOfBirth: "N/A",         
            pronouns: "N/A",            
            position: "N/A",            
            loginmethod: "form",
            lastUpdate: new Date(),
            AccountActive: true, 
            OnlineStatus: true
        });

        const userRef = doc(db, "users", user.uid);
        await setDoc(doc(userRef, "messages", user.uid), {});
        await setDoc(doc(userRef, "requests", user.uid), {});
        await setDoc(doc(userRef, "friends", user.uid), {});
    }
    catch(error: any) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " : " + errorMessage);
    };

    return true;
}

export const sendResetpswdEmail = (props: any) => {
    const emailclean = props.email;//purify.sanitize(

    if (!emailclean.match(validEmail)) return "invalid email";

    return sendPasswordResetEmail(auth, emailclean);
}




//This code belongs to this repo: https://github.com/igorjacauna/tauri-firebase-login
// deep link related functions
const openBrowserToConsentForGoogle = (port: string) => {
    // Replace CLIENT_ID_FROM_FIREBASE
    // Must allow localhost as redirect_uri for CLIENT_ID on GCP: https://console.cloud.google.com/apis/credentials
    return open('https://accounts.google.com/o/oauth2/auth?' +
        'response_type=token&' +
        `client_id=${import.meta.env.VITE_GOOGLECLIENTID}&` +
        `redirect_uri=http%3A//localhost:${port}&` +
        'scope=email%20profile%20openid&' +
        'prompt=consent'
    );
};

const openBrowserToConsentIdentityForGithub = (port: string) => {
    // Replace CLIENT ID FROM GITHUB
    // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
    return open('https://github.com/login/oauth/authorize?' +
        `client_id=${import.meta.env.VITE_GITHUBCLIENTID}&` +
        `redirect_uri=http://127.0.0.1:${port}`
    );
};



const openGoogleSignIn = (port: string) => {
    return new Promise((resolve, reject) => {
        openBrowserToConsentForGoogle(port).then(resolve).catch(reject);
    });
};

const openRequestGithubIdentity = (port: string) => {
    return new Promise((resolve, reject) => {
        openBrowserToConsentIdentityForGithub(port).then(resolve).catch(reject);
    });
};



const googleSignIn = (payload: string) => {
    const url = new URL(payload);
    // Get `access_token` from redirect_uri param
    const access_token = new URLSearchParams(url.hash.substring(1)).get('access_token');

    if (!access_token)return;

    const credential = GoogleAuthProvider.credential(null, access_token);

    signInWithCredential(auth, credential)
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
        });
};

const requestGithubSignIn = async(payload: string) => {
    //const url = new URL(payload);
    // Get `access_token` from redirect_uri param
    //const access_token = new URLSearchParams(url.hash.substring(1)).get('code');

    const paramString_code = payload.split('?')[1];
    const queryString_code = new URLSearchParams(paramString_code);
    const github_code = queryString_code.get("code");

    if (!github_code){
        console.log("Auth state changed but failed to acquire token: " + payload);
        return;
    }

    const response: any = await fetch('https://github.com/login/oauth/access_token?' +
    `client_id=${import.meta.env.VITE_GITHUBCLIENTID}&` +
    `client_secret=${import.meta.env.VITE_GITHUBCLIENTSECRET}&` +
    `code=${github_code}`, { method: "POST", responseType: ResponseType.Text });
    
    const paramString_access_token = response.data.split('&')[0];
    const queryString_access_token = new URLSearchParams(paramString_access_token);
    const access_token = queryString_access_token.get("access_token");

    if (!access_token){
        console.log("Unable to acquire access token: " + response);
        return;
    }

    const credential = GithubAuthProvider.credential(access_token);

    signInWithCredential(auth, credential)
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
        });
};

//end of external code