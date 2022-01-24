import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useContextProvoider } from '../context';
import { auth } from '../firebaseconfig';
import LoginForm from './login';

export default function RequiredAuth({ children }) {
	const {User} = useContextProvoider();
	const location = useLocation();
	const user1 = auth.currentUser?.uid;
	// (user1);
	return user1  ? (
		children
	) : (
		<Navigate to='/login' replace state={{ path: location.pathname }} />
		// <LoginForm/>
	);
}
// this needs to understand
