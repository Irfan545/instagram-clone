import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import {
	collection,
	getDocs,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore';
import { db } from './firebaseconfig';
import { auth } from './firebaseconfig';

const userContext = createContext();

export function useContextProvoider() {
	return useContext(userContext);
}

export default function ContextProvoider({ children }) {
	const [User, setUser] = useState(null);
	const [loader, setLoader] = useState(true);
	const [loader2, setLoader2] = useState(true);
	const [usersData, setUsersData] = useState([]);
	const [currentUserData, setcurrentUserData] = useState();
	// const [currentUserPosts, setcurrentUserPosts] = useState();
	const [getPosts, setgetPosts] = useState();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user !== null) {
				const getCurrentUserData = async () => {
					try {
						const q = query(
							collection(db, 'users'),
							where('id', '==', auth.currentUser.uid),
						);
						const docSnap = await getDocs(q);
						const user = [];
						docSnap.forEach((d) => {
							user.push(d.data());
						});
						setcurrentUserData(user);
						setLoader2(false);
						
					} catch (e) {
						setLoader2(false);
						console.log(e);
					}
				};
				getCurrentUserData();
			} else {
				setcurrentUserData(user);
				console.log("No User")
				setUser(user);
			}
			setUser(user);
			setLoader(false);
		});

		return unsubscribe();
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
		usersData,
		currentUserData,
		getPosts,
		setgetPosts,
	};
	return (
		!loader &&
		(
			<userContext.Provider value={value}>{children}</userContext.Provider>
		)
	);
}

// .mymsgs {
//   margin-top: .5rem;
//   display: flex;
//   text-align: right;
//   justify-content: right;
//   background-color: #fff;
//   /* width: 50%; */
// }

// .theremsgs {
//   margin-top: .5rem;
//   display: flex;
//   text-align: left;
//   justify-content: left;
//   background-color: #fff;
// }

// .my-msg {
//   /*   */
//   width: min-content;
//   /* width: 50%; */
// }

// .my-msg p {
//   position: relative;
//   left: 11rem;
//   padding: 1rem;
//   /* margin-right: 1rem; */
//   /* border: 1px solid rgba(27, 31, 35, 0.10); */
//   border-radius: 1.5rem;
//   font-size: .8rem;
//   background-color: #EFEFEF;
//   width: 50%;
//   word-wrap: break-word;
// }

// .there-msg {
//   width: 50%;
// }

// .there-msg p {
//   padding: 1rem;
//   /* margin: 0 1rem; */
//   border-radius: 1.5rem;
//   font-size: .8rem;
//   border: 1px solid rgba(27, 31, 35, 0.10);
//   /* background-color: #EFEFEF; */
//   width: min-content;
// }
