import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createThread } from '../api';
import { useAuth } from '../AuthContext';

function CreateThread() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await createThread(user.userID, title, body);
            if (result.error) {
                setError(result.error);
            } else {
                navigate('/');
            }
        } catch (err) {
            setError("Error creating thread");
        }
    };

    return (
        <div>
            <h2>Create New Thread</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title: </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Opening Post: </label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit">Create Thread</button>
            </form>
        </div>
    );
}

export default CreateThread;
