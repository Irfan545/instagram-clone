import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useRef, useState } from "react";
import { auth, db } from "../firebaseconfig";
import { useContextProvoider } from "../context";
import { useNavigate } from "react-router";
import {
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc
} from "firebase/firestore";

const Register = () => {
  // const [email,setEmail]=useState('');
  // const [password,setpassword] = useState('');
  // const [user,setuser]=useState('');
  const { User, signup } = useContextProvoider();
  const useremail = useRef();
  const name = useRef();
  const userpassword = useRef();
  const navigate = useNavigate();
  // console.log(User)
  const registerUser = async (e) => {
    e.preventDefault();
    console.log(name.current.value);
    try {
      const user_name = name.current.value;
      const email = useremail.current.value;
      const password = userpassword.current.value;
      console.log(userpassword.current.value);
      const userDetail = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      navigate("/");
      console.log(userDetail.user.uid);
      const docRef = doc(db, "users", userDetail.user.uid);
      const payload = {
        username: user_name,
        email: email,
        password: password,
        createdOn: serverTimestamp(),
        isOnline: true,
        id: userDetail.user.uid
      };
      await setDoc(docRef, payload);
      // console.log(userDetail.user.uid);
      // await signup(name,useremail.current.value,userpassword.current.value)
    } catch (e) {
      console.log(e);
    }
  };
  const logout = async (e) => {
      e.preventDefault()
    try {
      console.log(auth.currentUser.uid);
      const userId = auth.currentUser.uid;
      const docRef = doc(db, "users", userId);
      const payload = {
        isOnline: false,
        lastSeen: Timestamp.fromDate(new Date())
      };
      await updateDoc(docRef, payload);
      await signOut(auth);
    } catch (e) {
      console.log(e.error);
    }
  };
  // console.log(email)
  // console.log(password)
  return (
    <>
      <div className="parent-login">
        <div className="login-form">
          <div className="logo-div">Instagram</div>
          <h2 className="info-div">
            {User ? <>{User.email}</> : <>Register</>}
          </h2>
          {/* <div className="fb-login">Log in with Facebook</div>
            <div className="parent-margin">
            <div className="margin-div">
            </div>
                <div className="or-div">OR</div>
                <div className="margin-div">
            </div>
            </div> */}
          <div className="form-div">
            <form>
              <input type="text" ref={name} placeholder="User name" />
              <input type="email" ref={useremail} placeholder="Email" />
              <input
                type="password"
                ref={userpassword}
                placeholder="Password"
              />
              <input type="password" placeholder="Confirm Password" />
              <button onClick={registerUser}>Register</button>
              <button onClick={logout}>LogOut</button>
            </form>
            {/* <div className="forget-pass">
                <a className="link" href="#">Forgotton your password?</a>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
