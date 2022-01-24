import IMG from '../profile.png';
import NavBar from './nav';
import { useContextProvoider } from '../context';
import { useEffect, useRef, useState } from 'react';
import { auth, db, storage } from '../firebaseconfig';
import {
	addDoc,
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
	setDoc,
	Timestamp,
	updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Moment from 'react-moment';
const Chat = () => {
	const { usersData, currentUserData } = useContextProvoider();
	const [msgs, setmsgs] = useState();
	const [text, settext] = useState();
	const [selected, setselected] = useState(false);
	const [chat, setchat] = useState('');
	const [img, setimg] = useState('');
	const [sendDisabled, setsendDisabled] = useState(false);
	const [lmsg, setlmsg] = useState();
	
	const user1 = auth?.currentUser?.uid;

	const scrollRef = useRef();

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [msgs]);

	const sendMessage = async () => {
		setsendDisabled(true);

		const user2 = chat.id;
		const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

		let dlUrl;
		if (text !== '') {
			if (img) {
				const imgRef = ref(
					storage,
					`images/${new Date().getTime()}-${img.name}`,
				);
				const imgpath = await uploadBytes(imgRef, img);
				const url = await getDownloadURL(imgRef, imgpath.ref.fullPath);
				dlUrl = url;
			}

			await addDoc(collection(db, 'messages', id, 'chat'), {
				text,
				from: user1,
				to: user2,
				createdAt: Timestamp.fromDate(new Date()),
				media: dlUrl || '',
			});
			setsendDisabled(false);
			await setDoc(doc(db,'lastMsg', id), {
				text,
				from: user1,
				to: user2,
				createdAt: Timestamp.fromDate(new Date()),
				unread: true,
			});
			settext('');
		}
	};

	const selectuser = async (user) => {
		setchat(user);
		setselected(true);
		const user2 = user.id;
		const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
		const msgRef = collection(db, 'messages', id, 'chat');
		const q = query(msgRef, orderBy('createdAt', 'asc'));
		onSnapshot(q, (snap) => {
			const result = snap.docs.map((doc) => doc.data());
			setmsgs(result);
		});
		if (lmsg?.unread === true) {
			await updateDoc(doc(db, 'lastMsg', id), {
				unread: false,
			});
		}
	};

	return (
		<>
			<NavBar />
			{currentUserData  &&
			<div className='chat-div'>
				<div className='owner-name'>
					<p className='name'>{currentUserData[0].username}</p>
					<div className='user-chats'>
						{usersData &&
							usersData.map((user) => {
								return (
									<div
										className='single-user'
										onClick={() => selectuser(user)}
										key={user.id}
									>
										<div className='img-name'>
											<div
												className='img-name-msg'
												style={{ position: 'relative' }}
											>
												<img src={IMG} alt='img' />
												{user.isOnline && (
													<div
														style={{
															width: '12px',
															height: '12px',
															borderRadius: '50%',
															background: '#33DA6D',
															border: '2px solid #ddd',
															position: 'absolute',
															bottom: '0px',
															left: '40px',
														}}
													></div>
												)}
												<div>
													<h4>{user.username}</h4>
													<p>Hi</p>
												</div>
											</div>
											<div className='online'></div>
										</div>
									</div>
								);
							})}
					</div>
				</div>

				<div className='chat-container'>
					{selected ? 
					
					<div>
					<div className='chat-profile'>
						<div className='chat-img-name'>
							<img src={IMG} alt='img' />
							<div className='name-lastseen'>
								<p>{chat.username}</p>
								<small>Last seen 2 min ago</small>
							</div>
						</div>
						<svg
							aria-label='View thread details'
							// class="_8-yf5 "
							color='#262626'
							fill='#262626'
							height='24'
							role='img'
							viewBox='0 0 24 24'
							width='24'
						>
							<circle
								cx='12.001'
								cy='12.005'
								fill='none'
								r='10.5'
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
							></circle>
							<circle cx='11.819' cy='7.709' r='1.25'></circle>
							<line
								fill='none'
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								x1='10.569'
								x2='13.432'
								y1='16.777'
								y2='16.777'
							></line>
							<polyline
								fill='none'
								points='10.569 11.05 12 11.05 12 16.777'
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
							></polyline>
						</svg>
					</div>
					<div className='messages'>

						{msgs?.map((message, i) => (
							<div
								key={i}
								className={`msg-wrapper ${
									message.from === auth.currentUser.uid ? 'own' : ''
								}`}
								ref={scrollRef}
							>
								
								<div
									className={
										message.from === auth.currentUser.uid ? 'me' : 'friend'
									}
								>
									{message.media ? (
										<img src={message.media} alt={message.text} />
									) : null}
									<div
										className={`try ${
											message.from === auth.currentUser.uid ? 'my' : 'there'
										}`}
									>
										<p>{message.text}</p>
										<br />
										<small>
											<Moment fromNow>{message.createdAt.toDate()}</Moment>
										</small>
									</div>
								</div>
								
							</div>
						))}

						<div className='input-button-container'>
							{/* Messages here */}
							<div className='input-button'>
								<svg
									aria-label='Emoji'
									// class="_8-yf5 "
									color='#262626'
									fill='#262626'
									height='24'
									role='img'
									viewBox='0 0 24 24'
									width='24'
								>
									<path d='M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-6.5 1.167a1.167 1.167 0 10-1.166 1.167 1.167 1.167 0 001.166-1.167zm5.163 3.24a3.406 3.406 0 01-4.982.007 1 1 0 10-1.557 1.256 5.397 5.397 0 008.09 0 1 1 0 00-1.55-1.263zM12 .503a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012 .503zm0 21a9.5 9.5 0 119.5-9.5 9.51 9.51 0 01-9.5 9.5z'></path>
								</svg>
								<input
									type='text'
									value={text}
									onChange={(e) => settext(e.target.value)}
									placeholder='Message...'
								/>
								<label htmlFor='img'>
									<svg
										aria-label='Add Photo or Video'
										// class="_8-yf5 "
										color='#262626'
										fill='#262626'
										height='24'
										role='img'
										viewBox='0 0 24 24'
										width='24'
									>
										<path
											d='M6.549 5.013A1.557 1.557 0 108.106 6.57a1.557 1.557 0 00-1.557-1.557z'
											fillRule='evenodd'
										></path>
										<path
											d='M2 18.605l3.901-3.9a.908.908 0 011.284 0l2.807 2.806a.908.908 0 001.283 0l5.534-5.534a.908.908 0 011.283 0l3.905 3.905'
											fill='none'
											stroke='currentColor'
											strokeLinejoin='round'
											strokeWidth='2'
										></path>
										<path
											d='M18.44 2.004A3.56 3.56 0 0122 5.564h0v12.873a3.56 3.56 0 01-3.56 3.56H5.568a3.56 3.56 0 01-3.56-3.56V5.563a3.56 3.56 0 013.56-3.56z'
											fill='none'
											stroke='currentColor'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
										></path>
									</svg>
								</label>
								<input
									type='file'
									accept='image/*'
									id='img'
									style={{ display: 'none' }}
									onChange={(e) => setimg(e.target.files[0])}
								/>
								<button
									className='send-button'
									disabled={sendDisabled}
									onClick={sendMessage}
								>
									SEND
								</button>
							</div>
						</div>
					</div>
					</div>
				:<h3 className='select_class'>Select user to start conversation</h3>}
				</div>
			</div>
			}
		</>
	);
};

export default Chat;
