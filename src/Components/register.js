import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { auth, db } from '../firebaseconfig';
import { useContextProvoider } from '../context';
import { useNavigate, useLocation } from 'react-router';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import LOGO from '../img/logo.PNG'

const Register = () => {
	const [error,seterror]=useState();
	const { User,setload } = useContextProvoider();
	const { state } = useLocation();
	const useremail = useRef();
	const cpassword = useRef();
	const name = useRef();
	const userpassword = useRef();
	const navigate = useNavigate();
	// (User)
	const registerUser = async (e) => {
		e.preventDefault();
		setload(true);
		
		const user_name = name.current.value;
		const email = useremail.current.value;
		const password = userpassword.current.value;
		const confirmpass=cpassword.current.value;
		try {
				if(confirmpass === password){
				const userDetail = await createUserWithEmailAndPassword(
					auth,
					email,
					password,
				);
				navigate('/');
		
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
			}else{
				name.current.value="";
				useremail.current.value="";
				userpassword.current.value="";
				cpassword.current.value="";
		
				seterror("Password do not match!")
			}
			setload(false)
		} catch (e) {
		
			seterror(e.message);
			name.current.value=""
			userpassword.current.value=""
			useremail.current.value=""
			cpassword.current.value=""
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
					<div className='logo-div'><img src={LOGO} alt='logo.png'/></div>
					<h2 className='info-div'>
						Register
					</h2>
					<div className='form-div'>
						<form>
							<input type='text' ref={name} minLength='6' placeholder='User name' />
							<input type='email' ref={useremail} placeholder='Email' />
							<input
								type='password'
								ref={userpassword}
								placeholder='Password'
							/>
							<input type='password' ref={cpassword} placeholder='Confirm Password' />
							<button onClick={registerUser}>Register</button>
						</form>
					</div>
				</div>
				{error && <div className='error-div'>{error}</div>}
			</div>
		</>
	);
};

export default Register;
