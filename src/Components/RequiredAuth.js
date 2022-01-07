import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useContextProvoider } from '../context';

export default function RequiredAuth({ children }) {
	const { User } = useContextProvoider();
	const location = useLocation();

	console.log(User?.uid);
	return User ? (
		children
	) : (
		<Navigate to='/login' replace state={{ path: location.pathname }} />
	);
}
// this needs to understand