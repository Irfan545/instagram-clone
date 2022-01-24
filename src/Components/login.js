import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import LOGO from "../img/logo.PNG";
import { useContextProvoider } from "../context";
import { auth } from "../firebaseconfig";
import Loader from "./loader";

const LoginForm = () => {
  const { User,load,setload,setUser } = useContextProvoider();
  const [error, seterror] = useState();
  const { state } = useLocation();
  const emailRef = useRef();
//   const [load, setload] = useState(false);
  const passwordRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    
    if (User) {
    
      navigate(state?.path || "/");
    }
  }, [User, state?.path, navigate]);

  const login = async (e) => {
    setload(true);
    e.preventDefault();
    try {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      await signInWithEmailAndPassword(auth, email, password);
      setload(false);
      setUser(true)
      navigate("/");
    } catch (e) {
    
      seterror(e.message);
      emailRef.current.value = "";
      passwordRef.current.value = "";
      setload(false);
    }
  };
  return (
    !User && (
      <div className="parent-login">
        <div className="login-form">
          <div className="logo-div">
            <img src={LOGO} alt="logo.png" />
          </div>
          <div className="form-div">
            <form>
              <input ref={emailRef} type="email" placeholder="Email" />

              <input ref={passwordRef} type="password" placeholder="Password" />
              <button onClick={login}>Log In</button>
            </form>
            <div className="forget-pass">
              <a className="link" href="/register">
                Create Account..
              </a>
            </div>
          </div>
        </div>
        {error && <div className="error-div">{error}</div>}
        
      </div>
    )
  );
};

export default LoginForm;
