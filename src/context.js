import { onAuthStateChanged } from 'firebase/auth';
// import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
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

	if (User) {
		console.log(User.uid);
	}
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoader(false);
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

	const value = {
		User,
        usersData
	};
	return (
		!loader && (
			<userContext.Provider value={value}>{children}</userContext.Provider>
		)
	);
}
