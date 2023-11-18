import { deleteUser, updatePassword, updateEmail, User } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc, getDoc, setDoc, Timestamp, collection, addDoc, deleteDoc, increment, DocumentData, DocumentReference, DocumentSnapshot } from "firebase/firestore"; 
import { ref, uploadBytesResumable, getDownloadURL, StorageReference, UploadTask } from "firebase/storage";
import { personalDetailsForm } from "../types";
const validEmail: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const validPassword: RegExp = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$');
const validusername: RegExp = new RegExp('^(?=.*?[a-z]).{4,}$');
const TwentyFourMarkMS: number = 86400000;
const OneHourMarkMS: number = 3600000;

function getElapsedMilliSeconds(dateString: any){   return Math.abs(new Date().getTime() - new Date(dateString).getTime());}

export const changePersonalDetails = async(obj : {oldData: DocumentData | null,newData: personalDetailsForm}) => {
    if(obj.oldData === null)return "User object is null";
    const oldDetails = obj.oldData;
    const newDetails = obj.newData;

    const currentUserRef: DocumentReference<DocumentData> = doc(db, "users", oldDetails.uid);
    if(newDetails.profile !== "" && auth.currentUser && auth.currentUser.displayName){
        const storageRef: StorageReference = ref(storage, auth.currentUser.displayName);
        const uploadTask: UploadTask = uploadBytesResumable(storageRef, newDetails.profile);

        uploadTask.on('state_changed', 
        (_snapshot) => {}, 
        (error) => {console.log(error)}, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).
                then(async(downloadURL) => {
                    await updateDoc(currentUserRef, {"displayPhoto": downloadURL});
                }).
                catch((error)  => {console.log(error)});
            }
        );

        if(newDetails.password === "" && newDetails.email === "")return "SUCCESS";
    }

    const timeLeft: number = getElapsedMilliSeconds(oldDetails.lastUpdate.toDate());
    
    if(timeLeft < TwentyFourMarkMS){
        const updateTimeHours = (TwentyFourMarkMS - timeLeft) / OneHourMarkMS;
        return "You can only update your profile again in " + updateTimeHours.toFixed(2);
    }

    if(newDetails.dob !== "")oldDetails.dateOfBirth = newDetails.dob;
    if(newDetails.position !== "")oldDetails.position = newDetails.position;
    if(newDetails.pronouns !== "")oldDetails.pronouns = newDetails.pronouns;
    if(newDetails.username !== ""){
        if (!validusername.test(newDetails.username)) {
            return "username should have at least one lowercase letter and be at least 4 characters long";
        }
        oldDetails.username = newDetails.username;
    }

    await updateDoc(currentUserRef, {
        "dateOfBirth": oldDetails.dateOfBirth,
        "position": oldDetails.position,
        "pronouns": oldDetails.pronouns,
        "username": oldDetails.username,
        "lastUpdate": Timestamp.now(),
    });

    if(newDetails.profile !== "" && auth.currentUser){
        const storageRef: StorageReference = ref(storage, auth.currentUser.uid);
        const uploadTask: UploadTask = uploadBytesResumable(storageRef, newDetails.profile);

        uploadTask.on('state_changed', 
        (_snapshot) => {}, 
        (error) => {console.log(error)}, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).
                then(async(downloadURL) => {
                    console.log(downloadURL);
                    await updateDoc(currentUserRef, {"displayPhoto": downloadURL});
                }).
                catch((error)  => {console.log(error)});
            }
        );

        if(newDetails.password === "" && newDetails.email === "")return "SUCCESS";
    }

    if(oldDetails.loginmethod === "form"){
        if(newDetails.password !== ""){
            const result = updateUserPassword(newDetails.password);
            if(result !== "SUCCESS")return result;
        }
        if(newDetails.email !== ""){
            const result = updateUserEmail(newDetails.email);
            if(result !== "SUCCESS")return result;
            //update email in database
            await updateDoc(currentUserRef, {"email": newDetails.email});
        }
        return "SUCCESS";
    }
    else{
        return "SUCCESS";
    }
}

export const deleteAccount = async() => {
    const user: User | null = auth.currentUser;
    if(user === null)return;

    //do some edits in database
    const currentUserRef: DocumentReference<DocumentData> = doc(db, "users", user.uid);
    await updateDoc(currentUserRef, {AccountActive: false});
    
    deleteUser(user).
    then(() => {/* User deleted.*/}).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " : " + errorMessage);
    });
}

