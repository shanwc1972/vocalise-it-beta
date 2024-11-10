import React, { useEffect, useState, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Auth from '../utils/auth';


import { QUERY_GETCLIPS, QUERY_ME  } from '../utils/queries';
import { REMOVE_CLIP } from '../utils/mutations';

//import viteConfig from '../vite.config.js';

const SavedClips = () => {
    // State to hold the list of clips
    const [clips, setClips] = useState([]);

    // Fetch user data from the GraphQL server
    const { loading: loadingUser, data:userData } = useQuery(QUERY_ME, {
        skip: !Auth.loggedIn(), // Only run if logged in
    });
    // Fetch the user's clips from the server
    const username = userData?.me?.username || "";

    // Fetch clips only when user data and username is available
    const { loading: loadingClips, data: clipsData } = useQuery(QUERY_GETCLIPS, {
        variables: { username },
        skip: !username,
    });

    const [removeClip] = useMutation(REMOVE_CLIP);

    // Update the clips state when clipsData changes
    useEffect(() => {
        if (clipsData && clipsData.getClips) {
            setClips(clipsData.getClips);
        }
    }, [clipsData]);

    //Function that removes the clip of the delete button is selected
    const handleRemove = async (clipId) => {
        console.log(clipId);
        try {
            await removeClip({
                variables: { clipId },
                refetchQueries: [{ query: QUERY_GETCLIPS, variables: { username } }],
            });
        } catch (error) {
            console.error("Error deleting clip:", error);
        }
    };

    //Function that plays the audio data from the play link
    const playClip = async (audioUrl) => {
        // Construct the full server URL
        const serverhost = 'localhost';
        const serverport = '3001';
        const serverUrl = `http://${serverhost}:${serverport}`;
        const fullURL = `${serverUrl}/${audioUrl}`
        console.log(`Attempting to play: ${fullURL}`)
        try {
            // Fetch the audio data from the provided URL
            const response = await fetch(fullURL);
            if (!response.ok) {
                throw new Error('Failed to fetch audio data');
            }
    
            const audioBlob = await response.blob();
            const audio = new Audio(URL.createObjectURL(audioBlob));
            
            audio.play().catch((error) => {
                console.error("Error playing audio:", error);
            });
        } catch (error) {
            console.error("Error fetching and playing audio:", error);
        };
    }

    const downloadClip = async (audioUrl) => {
        alert('Not implemented as yet')
    }

    if (loadingUser || loadingClips) return <p>Loading...</p>;

    return (
        <div className="myClipsContainer">
            <h2 className="clipsheader">Hello {username}, here are your saved clips</h2>
            <ul className="clipsList">
            {clips.map((clip, index) => (
                <li key={index} className="clip-item">
                    <div className="Metadata-group">
                        <strong>Title: {clip.title}</strong><br />
                        <small>{clip.description}</small><br />
                        Duration: {clip.duration} seconds<br />
                    </div>
                    <div className="Button-group">
                        <button onClick={() => playClip(clip.audioURL)}>Play</button>
                        <button onClick={() => downloadClip(clip.audioURL)}>Download (subscription required)</button>
                        <button onClick={() => handleRemove(clip._id)}>Delete</button>
                    </div>
                </li>
            ))}
            </ul>
        </div>
    );
    
}

export default SavedClips;