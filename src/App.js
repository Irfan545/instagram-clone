import LoginForm from './Components/login';
import HomePage from './Components/homepage';
import './index.css';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Chat from './Components/chats';
import Register from './Components/register';
import ContextProvoider from './context';
import RequiredAuth from './Components/RequiredAuth';
import UserProfile from './Components/userProfile';

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
							<RequiredAuth>
								<Chat />
							</RequiredAuth>
						}
					/>
					<Route path='/userProfile/:id' element={<UserProfile/>}/>
				</Routes>
			</ContextProvoider>
		</BrowserRouter>
	);
}

export default App;
