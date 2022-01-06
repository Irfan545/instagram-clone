import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useRef } from 'react';
import { auth, db } from '../firebaseconfig';
import { useContextProvoider } from '../context';
import { useNavigate, useLocation } from 'react-router';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

const Register = () => {
	const { User } = useContextProvoider();
	const { state } = useLocation();
	const useremail = useRef();
	const name = useRef();
	const userpassword = useRef();
	const navigate = useNavigate();
	// console.log(User)
	const registerUser = async (e) => {
		e.preventDefault();
		console.log(name.current.value);
		try {
			const user_name = name.current.value;
			const email = useremail.current.value;
			const password = userpassword.current.value;
			console.log(userpassword.current.value);
			const userDetail = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);
			navigate('/');
			console.log(userDetail.user.uid);
			const docRef = doc(db, 'users', userDetail.user.uid);
			const payload = {
				username: user_name,
				email: email,
				password: password,
				createdOn: serverTimestamp(),
				isOnline: true,
				id: userDetail.user.uid,
			};
			await setDoc(docRef, payload);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (User) {
			navigate(state?.path || '/');
		}
	}, [User, state?.path, navigate]);
	return (
		<>
			<div className='parent-login'>
				<div className='login-form'>
					<div className='logo-div'>Instagram</div>
					<h2 className='info-div'>
						{User ? <>{User.email}</> : <>Register</>}
					</h2>
					<div className='form-div'>
						<form>
							<input type='text' ref={name} placeholder='User name' />
							<input type='email' ref={useremail} placeholder='Email' />
							<input
								type='password'
								ref={userpassword}
								placeholder='Password'
							/>
							<input type='password' placeholder='Confirm Password' />
							<button onClick={registerUser}>Register</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Register;
