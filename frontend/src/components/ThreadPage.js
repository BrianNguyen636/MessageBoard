import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchThreadPosts, deletePost, fetchUsers } from '../services/api';
import { useAuth } from '../context/AuthContext';

function ThreadPage() {
    const { id } = useParams(); // threadID
    const location = useLocation(); // Get thread title from LandingPage
    const navigate = useNavigate();
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);


    // Get the thread title from location.state (passed from LandingPage) or default to "Thread {id}"
    const threadTitle = location.state?.title || `Thread ${id}`;
    useEffect(() => {
        fetchThreadPosts(id)
            .then(data => {
                setPosts(data);
            })
            .catch(err => console.error("Error fetching posts:", err));
    }, [id]);



    useEffect(() => {
        fetchUsers()
            .then(data => {
                setUsers(data);
            })
            .catch(err => console.error("Error fetching users:", err));
    }, []);
    
    const getUsername = (userID) => {
        const user = users.find(u => u.userID === userID);
        return user ? user.username : `User ${userID}`;
    };

    const buttonClick = (event) => {
        event.stopPropagation();
    };

    // Navigate to PostPage when clicking on a post
    const handleViewPost = (post) => {
        navigate(`/post/${post.postID}`, { state: { selectedPost: post, threadTitle:threadTitle,  threadID: id } });
    };

    // Navigate to create-post page for replying to a specific post
    const handleReplyToPost = (postID) => {
        if (!user) {
            navigate('/login');
        } else {
            navigate(`/thread/${id}/create-post/${postID}`, {
                state: { title: threadTitle }
            });
        }
    };

    // Delete the post using the deletePost API function and update state
    const handleDeletePost = async (postID) => {
        try {
            await deletePost(postID);
            setPosts(prevPosts => prevPosts.filter(post => post.postID !== postID));
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    //filter out posts with replyID == first post .postID
    const firstPostID = posts.length > 0 ? posts[0].postID : null;
    const filteredPosts = posts.filter(post => post.replyID === firstPostID);

    return (
        <div>
            <h2>{threadTitle}</h2>

            {/* Show First Post as the Main Thread Body */}
            {posts.length > 0 && (
                <div style={{ 
                    border: "2px solid #444", 
                    backgroundColor: "#f9f9f9", 
                    padding: "15px", 
                    borderRadius: "10px", 
                    marginBottom: "20px" 
                }}>
                    <p>{posts[0].body}</p>
                    <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "#666", paddingTop: "5px" }}>
                        Posted by {getUsername(posts[0].userID)} at {new Date(posts[0].time).toLocaleString()}
                    </p>
                </div>
            )}

            <button onClick={() => handleReplyToPost(posts[0].postID)}>Reply to Thread</button>
            <h3 style={{ paddingTop: "20px" }}>Comments</h3>
            <ul>
                {filteredPosts.map(post => ( //  Only show non-reply posts
                    <li key={post.postID} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <div onClick={() => handleViewPost(post)}>
                            <p style={{ color: "blue", textDecoration: "underline" }}>{post.body}</p>
                            <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "#666", paddingTop: "5px" }}>
                                Posted by {getUsername(post.userID)} at {new Date(post.time).toLocaleString()}
                            </p>
                            <button onClick={(event) => { buttonClick(event); handleReplyToPost(post.postID); }}>Reply</button>
                            {user && parseInt(user.userID) === post.userID && (
                                <button onClick={(event) => { buttonClick(event); handleDeletePost(post.postID); }}>Delete</button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <Link to="/">Back to Threads</Link>
        </div>
    );
}

export default ThreadPage;
