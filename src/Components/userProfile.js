import NavBar from "./nav";
import IMG from "../profile.jpg"
import { useParams } from "react-router";
import { useContextProvoider } from "../context";
import { useEffect, useState } from "react";
const UserProfile = () => {
    const {getPosts , usersData}= useContextProvoider();
    const {id}=useParams();
    const [profileUser,setProfileUser]=useState();
    // console.log(usersData)

    useEffect(()=>{
        const getUser=()=>{
            usersData.forEach(user=>{
            if(user.id===id){
                // console.log(user)
                setProfileUser(user)
            }
        })
        // const result = usersData.filter((user)=>user.id===id)
        // setProfileUser(result)
    }
        return getUser();
    },[usersData])
    return ( <div>
        <NavBar/>
        <div className="profile-container">
        <div className="profile-header">
            <div className="header-container">
            <div className="user-profile">
                <img src={profileUser?.profileUrl || IMG} alt="Profile-picture"/>
            </div>
            <div className="user-details">
                {profileUser?<h1>{profileUser.username}</h1>:<h1>NO NAME</h1>}
                <div className="post-followers">
                    <div><span>{profileUser?.posts?.length}</span> posts</div>
                    <div><span>299</span> followers</div>
                    <div><span>299</span> following</div>
                </div>
                <p>{profileUser?.email}</p>
            </div>
            </div>
        </div>
        <div className="profile-buttons">
            <div className="profilebutton">POSTS</div>
            <div className="profilebutton">SAVED</div>
            <div className="profilebutton">TAGGED</div>
        </div>
        <div className="user-posts" >
        {getPosts && getPosts.map(post=>(
            <div className="post" key={post.id}>
                <img src={post.data.posturl} alt='post-img'/>
            </div>
        ))}
        </div>
        </div>
    </div> );
}
 
export default UserProfile;