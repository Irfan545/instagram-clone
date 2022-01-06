import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
// import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { auth, db } from "./firebaseconfig";



const userContext=createContext();

export function useContextProvoider(){
 return useContext(userContext);
}

export default function ContextProvoider({children}){
    const [User,setUser]=useState();
    const navigate=useNavigate();

    const signup= async(name,email,password)=>{
        
         
    }
    const handleLogin=async(email,password)=>{
        
    }
    if(User){
        console.log(User.uid)
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setUser(user)
        })

        return unsubscribe
    }, [])
    // if(User){
    //     navigate('/')
    //     return navigate('/login')
    // }
    const value={
        User,
        signup,
        handleLogin,
    }
    return(
        <userContext.Provider value={value}>
        {children}
        </userContext.Provider>
    )
}