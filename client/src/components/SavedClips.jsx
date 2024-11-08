import React, { useEffect, useState, useContext } from 'react';
import jwt_decode from "jwt-decode";
import Auth from '../utils/auth'

const SavedClips = () => {
    // State to hold the list of clips
    const [clips, setClips] = useState([]);

    const [username, setUsername] = useState("");

    useEffect(() => {
        if (Auth.loggedIn()) { // Check if the user is logged in
          const token = Auth.getToken();
          const decoded = jwt_decode(token);
          setUsername(decoded.data.username); // Assuming the token includes the username field
        }
    }, []);

    // Use useEffect to set the placeholder clips when the component mounts
    useEffect(() => {
    // Placeholder clips for demonstration
    const placeholderClips = [
        { title: 'Clip 1', description: 'This is my first clip', audioUrl: '#' },
        { title: 'Clip 2', description: 'Another saved clip', audioUrl: '#' },
    ];

    // Set the placeholder clips to state
    setClips(placeholderClips);
    }, []);

    return (
        <div>
            <h2>Hello {username}, here are your saved clips</h2>
            <ul id="clipsList">
            {clips.map((clip, index) => (
                <li key={index} className="clip-item">
                <strong>{clip.title}</strong><br />
                {clip.description}<br />
                <a href={clip.audioUrl} target="_blank" rel="noopener noreferrer">Play</a>
                <br />
                <a href={clip.audioUrl} target="_blank" rel="noopener noreferrer">
                    Download (subscription required)
                </a>
                </li>
            ))}
            </ul>
        </div>
    );
    
}

export default SavedClips;