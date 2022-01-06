import { onAuthStateChanged } from 'firebase/auth';
// import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './firebaseconfig';
import { auth } from './firebaseconfig';

const userContext = createContext();

export function useContextProvoider() {
	return useContext(userContext);
}

export default function ContextProvoider({ children }) {
	const [User, setUser] = useState();
	const [loader, setLoader] = useState(true);
	const [usersData, setUsersData] = useState(null);
	const [currentUserData,setcurrentUserData]=useState();
	// const user1=User.uid;
	// console.log(user1)
	// if (User) {
	// console.log(User)
	console.log(currentUserData)
	// }
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			// console.log(user)
			setUser(user);
			// const rquery = query(collection(db,'users'),where("id","==",user.uid));
			// const getCurrentUserData=async()=>{
			// 	const details=	await getDoc(rquery)
			// 	details.forEach((doc)=>{
			// 		console.log(doc)
			// 	})
			// }
			setLoader(false);
			// getCurrentUserData();
		});

		return unsubscribe;
	}, []);

	useEffect(() => {
		const q = query(collection(db, 'users'));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const users = [];
			querySnapshot.forEach((doc) => {
				users.push(doc.data());
			});
			setUsersData(users);

			return unsubscribe();
		});
	}, []);
	useEffect(()=>{
		if(User){
			usersData.forEach(data=>{
				if(data.id===User.uid){
					setcurrentUserData(data);
				}
			})
		}
		return null
	},[usersData])

	const value = {
		User,
        usersData,
		currentUserData,
	};
	return (
		!loader && (
			<userContext.Provider value={value}>{children}</userContext.Provider>
		)
	);
}
