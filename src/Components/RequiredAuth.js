import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useContextProvoider } from '../context';
import { auth } from '../firebaseconfig';

export default function RequiredAuth({ children }) {
	const {User} = useContextProvoider();
	const location = useLocation();
	const user1 = auth.currentUser?.uid;
	console.log(user1);
	return user1 && User ? (
		children
	) : (
		<Navigate to='/login' replace state={{ path: location.pathname }} />
	);
}
// this needs to understand
