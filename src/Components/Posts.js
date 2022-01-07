import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import { auth, db } from "../firebaseconfig";
import IMG from "../profile.jpg";
import PNG from "../heart.png"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useContextProvoider } from "../context";
const PostsCard = () => {
  const [Posts, setPosts] = useState();
  const [liked, setliked] = useState(false);
  const [buttonDisable,setbuttonDisable]=useState(false);
  const commentRef=useRef();
  const {setgetPosts} = useContextProvoider();
  const navigate = useNavigate();
//   console.log(Posts);

  useEffect(() => {
    const getPosts = async () => {
      const q = query(collection(db, "posts"), orderBy("uploadedAt", "desc"));
      onSnapshot(q, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id });
        });

        setPosts(posts);
      });
    };
    getPosts();
  }, []);
//   console.log(Posts);
  const handlelike = async (id, allLikes) => {
    // e.preventDefalut()
    const userid = auth.currentUser.uid;
    if (allLikes.includes(userid)) {
      setliked(false);
      await updateDoc(doc(db, "posts", id), {
        likes: arrayRemove(userid)
      });
    } else {
      setliked(true);
      await updateDoc(doc(db, "posts", id), {
        likes: arrayUnion(userid)
      });
    }
  };

const handleComment=async(id,postcomments)=>{
setbuttonDisable(true);
const currentUserId=auth.currentUser.uid
const comment=commentRef.current.value
await updateDoc(doc(db,"posts",id),{
  comments:arrayUnion({id:currentUserId,usercomment:comment,userProfile:""})
})
commentRef.current.value=null;
setbuttonDisable(false)
}
const gotoProfile=async(userid)=>{
 try{
  const q = query(collection(db, "posts"), where("userId", "==", userid));
  const docSnap = await getDocs(q);
  const posts = [];
  //  console.log(docSnap.data())
  docSnap.forEach((d) => {
    //  console.log(d.data())
    posts.push({data:d.data(),id:d.id});
  });
  setgetPosts(posts);
  navigate(`/userProfile/${userid}`)
 }catch(e){
   console.log(e)
 }
}
  return (
    <div>
      {Posts &&
        Posts.map((post) => (
          <div key={post.id} className="posts-div">
            <div className="post-head">
              <div className="user">
                <img src={IMG} alt="img" />
                <p className="profile-name" onClick={()=>{gotoProfile(post.userId)}}>{post.username}</p>
              </div>
              <div>...</div>
            </div>
            <div className="user-post">
              <img src={post.posturl} alt="Post" />
            </div>
            <div className="reaction-div">
              <div className="like-share-comment">
                <div
                  className="icon"
                  onClick={() => {
                    handlelike(post.id, post.likes);
                  }}
                >
					{/* <img style={{width:"24px",height:"24px",fill:"orange"}} src={PNG}/> */}
                  <svg
                    aria-label="Like"
                    // class="_8-yf5 "
					color={liked?"#ed4956":"#262626"}
                    fill={liked?"#ed4956":"#262626"}
					
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                    // className='liked'
                  >
                    <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
                  </svg>
                </div>
                <div className="icon">
                  <svg
                    aria-label="Comment"
                    // class="_8-yf5 "
                    color="#262626"
                    fill="#262626"
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path
                      d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z"
                      fill="none"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </div>
                <div className="icon">
                  <svg
                    aria-label="Share Post"
                    // class="_8-yf5 "
                    color="#262626"
                    fill="#262626"
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="22"
                      x2="9.218"
                      y1="3"
                      y2="10.083"
                    ></line>
                    <polygon
                      fill="none"
                      points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></polygon>
                  </svg>
                </div>
              </div>
              <div className="save">
                <svg
                  aria-label="Save"
                  // class="_8-yf5 "
                  color="#262626"
                  fill="#262626"
                  height="24"
                  role="img"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <polygon
                    fill="none"
                    points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></polygon>
                </svg>
              </div>
            </div>
            {/* /*reaction div end*/}
            <div className="description">
              <p className="num-likes">{post.likes.length} Likes</p>
              <div className="page-name">
                <p> Pagedfkjsahfkasjhfaskfhaskdshfskljfhsakffsahfkas</p>
              </div>
              <p className="comments-link"> View {post.comments.length} comments</p>
              <small>
                <Moment fromNow>{post.uploadedAt.toDate()}</Moment>
              </small>
            </div>
            <div className="comment-sec">
              <div className="comment-elements">
                <svg
                  aria-label="Emoji"
                  // class="_8-yf5 "
                  color="#262626"
                  fill="#262626"
                  height="24"
                  role="img"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-6.5 1.167a1.167 1.167 0 10-1.166 1.167 1.167 1.167 0 001.166-1.167zm5.163 3.24a3.406 3.406 0 01-4.982.007 1 1 0 10-1.557 1.256 5.397 5.397 0 008.09 0 1 1 0 00-1.55-1.263zM12 .503a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012 .503zm0 21a9.5 9.5 0 119.5-9.5 9.51 9.51 0 01-9.5 9.5z"></path>
                </svg>
                <input ref={commentRef} placeholder="Add comment" />
                <button onClick={()=>{handleComment(post.id,post.comments)}} className="post-btn" disabled={buttonDisable}>Post</button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PostsCard;
