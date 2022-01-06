import LoginForm from "./Components/login";
import HomePage from "./Components/homepage";
import "./index.css";
import {Routes ,Route} from 'react-router-dom';
import {BrowserRouter} from 'react-router-dom';
import Chat from "./Components/chats";
import Register from "./Components/register";
import ContextProvoider from "./context";


function App() {
  return (
    <BrowserRouter>
    <ContextProvoider>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<LoginForm/>}/>
      <Route path='/chats' element={<Chat/>}/>
    </Routes>
    </ContextProvoider>
    </BrowserRouter>
  );
}

export default App;
