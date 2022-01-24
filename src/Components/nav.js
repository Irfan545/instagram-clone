import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebaseconfig";
import LOGO2 from "../logo2.png";
import LOGO from "../img/logo.PNG";
import HOME from "../img/home.PNG";
import MESSENGER from "../img/messenger.PNG";
import ADD from "../img/add.PNG";
import EXPLORE from "../img/explore.PNG";
import LIKE from "../img/like.PNG";
import { useContextProvoider } from "../context";
import { useState } from "react";
const NavBar = () => {
  const { currentUserData, setgetPosts, usersData ,load ,setload } = useContextProvoider();
  const [isOpen, setIsOpen] = useState(false);
  const [pload,setpload] = useState(false);
  // const [profilepic,setprofilepic]=useState();
  const navigate = useNavigate();
  const messageRoute = () => {
    if(usersData){
      navigate("/chats");
    }
  };

  const UploadImg = async (e) => {
    setpload(true)
    if (e?.target?.files[0]) {
      const imgDetails = e?.target?.files[0];
      
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
      
    }
    setpload(false)
  };

  const profilepic = async (e) => {
    setpload(true)
    if(e?.target?.files[0]){
      const imgDetails = e.target.files[0];
      
      const storageRef = ref(
        storage,
        `profile-pics/${auth.currentUser.uid}-${Timestamp.fromDate(new Date())}`
      );
      await uploadBytes(storageRef, imgDetails);
      const Profile_url = await getDownloadURL(storageRef, imgDetails.name);
      await updateDoc(doc(db,"users",auth.currentUser.uid),{
        profileUrl:Profile_url,
      })
      const batch=writeBatch(db);

      const collectionRef= collection(db,'posts')
      
     batch.update(collectionRef,{
        profilePicture:Profile_url,
      })
      setpload(false)
    }
    setpload(false)
  };

  const myProfile = async () => {
    setpload(true)
    const uid = auth.currentUser.uid;
    try {
      const q = query(collection(db, "posts"), where("userId", "==", uid));
      const docSnap = await getDocs(q);
      const posts = [];
      docSnap.forEach((d) => {
        posts.push({ data: d.data(), id: d.id });
      });
      setgetPosts(posts);
      setpload(false)
      navigate(`/userProfile/${uid}`);
    } catch (e) {
      
      setpload(false)
    }
  };

  const logoutProfile = async () => {
    // e.preventDefault();
    setload(true)
    try {
      
      const userId = auth.currentUser.uid;
      const docRef = doc(db, "users", userId);
      const payload = {
        isOnline: false,
        lastSeen: Timestamp.fromDate(new Date())
      };
      await updateDoc(docRef, payload);
      await signOut(auth);
      setload(false)
      navigate("/login");
    } catch (e) {
      setload(false)
      (e.error);
    }
  };

  return (
    <>
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
            
            <img src={LOGO2} alt="logo" />
          
          </div>
          <div className="dropdown-content" id="dropdown_uniq">
            <label className='drop-items' onClick={myProfile}>My Profile</label>
            <div>
           <label htmlFor="pic-upload" className="drop-items">Upload Profile
            <input
              type="file"
              accept="image/*"
              onChange={profilepic}
              style={{ display: "none" }}
              id="pic-upload"
            />
            </label>
            </div>
            <label onClick={logoutProfile} className="drop-items">
              Logout
            </label>
          </div>
        </div>
      </div>
    </nav>
  
    </>
  );
};

export default NavBar;
