import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';
import { useAuth } from '../context/AuthContext';

function CreatePost() {
    const { id, replyID } = useParams();       // threadID, optional replyID
    const location = useLocation();            // get route state
    const navigate = useNavigate();
    const { user } = useAuth();

    // The title was passed from ThreadPage:
    const threadTitle = location.state?.title || `Thread ${id}`;

    const [body, setBody] = useState('');

    if (!user) {
        // If user is not logged in, redirect or show error
        navigate('/login');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create the new post
            await createPost(user.userID, id, replyID || null, body);
            // After success, navigate back to /thread/:id
            // and pass the same title back in state
            navigate(`/thread/${id}`, {
                state: { title: threadTitle }
            });
        } catch (err) {
            console.error('Error creating post:', err);
        }
    };

    
    

    return (
        <div>
            <h2>Reply to: {threadTitle}</h2>
            <form onSubmit={handleSubmit}>
                <label>Body:</label>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreatePost;
