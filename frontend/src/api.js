const API_URL = 'http://localhost:3000';

export async function fetchThreads() {
    const res = await fetch(`${API_URL}/threads`);
    return res.json();
}

export async function fetchThreadPosts(threadId) {
    const res = await fetch(`${API_URL}/threads/${threadId}/posts`);
    return res.json();
}

export async function loginUser(username, password) {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return res.json();
}

export async function signupUser(username, password) {
    const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return res.json();
}

export async function createThread(userID, title, body) {
    const res = await fetch(`${API_URL}/threads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID, title, body })
    });
    return res.json();
}

export async function createPost(userID, threadID, replyID, body) {
    const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID, threadID, replyID, body })
    });
    return res.json();
}

export async function deletePost(postID) {
    const response = await fetch(`${API_URL}/posts/${postID}`, {
        method: 'DELETE'
    });
    // The backend returns JSON like { Success: "Post 123 successfully deleted" }
    return response.json();
}
