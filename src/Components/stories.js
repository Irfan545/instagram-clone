// import IMG from '../profile.jpg'
import PostsCard from './Posts';
import IMG from '../img/cover 1.png'
import { useContextProvoider } from '../context';
import NavBar from './nav';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseconfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router';

const Stories = () => {
    const {usersData,currentUserData}=useContextProvoider();
    const navigate=useNavigate();
    console.log(currentUserData)
    const Logout = async (e) => {
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
          navigate("/login")
        } catch (e) {
          console.log(e.error);
        }
      };

    return (
        
    //     <div className='story-div'>
    //       <div className='story'>
    //           <img src={IMG} alt='img'/>
    //           <div className='story-name'>
    //           <p>name</p>
    //           </div>
    //       </div>
    //   </div>
    <>

    <NavBar />
    <section className="main">
      <div className="wrapper">
        <div className="left-col">
          {/* <!-- status started --> */}

          <div className="status-wrapper">
            {usersData && usersData.map(user=>(
                <div className="status-card" key={user.id}>
                <div className="profile-pic">
                  <img src={IMG} alt="" />
                </div>
                <p className="username">{user.username}</p>
              </div>
            ))}
          
            {/* <!-- // +5 more status card elements. --> */}
          </div>
          {/* <!-- status ended --> */}
          <PostsCard/>
          {/* <!-- posts --> */}
          {/* <!-- posts ended --> */}
        </div>
        {/* <!-- left section ended --> */}
        {/* <!-- right section start --> */}
        {currentUserData && <div className="right-col">
            <div className="profile-card">
                <div className="profile-pic">
                    <img src="img/profile-pic.png" alt=""/>
                </div>
                <div>
                    <p className="username">{currentUserData.email}</p>
                    <p className="sub-text">{currentUserData.username}</p>
                </div>
                <button className="action-btn" onClick={Logout}>Logout</button>
            </div>
            <p className="suggestion-text">Suggestions for you</p>
            <div className="profile-card">
                <div className="profile-pic">
                    <img src="img/cover 9.png" alt=""/>
                </div>
                <div>
                    <p className="username">modern_web_channel</p>
                    <p className="sub-text">followed bu user</p>
                </div>
                <button className="action-btn">follow</button>
            </div>
            <div className="profile-card">
                <div className="profile-pic">
                    <img src="img/cover 10.png" alt=""/>
                </div>
                <div>
                    <p className="username">modern_web_channel</p>
                    <p className="sub-text">followed bu user</p>
                </div>
                <button className="action-btn">follow</button>
            </div>
            <div className="profile-card">
                <div className="profile-pic">
                    <img src="img/cover 11.png" alt=""/>
                </div>
                <div>
                    <p className="username">modern_web_channel</p>
                    <p className="sub-text">followed bu user</p>
                </div>
                <button className="action-btn">follow</button>
            </div>
            <div className="profile-card">
                <div className="profile-pic">
                    <img src="img/cover 12.png" alt=""/>
                </div>
                <div>
                    <p className="username">modern_web_channel</p>
                    <p className="sub-text">followed bu user</p>
                </div>
                <button className="action-btn">follow</button>
            </div>
            <div className="profile-card">
                <div className="profile-pic">
                    <img src="img/cover 13.png" alt=""/>
                </div>
                <div>
                    <p className="username">modern_web_channel</p>
                    <p className="sub-text">followed bu user</p>
                </div>
                <button className="action-btn">follow</button>
            </div>
        </div>}
        {/* <!-- right section ennded --> */}

      </div>
    </section>
    </>
      );
}
 
export default Stories;