const updateUserPassword = (newPassword: string) => {
    if (!validPassword.test(newPassword)) {
        return "password should have at least one lower and upper case letter, one number and be at least 8 characters long";
    }
    const user: User | null = auth.currentUser;
    if(user === null)return "backend server error";
    //test password
    
    updatePassword(user, newPassword).then(() => {
        // Update successful.
    }).catch((error: any) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " : " + errorMessage);
    });
    return "SUCCESS";
}

const updateUserEmail = (newEmail: string) => {
    //test email
    if (!newEmail.match(validEmail)) {
        return "invalid email";
    }
    if(!auth.currentUser){
        return "Not logged in";
    }

    updateEmail(auth.currentUser, newEmail).then(() => {
        // Email updated!
        // ...
      }).catch((error) => {
        // An error occurred
        // ...
        console.log(error);
      });

    return "SUCCESS";
}

export const sendFriendRequestTo = async(obj: {currentUser: DocumentData | null, friendId: string}) => {
    if(obj.currentUser === null)return "User object is null";
    const thisuser = obj.currentUser;
    const friendId = obj.friendId;

    //check if a user exists with the given ID
    const userRef: DocumentReference<DocumentData> = doc(db, "users", friendId);
    const userdocSnap: DocumentSnapshot<DocumentData> = await getDoc(userRef);
    if (userdocSnap.exists() !== true)return "no user exists with this User ID";

    //check if user exists in friends list
    const docSnapFriend: DocumentSnapshot<DocumentData> = await getDoc(doc(userRef, "friends", thisuser.uid));
    if (docSnapFriend.exists() === true)return "you are already on this users friend list";

    //check if a friend request has already been sent
    const docSnapRequest: DocumentSnapshot<DocumentData> = await getDoc(doc(userRef, "requests", thisuser.uid));
    if (docSnapRequest.exists() === true)return "you cannot send another friend request again";

    //create friend request doc
    await setDoc(doc(userRef, "requests", thisuser.uid),
        {
            uid: thisuser.uid,
            username: thisuser.username,
            profile: thisuser.displayPhoto,
            timestamp: Timestamp.now()
        });

    return "SUCCESS";
}

export const acceptFriendRequest = async(obj: {currentUser: any, friendId: string}) => {
    const thisuser = obj.currentUser;
    const friendId = obj.friendId;

    const friendRef: DocumentReference<DocumentData> = doc(db, "users", friendId);
    const thisUserRef: DocumentReference<DocumentData> = doc(db, "users", thisuser.uid);
    
    //create a new message holder between the two users only in the ref for the user who sent the request
    await setDoc(doc(friendRef, "messages", thisuser.uid), {});
    const messagesRef: DocumentReference<DocumentData> = doc(friendRef, "messages", thisuser.uid);
    
    //create a privatemessages collection
    await addDoc(collection(messagesRef, "privatemessages"),{});

    //add both users to each others friend list
    await setDoc(doc(friendRef, "friends", thisuser.uid),
        {
            friendID: thisuser.uid,
            timestamp: Timestamp.now(),
            messageHolder: true,
        });
    
    await setDoc(doc(thisUserRef, "friends", friendId),
        {
            friendID: friendId,
            timestamp: Timestamp.now(),
            messageHolder: false,
        });

    //delete the friend request from the request ref
    deleteDoc(doc(thisUserRef, "requests", friendId));
}

export const deleteFriendRequest = async(obj: {currentUser: any, friendId: string}): Promise<void> => {
    const thisuser = obj.currentUser;
    const friendId = obj.friendId;

    //delete the friend request from the request ref
    const thisUserRef: DocumentReference<DocumentData> = doc(db, "users", thisuser.uid);
    deleteDoc(doc(thisUserRef, "requests", friendId));
}

