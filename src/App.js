import LoginForm from "./Components/login";
import HomePage from "./Components/homepage";
import "./index.css";
import NavBar from './Components/nav'
import {Routes ,Route} from 'react-router-dom';
import {BrowserRouter} from 'react-router-dom';
import Chat from "./Components/chats";
function App() {
  return (
    <BrowserRouter>
    <NavBar/>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/login' element={<LoginForm/>}/>
      <Route path='/chats' element={<Chat/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
