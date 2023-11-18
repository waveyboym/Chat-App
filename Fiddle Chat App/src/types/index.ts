import { DocumentData } from "firebase/firestore";
import { User } from "firebase/auth";

export interface authProviderType{   
    user: User | null,
    UserUID: string | null,
    userDB: DocumentData | null, 
    isLoading: boolean, 
    setLoadingTrue: () => void, 
    setLoadingFalse: () => void
}

export interface personalDetailsForm{
    profile: any,
    uid: string,
    username: string,
    password: string;
    email: string,
    dob: string,
    pronouns: string,
    position: string
}