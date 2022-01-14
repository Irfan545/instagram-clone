import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../firebaseconfig';

export default function RequiredAuth({ children }) {
	const location = useLocation();
	const user1 = auth.currentUser?.uid;
	console.log(user1);
	return user1 ? (
		children
	) : (
		<Navigate to='/login' replace state={{ path: location.pathname }} />
	);
}
// this needs to understand
