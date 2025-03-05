import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchThreads } from '../services/api';

function LandingPage() {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    fetchThreads()
        .then(data => {
          setThreads(data);
        })
        .catch(err => {
          console.error("Error fetching threads:", err);
        });
  }, []);

  return (
      <div>
        <h2>All Threads</h2>
        {threads.length === 0 ? (
            <p>No threads available.</p>
        ) : (
            <ul>
                {threads.map(thread => (
                    <li key={thread.threadID}>
                        <Link
                            to={`/thread/${thread.threadID}`}
                            state={{ title: thread.title }}
                        >
                            {thread.title}
                        </Link>
                    </li>
                ))}
            </ul>
        )}
      </div>
  );
}

export default LandingPage;
