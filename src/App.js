import LoginForm from './Components/login';
import HomePage from './Components/homepage';
// import './index.css';
import './style.css';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Chat from './Components/chats';
import Register from './Components/register';
import ContextProvoider from './context';
import RequiredAuth from './Components/RequiredAuth';
import UserProfile from './Components/userProfile';
import NotFound from './Components/NotFound';

function App() {
	return (
		<BrowserRouter>
			<ContextProvoider>
				<Routes>
					<Route path='/register' element={<Register />} />
					<Route path='/login' element={<LoginForm />} />
					<Route
						path='/'
						element={
							<RequiredAuth>
								<HomePage />
							</RequiredAuth>
						}
					/>
					<Route
						path='/chats'
						element={
							// <RequiredAuth>
								<Chat />
							// </RequiredAuth>
						}
					/>
					<Route path='/userProfile/:id' element={<UserProfile />} />
					<Route path='*' element={<NotFound />} />
				</Routes>
			</ContextProvoider>
		</BrowserRouter>
	);
}

export default App;
