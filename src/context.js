import { onAuthStateChanged } from 'firebase/auth';
// import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { auth } from './firebaseconfig';

const userContext = createContext();

export function useContextProvoider() {
	return useContext(userContext);
}

export default function ContextProvoider({ children }) {
	const [User, setUser] = useState();
	const [loader, setLoader] = useState(true);

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

	const value = {
		User,
	};
	return (
		!loader && (
			<userContext.Provider value={value}>{children}</userContext.Provider>
		)
	);
}
