import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchThreadPosts, deletePost, fetchUsers } from '../services/api';

function PostPage() {
    const { id } = useParams(); // postID
    const location = useLocation(); // Get data from navigation state
    const navigate = useNavigate();
    const { user } = useAuth();

    // Extract selected post and all posts from ThreadPage navigation state
    const [post, setPost] = useState(location.state?.selectedPost || null);
    const [posts, setPosts] = useState([]);
    const [threadID, setThreadID] = useState(location.state?.threadID || null);
    const [threadTitle, setThreadTitle] = useState(location.state?.threadTitle || "Thread");
    const [users, setUsers] = useState([]);
    

    useEffect(() => {
        fetchThreadPosts(threadID)
            .then(data => {
                setPosts(data);
            })
            .catch(err => console.error("Error fetching posts:", err));
    }, [threadID]);

    useEffect(() => {
        if (!post) {
            fetch(`http://localhost:3000/posts/${id}`)
                .then(res => res.json())
                .then(data => setPost(data))
                .catch(err => console.error("Error fetching post:", err));
        }
    }, [id, post]);

    useEffect(() => {
        if (location.state?.selectedPost) {
            setPost(location.state.selectedPost);
        } else {
            fetch(`http://localhost:3000/posts/${id}`)
                .then(res => res.json())
                .then(data => setPost(data))
                .catch(err => console.error("Error fetching post:", err));
        }
    }, [id, location.state]);


    
    useEffect(() => {
        fetchUsers()
            .then(data => {
                console.log("users Data:", data);
                setUsers(data);
            })
            .catch(err => console.error("Error fetching users:", err));
    }, []);

    
    const getUsername = (userID) => {
        const user = users.find(u => u.userID === userID);
        return user ? user.username : `User ${userID}`;
    };
    

    // Get replies by filtering posts where replyID matches the current post ID
    const replies = posts.filter(p => p.replyID === post?.postID);

    // Navigate to create-post page for replying to a specific post
    const handleReplyToPost = (postID) => {
        if (!user) {
            navigate('/login');
        } else {
            navigate(`/thread/${threadID}/create-post/${postID}`, {
                state: { title: threadTitle }
            });
        }
    };

    // Delete the post using the deletePost API function and update state
    const handleDeletePost = async (postID) => {
        try {
            await deletePost(postID);
            setPosts(prevPosts => prevPosts.filter(post => post.postID !== postID));
            if (postID === post?.postID) {
                navigate(`/thread/${threadID}`); // Redirect back to thread if main post is deleted
            }
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    const handleViewPost = (post) => {
        console.log(post)
        navigate(`/post/${post.postID}`, { state: { selectedPost: post, threadTitle:threadTitle,  threadID: threadID } });
    };

    return (
        <div>
            <h2>{threadTitle} - Post Details</h2>

            {/* Display Main Post */}
            {post && (
                <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
                    <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{post.body}</p>
                    <p>
                        <em>Posted by {getUsername(post.userID)} at {new Date(post.time).toLocaleString()}</em>
                    </p>
                    <button onClick={() => handleReplyToPost(post.postID)}>Reply</button>
                    {user && parseInt(user.userID) === post.userID && (
                        <button onClick={() => handleDeletePost(post.postID)} style={{ marginLeft: "10px", color: "red" }}>
                            Delete
                        </button>
                    )}
                </div>
            )}

            <h3>Replies</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {replies.map(reply => (
                    <li key={reply.postID} style={{ borderBottom: "1px solid #ddd", padding: "10px 0", cursor: "pointer" }}>
                        <div onClick={() => handleViewPost(reply)}>
                            <p style={{ color: "blue", textDecoration: "underline" }}>{reply.body}</p>
                            <p>
                                <em>Posted by {getUsername(reply.userID)} at {new Date(reply.time).toLocaleString()}</em>
                            </p>
                        </div>
                        <button onClick={() => handleReplyToPost(reply.postID)}>Reply</button>
                        {user && parseInt(user.userID) === reply.userID && (
                            <button onClick={() => handleDeletePost(reply.postID)} style={{ marginLeft: "10px", color: "red" }}>
                                Delete
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            <Link to={`/thread/${threadID}`}>Back to Thread</Link>
        </div>
    );
}

export default PostPage;