export const handleSendingPrivateMessage = async(obj: {id: string, user: any, friendId: string, messageholder: boolean, message: string}): Promise<boolean> => {
    const thisUser = obj.user;
    const friendUserID = obj.friendId;
    const msgHolder = obj.messageholder;
    const sentMessage = obj.message;

    const ThisuserRef: DocumentReference<DocumentData> = doc(db, "users", thisUser.uid); 
    const FrienduserRef: DocumentReference<DocumentData> = doc(db, "users", friendUserID);
    const friendDoc: DocumentSnapshot<DocumentData> = await getDoc(doc(ThisuserRef, "friends", friendUserID));
    if(friendDoc.exists() === false)return false;
    
    if(msgHolder === true){
        const messagesRef: DocumentReference<DocumentData> = doc(ThisuserRef, "messages", friendUserID);
        await addDoc(collection(messagesRef, "privatemessages"),
            {
                senderID: thisUser.uid,
                timestamp: Timestamp.now(),
                messageSent: sentMessage
            });
    }
    else{
        const messagesRef: DocumentReference<DocumentData> = doc(FrienduserRef, "messages", thisUser.uid);
        await addDoc(collection(messagesRef, "privatemessages"),
            {
                senderID: thisUser.uid,
                timestamp: Timestamp.now(),
                messageSent: sentMessage
            });
    }
    
    const ThisUserfriendRef: DocumentReference<DocumentData> = doc(ThisuserRef, "friends", friendUserID);
    await updateDoc(ThisUserfriendRef, {timestamp: Timestamp.now()});

    const FriendfriendRef: DocumentReference<DocumentData> = doc(FrienduserRef, "friends", thisUser.uid);
    await updateDoc(FriendfriendRef, {timestamp: Timestamp.now()});

    return true;
}

export const handleJoinRoom = async(obj: any) => {
    const roomID = obj.roomID;
    const user = obj.user;
    const roomRef = doc(db, "rooms", roomID);
    const userRef = doc(db, "users", user.uid);
    //find if room exists
    if(roomID.includes(" ") === true)return "room id should not have spaces";
    const roomData = await getDoc(roomRef);
    if(roomData.exists() !== true)return "no room exists with this ID";
    else if(roomData.exists() === true){
        
        if(roomData.data()?.membersAmount < 50){
            //add room to my room list
            await setDoc(doc(userRef, "rooms", roomData.id),{});
            //add to member list
            const myRefDoc = await getDoc(doc(roomRef, "members", user.uid));
            if(myRefDoc.exists() === true){
                await updateDoc(roomRef, {membersAmount: increment(1)});
                await updateDoc(doc(roomRef, "members", user.uid),{ inRoom: true });
                return roomRef.id;
            }
            else{
                await setDoc(doc(roomRef, "members", user.uid),{ inRoom: true });
                await updateDoc(roomRef, {membersAmount: increment(1)});
                return roomRef.id;
            }
        }
        else return "this room has too many members, either wait for an empty spot to become available or create your own room";
    }
    else return "failed";
}

export const handleCreateRoom = async(obj: any) => {
    const roomName = obj.roomname;
    const user = obj.user;

    const roomRef = await addDoc(collection(db, "rooms"), {
        roomname: roomName,
        displayPhoto: null,
        membersAmount: 1
    });
    const userRef = doc(db, "users", user.uid);

    //add room to my friends list
    await setDoc(doc(userRef, "rooms", roomRef.id),{});

    //add to member list
    await setDoc(doc(roomRef, "members", user.uid),{inRoom: true});

    return roomRef.id;
}

export const handleSendingRoomMessage = async(obj: {user: any, roomID: string, message: string}): Promise<void> => {
    const thisUser = obj.user;
    const roomID = obj.roomID;
    const sentMessage = obj.message;
    
    const roomRef = doc(db, "rooms", roomID);
    
    await addDoc(collection(roomRef, "roommessages"),
        {
            senderID: thisUser.uid,
            timestamp: Timestamp.now(),
            messageSent: sentMessage
        });
}

export const handleDeleteFriend = async(obj: {currentUser: any, friendId: string}): Promise<string> => {
    const thisuser = obj.currentUser;
    const friendUserID = obj.friendId;
    //delete myself from their friendlist
    const friendRef = doc(db, "users", friendUserID);
    deleteDoc(doc(friendRef, "friends", thisuser.uid));

    //delete them from my friendlist
    const myRef = doc(db, "users", thisuser.uid);
    deleteDoc(doc(myRef, "friends", friendUserID));
    return "SUCCESS";
    //cannot really delete messages, will have to do manually or with a callable cloud function
    //if a new friend request is sent again, old messages will be auto deleted as they will be overwritten
}

export const handleLeaveRoom = async(obj: {currentUser: any,roomID: string}): Promise<void> => {
    const thisuser = obj.currentUser;
    const roomID = obj.roomID;

    //reduce member count
    const roomRef: DocumentReference<DocumentData> = doc(db, "rooms", roomID);
    await updateDoc(roomRef, {membersAmount: increment(-1)});
    await updateDoc(doc(roomRef, "members", thisuser.uid),{ inRoom: false });
    
    //delete room from my list
    const thisUserRef: DocumentReference<DocumentData> = doc(db, "users", thisuser.uid);
    deleteDoc(doc(thisUserRef, "rooms", roomID));
    //done : )
}