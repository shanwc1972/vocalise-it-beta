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
    // Fetch the user's status
    let subscribedStatus = userData?.me?.isSubscribed;
    console.log(`isSubscribedstaus: ${subscribedStatus}`);

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
    const serverUrl = import.meta.env.VITE_SERVER_API;
    console.log(import.meta.env);
    //Function that plays the audio data from the play link
    const playClip = async (audioUrl) => {
        // Construct the full server URL

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

    const downloadClip = async (audioUrl, filename = 'audio-clip.mp3') => {
        if (subscribedStatus == true) {
            try {
                const fullURL = `${serverUrl}/${audioUrl}`
                const response = await fetch(fullURL);
                if (!response.ok) throw new Error('Failed to fetch audio data');
    
                const fileData = await response.blob();
                const link = document.createElement('a');
                link.href = URL.createObjectURL(fileData);
                link.download = filename;
                link.click();
                
                // Clean up the URL object after download to avoid memory leaks
                URL.revokeObjectURL(link.href);
            } catch (error) {
                console.error("Error downloading audio:", error);
            }
        } else {
            alert('This function is limited to premium subscribers only');
        }
    }

    if (loadingUser || loadingClips) return <p>Loading...</p>;

    return (
        <div className="myClipsContainer">
        <h2 className="clipsheader">Hello {username}, here are your saved clips</h2>
        
        {clips.length === 0 ? (
            <p>You have no clips.</p>
        ) : (
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
                            <button onClick={() => downloadClip(clip.audioURL, `${clip.title}.mp3`)}>Download (subscription required)</button>
                            <button onClick={() => handleRemove(clip._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </div>
    );
}

export default SavedClips;