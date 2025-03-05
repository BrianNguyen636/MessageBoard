import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPost } from '../api';
import { useAuth } from '../AuthContext';

function CreatePost() {
    const { id, replyID } = useParams();
    const [body, setBody] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        // If no user is logged in, redirect or show error
        navigate('/login');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // The "replyID" might be undefined if we're just replying to the thread
            await createPost(
                user.userID,
                id,            // threadID
                replyID || null, // pass null if no replyID
                body
            );
            // After creation, go back to the thread
            navigate(`/thread/${id}`);
        } catch (err) {
            console.error("Error creating post:", err);
        }
    };

    return (
        <div>
            <h2>Reply</h2>
            <form onSubmit={handleSubmit}>
                <label>Reply:</label>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                />
                <button type="submit">Post Reply</button>
            </form>
        </div>
    );
}

export default CreatePost;
