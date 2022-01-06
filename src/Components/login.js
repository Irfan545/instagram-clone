import { signInWithEmailAndPassword } from "firebase/auth";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { useContextProvoider } from "../context";
import { auth } from "../firebaseconfig";


const LoginForm = () => {
    const {handleLogin}=useContextProvoider();
    const emailRef=useRef();
    const passwordRef=useRef();
    const navigate=useNavigate();

    const login=async(e)=>{
        e.preventDefault()
        try{
            const email=emailRef.current.value
            const password=passwordRef.current.value
            await signInWithEmailAndPassword(auth,email,password);
        navigate('/');
        }catch(e){
            console.log(e.error)
        }
    }
    return ( 
    <div className="parent-login">
        <div className="login-form">
            <div className="logo-div">Instagram</div>
            <div className="form-div">
            <form>
            <p>Email:</p>
            <input ref={emailRef} type='email' placeholder="Email"/>
            <p>Password:</p>
            <input ref={passwordRef} type='password' placeholder="Password"/>
            <button onClick={login}>Log In</button>
            </form>
            <div className="forget-pass">
                <a className="link" href="/register">Create Account..</a>
            </div>
            </div>
        </div>
    </div> );
}
 
export default LoginForm;