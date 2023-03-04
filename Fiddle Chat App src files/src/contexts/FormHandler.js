import { auth, db } from "../firebase";
import { GoogleAuthProvider, createUserWithEmailAndPassword,
    signInWithEmailAndPassword, sendPasswordResetEmail, getRedirectResult,
    FacebookAuthProvider, TwitterAuthProvider, GithubAuthProvider, updateProfile } from "firebase/auth";
import { doc, setDoc, collection, query, where , getDocs} from "firebase/firestore";
const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const validPassword = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$');
const validusername = new RegExp('^(?=.*?[a-z]).{4,}$');
export const googleprovider = new GoogleAuthProvider();
export const facebookprovider = new FacebookAuthProvider();
export const twitterprovider = new TwitterAuthProvider();
export const githubprovider = new GithubAuthProvider();

export const createNewUser = (props) => {
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
            updateProfile(auth.currentUser, {displayName: usernameclean})
                .then(() => { return "SUCCESS";})
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    //todo create a proper error handler
                    console.log( errorCode + " : " + errorMessage);
                }); 
            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            //todo create a proper error handler
            console.log( errorCode + " : " + errorMessage);
        });
    
    return "SUCCESS";
}

export const signInUser = (props) => {
    const emailclean = props.emailaddress;
    const passwordclean = props.password;

    if (!emailclean.match(validEmail)) {
        return "invalid email";
    }
    if (!validPassword.test(passwordclean)) {
        return "password should have at least one lower and upper case letter, one number and be at least 8 characters long";
    }

    return signInWithEmailAndPassword(auth, emailclean, passwordclean);
}

export const loginResults__ExtProv = (providername) => {
    getRedirectResult(auth).
    then( async(result) => {
        // The signed-in user info.
        if(result === null)return;
        const user = result.user;
        if(user === null)return;
        
        const usersRef = query(collection(db, "users"), where("uid", "==", user.uid));
        const snapshot = await getDocs(usersRef);
        if(snapshot.docs.length !== 0)return;

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
            AccountActive: true
        });

        const userRef = doc(db, "users", user.uid);
        await setDoc(doc(userRef, "messages", user.uid), {});
        await setDoc(doc(userRef, "requests", user.uid), {});
        await setDoc(doc(userRef, "friends", user.uid), {});
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " : " + errorMessage);
    });
}

export const loginResultsForm = async() => {
    const user = auth.currentUser;
    if(user === null)return;

    try {
        // The signed-in user info.
        const usersRef = query(collection(db, "users"), where("uid", "==", user.uid));
        const snapshot = await getDocs(usersRef);
        if(snapshot.docs.length !== 0)return;

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
            AccountActive: true 
        });

        const userRef = doc(db, "users", user.uid);
        await setDoc(doc(userRef, "messages", user.uid), {});
        await setDoc(doc(userRef, "requests", user.uid), {});
        await setDoc(doc(userRef, "friends", user.uid), {});
    }
    catch(error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " : " + errorMessage);
    };
}

export const sentResetpswdEmail = (props) => {
    const emailclean = props.email;//purify.sanitize(

    if (!emailclean.match(validEmail)) return "invalid email";

    return sendPasswordResetEmail(auth, emailclean);
}