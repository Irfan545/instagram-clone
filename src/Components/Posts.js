import {
	arrayRemove,
	arrayUnion,
	collection,
	doc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import Moment from 'react-moment';
import { auth, db } from '../firebaseconfig';
import IMG from '../img/cover 2.png';
import OPTION from '../img/option.PNG';
import LIKE from '../img/like.PNG';
import COMMENT from '../img/comment.PNG';
import SEND from '../img/send.PNG';
import SAVE from '../img/save.PNG';
import SMILE from '../img/smile.PNG';
import { useNavigate } from 'react-router';
import { useContextProvoider } from '../context';
const PostsCard = () => {
	const [Posts, setPosts] = useState();
	const [liked, setliked] = useState(false);
	const [buttonDisable, setbuttonDisable] = useState(false);
	const [text, setText] = useState('');
	const { setgetPosts } = useContextProvoider();
	const navigate = useNavigate();
	//   console.log(Posts);

	useEffect(() => {
		const getPosts = async () => {
			const q = query(collection(db, 'posts'), orderBy('uploadedAt', 'desc'));
			onSnapshot(q, (querySnapshot) => {
				const posts = [];
				querySnapshot.forEach((doc) => {
					posts.push({ ...doc.data(), id: doc.id });
				});

				setPosts(posts);
			});
		};
		getPosts();
	}, []);

	const handlelike = async (id, allLikes) => {
		const userid = auth.currentUser.uid;
		if (allLikes.includes(userid)) {
			setliked(false);
			await updateDoc(doc(db, 'posts', id), {
				likes: arrayRemove(userid),
			});
		} else {
			setliked(true);
			await updateDoc(doc(db, 'posts', id), {
				likes: arrayUnion(userid),
			});
		}
	};

	const handleComment = async (id, postcomments) => {
		setbuttonDisable(true);
		const currentUserId = auth.currentUser.uid;
		console.log(text);
		if (text !== '') {
			setText('');
			await updateDoc(doc(db, 'posts', id), {
				comments: arrayUnion({
					id: currentUserId,
					usercomment: text,
					userProfile: '',
				}),
			});
		}
		setbuttonDisable(false);
	};
	const gotoProfile = async (userid) => {
		try {
			const q = query(collection(db, 'posts'), where('userId', '==', userid));
			const docSnap = await getDocs(q);
			const posts = [];
			docSnap.forEach((d) => {
				posts.push({ data: d.data(), id: d.id });
			});
			setgetPosts(posts);
			navigate(`/userProfile/${userid}`);
		} catch (e) {
			console.log(e);
		}
	};
	return (
		<div>
			{Posts &&
				Posts.map((post) => (
					<div className='post' key={post.id}>
						<div className='info'>
							<div className='user'>
								<div
									className='profile-pic'
									style={{ cursor: 'pointer' }}
									onClick={() => {
										gotoProfile(post.userId);
									}}
								>
									<img src={IMG} alt='' />
								</div>
								<p
									className='username'
									style={{ cursor: 'pointer' }}
									onClick={() => {
										gotoProfile(post.userId);
									}}
								>
									{post.username}
								</p>
							</div>
							<img src={OPTION} className='options' alt='' />
						</div>
						<img src={post.posturl} className='post-image' alt='' />
						<div className='post-content'>
							<div className='reaction-wrapper'>
								<img
									src={LIKE}
									className={`icon ${
										post.likes.includes(auth.currentUser.uid) ? 'liked' : ''
									}`}
									onClick={() => {
										handlelike(post.id, post.likes);
									}}
									alt=''
								/>
								<img src={COMMENT} className='icon' alt='' />
								<img src={SEND} className='icon' alt='' />
								<img src={SAVE} className='save icon' alt='' />
							</div>
							<p className='likes'>
								{post.likes.length > 1
									? `${post.likes.length} Likes`
									: `${post.likes.length} Like`}
							</p>
							<p className='description'>
								<span>{post.username}</span> Lorem ipsum dolor sit amet
								consectetur, adipisicing elit. Pariatur tenetur veritatis
								placeat, molestiae impedit aut provident eum quo natus
								molestias?
							</p>
							<p className='post-time'>
								<Moment fromNow>{post.uploadedAt.toDate()}</Moment>
							</p>
							<p className='comments-link'>
								{post.comments?.length > 1
									? `View ${post.comments?.length} comments`
									: `View ${post.comments?.length} comment`}
							</p>
						</div>
						<div className='comment-wrapper'>
							<img src={SMILE} className='icon' alt='' />
							<input
								type='text'
								className='comment-box'
								placeholder='Add a comment'
								value={text}
								onChange={(e) => {
									setText(e.target.value);
								}}
							/>
							<button
								className='comment-btn'
								onClick={() => {
									handleComment(post.id, post.comments);
								}}
								disabled={buttonDisable}
							>
								post
							</button>
						</div>
					</div>
				))}
		</div>
	);
};

export default PostsCard;
