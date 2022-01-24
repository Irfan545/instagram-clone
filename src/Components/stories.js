// import IMG from '../profile.jpg'
import PostsCard from './Posts';
import IMG from '../profile.png';
import { useContextProvoider } from '../context';
import NavBar from './nav';
import { auth, db } from '../firebaseconfig';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Stories = () => {
	const { usersData,currentUserData,load,setload } = useContextProvoider();
	const navigate = useNavigate();

	const Logout = async (e) => {
		setload(true)
		e.preventDefault();
		try {
			const userId = auth.currentUser.uid;
			const docRef = doc(db, 'users', userId);
			const payload = {
				isOnline: false,
				lastSeen: Timestamp.fromDate(new Date()),
			};
			await updateDoc(docRef, payload);
			await signOut(auth);
			setload(false)
			navigate('/login');
		} catch (e) {
			setload(false)
			(e);
		}
	};
	return (
		//     <div className='story-div'>
		//       <div className='story'>
		//           <img src={IMG} alt='img'/>
		//           <div className='story-name'>
		//           <p>name</p>
		//           </div>
		//       </div>
		//   </div>
		<>
			<NavBar />
			
			<section className='main'>
				<div className='wrapper'>
					<div className='left-col'>
						{/* <!-- status started --> */}

						<div className='status-wrapper'>
							{usersData &&
								usersData.map((user) => (
									<div className='status-card' key={user.id}>
										<div className='profile-pic'>
											<img src={user?.profileUrl||IMG} alt='' />
										</div>
										<p className='username'>{user.username}</p>
									</div>
								))}

							{/* <!-- // +5 more status card elements. --> */}
						</div>
						{/* <!-- status ended --> */}
						<PostsCard />
						{/* <!-- posts --> */}
						{/* <!-- posts ended --> */}
					</div>
					{/* <!-- left section ended --> */}
					{/* <!-- right section start --> */}
					<div className='right-col'>
						{currentUserData && <div className='profile-card'>
							<div className='profile-pic'>
								<img src={ currentUserData[0]?.profileUrl || IMG} alt='' />
							</div>
							<div>
								<p className='username'>{currentUserData[0]?.email}</p>
								<p className='sub-text'>{currentUserData[0]?.username}</p>
							</div>
							<button className='action-btn' onClick={Logout}>
								Logout
							</button>
						</div>}
						<p className='suggestion-text'>Suggestions for you</p>
						
						{usersData && usersData.map(user=>(
							<div className='profile-card'key={user.id}>
							<div className='profile-pic'>
								<img src={user?.profileUrl || IMG} alt='' />
							</div>
							<div>
								<p className='username'>{user?.email}</p>
								<p className='sub-text'>{user?.username}</p>
							</div>
							<button className='action-btn'>follow</button>
						</div>
						))}
					</div>
					{/* <!-- right section ennded --> */}
				</div>
			</section>
		</>
	);
};

export default Stories;
