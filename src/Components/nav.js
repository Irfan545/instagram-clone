import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebaseconfig";
import IMG from "../profile.png";
import LOGO from "../img/logo.PNG";
import HOME from "../img/home.PNG";
import MESSENGER from "../img/messenger.PNG";
import ADD from "../img/add.PNG";
import EXPLORE from "../img/explore.PNG";
import LIKE from "../img/like.PNG";
import { useContextProvoider } from "../context";
import { useState } from "react";
const NavBar = () => {
  const { currentUserData, setgetPosts, usersData } = useContextProvoider();
  const [isOpen, setIsOpen] = useState(false);
  // const [profilepic,setprofilepic]=useState();
  const navigate = useNavigate();
  const messageRoute = () => {
    navigate("/chats");
  };
  console.log(currentUserData[0].email);
  // console.log(getPosts);
  console.log(usersData);

  const UploadImg = async (e) => {
    if (e?.target?.files[0]) {
      const imgDetails = e.target.files[0];
      console.log(e.target.files[0]);
      const storageRef = ref(
        storage,
        `posts/${auth.currentUser.uid}-${Timestamp.fromDate(new Date())}`
      );
      await uploadBytes(storageRef, imgDetails);
      const url = await getDownloadURL(storageRef, imgDetails.name);
      await addDoc(collection(db, "posts"), {
        userId: auth.currentUser.uid,
        posturl: url,
        uploadedAt: Timestamp.fromDate(new Date()),
        likes: [],
        comments: [],
        username: currentUserData[0].username,
        profilePicture: currentUserData[0]?.profileUrl || '',
        // comments:[{comment:"Comment",id:auth.currentUser.uid}]
      });
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        posts: arrayUnion(url)
      });
      console.log(url);
    }
  };

  const profilepic = async (e) => {
    if(e?.target?.files[0]){
      const imgDetails = e.target.files[0];
      console.log(e.target.files[0]);
      const storageRef = ref(
        storage,
        `profile-pics/${auth.currentUser.uid}-${Timestamp.fromDate(new Date())}`
      );
      await uploadBytes(storageRef, imgDetails);
      const Profile_url = await getDownloadURL(storageRef, imgDetails.name);
      await updateDoc(doc(db,"users",auth.currentUser.uid),{
        profileUrl:Profile_url,
      })
    }
  };
  const myProfile = async () => {
    const uid = auth.currentUser.uid;
    try {
      const q = query(collection(db, "posts"), where("userId", "==", uid));
      const docSnap = await getDocs(q);
      const posts = [];
      docSnap.forEach((d) => {
        posts.push({ data: d.data(), id: d.id });
      });
      setgetPosts(posts);
      navigate(`/userProfile/${uid}`);
    } catch (e) {
      console.log(e);
    }
  };

  const logoutProfile = async (e) => {
    e.preventDefault();
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
      navigate("/login");
    } catch (e) {
      console.log(e.error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-wrapper">
        <img src={LOGO} className="brand-img" alt="" />
        <input type="text" className="search-box" placeholder="search" />
        <div className="nav-items">
          <img
            src={HOME}
            onClick={() => {
              navigate("/");
            }}
            className="icon"
            alt=""
          />
          <img src={MESSENGER} onClick={messageRoute} className="icon" alt="" />
          <label className="icon" htmlFor="img-upload">
            <img src={ADD} className="icon" alt="" />
            <input
              type="file"
              style={{ display: "none" }}
              id="img-upload"
              accept="image/*"
              onChange={UploadImg}
            />
          </label>
          <img src={EXPLORE} className="icon" alt="" />
          <img src={LIKE} className="icon" alt="logo" />
          <div
            className="icon user-profile"
            onClick={() => {
              isOpen
                ? (document.getElementById("dropdown_uniq").style.display =
                    "none")
                : (document.getElementById("dropdown_uniq").style.display =
                    "block");
              setIsOpen(!isOpen);
            }}
          >
            
            <img src={currentUserData[0]?.profileUrl || IMG} alt="profile" />
          
          </div>
          <div className="dropdown-content" id="dropdown_uniq">
            <lable className='drop-items' onClick={myProfile}>My Profile</lable>
           <lable htmlFor="pic-upload" className="drop-items">Upload Profile
            <input
              type="file"
              accept="image/*"
              onChange={profilepic}
              style={{ display: "none" }}
              id="pic-upload"
            />
            </lable>
            <a style={{textAlign:"center",borderTop:"1px solid #ddd"}} href="logout" onClick={logoutProfile}>
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
