import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchThreadPosts, deletePost } from '../services/api';
import { useAuth } from '../context/AuthContext';

function ThreadPage() {
    const { id } = useParams(); // threadID
    const location = useLocation(); // to get thread title passed from LandingPage
    const navigate = useNavigate();
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);

    // Get the thread title from location.state (passed from LandingPage) or default to "Thread {id}"
    const threadTitle = location.state?.title || `Thread ${id}`;

    useEffect(() => {
        fetchThreadPosts(id)
            .then(data => setPosts(data))
            .catch(err => console.error("Error fetching posts:", err));
    }, [id]);

    // Navigate to create-post page for replying to the entire thread (no replyID)
    const handleCreatePost = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate(`/thread/${id}/create-post`, {
                state: { title: threadTitle }
            });
        }
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
            // Remove the deleted post from the local state to update the UI
            setPosts(prevPosts => prevPosts.filter(post => post.postID !== postID));
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    return (
        <div>
            <h2>{threadTitle}</h2>
            <button onClick={handleCreatePost}>Reply to Thread</button>
            <ul>
                {posts.map(post => (
                    <li key={post.postID}>
                        <p>{post.body}</p>
                        <p>
                            <em>
                                Posted by User {post.userID} at {new Date(post.time).toLocaleString()}
                            </em>
                        </p>
                        <button onClick={() => handleReplyToPost(post.postID)}>
                            Reply
                        </button>
                        {user && parseInt(user.userID) === post.userID && (
                            <button onClick={() => handleDeletePost(post.postID)}>
                                Delete
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            <Link to="/">Back to Threads</Link>
        </div>
    );
}

export default ThreadPage;
