import { onAuthStateChanged } from "firebase/auth";
// import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { db } from "./firebaseconfig";
import { auth } from "./firebaseconfig";

const userContext = createContext();

export function useContextProvoider() {
  return useContext(userContext);
}

export default function ContextProvoider({ children }) {
  const [User, setUser] = useState();
  const [loader, setLoader] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const [currentUserData, setcurrentUserData] = useState();
  const [getPosts,setgetPosts]=useState();
  // const user1=User.uid;
  // console.log(user1)
  // if (User) {
  // console.log(User)
  console.log(currentUserData);
  console.log(usersData)
  console.log(getPosts)
  // }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
		setUser(user);

		const getCurrentUserData=async()=>{
			try{
				const q = query(collection(db, "users"), where("id", "==", auth.currentUser.uid));
				const docSnap = await getDocs(q);
				const user = [];
				//  console.log(docSnap.data())
				docSnap.forEach((d) => {
				  //  console.log(d.data())
				  user.push(d.data());
				});
				setcurrentUserData(user);
			}catch(e){
				console.log("user currently not Logged In ")
			}
		}
      setLoader(false);
      getCurrentUserData();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsersData(users);

      return unsubscribe();
    });
  }, []);
  useEffect(() => {
	 const getcurrentUser=()=>{
		 if ( User && usersData) {
		   usersData.forEach((data) => {
			 if (data.id === User.uid) {
			   setcurrentUserData(data);
			 }
		   });
		 }
	 }
	 return getcurrentUser();
    // return unsub;
  }, [usersData]);

//   const getposthandle = async (userid) => {
   
//   };
  const value = {
    User,
    usersData,
    currentUserData,
	getPosts,
	setgetPosts,
  };

  return (
    !loader && (
      <userContext.Provider value={value}>{children}</userContext.Provider>
    )
  );
}
