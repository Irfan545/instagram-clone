import React from 'react';
import { useNavigate } from 'react-router';
import { Navigate, useLocation } from 'react-router-dom';
import { useContextProvoider } from '../context';
import { auth } from '../firebaseconfig';
import LoginForm from './login';

export default function RequiredAuth({ children }) {
	const {User} = useContextProvoider();
	const location = useLocation();
	const navigate = useNavigate;
	const user1 = auth?.currentUser?.uid;
	// (user1);
	return User ? (
		children
	) : (
		<Navigate to='/login' replace state={{ path: location.pathname }} />		
	);
}
// this needs to understand
