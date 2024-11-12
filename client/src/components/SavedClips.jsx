import React, { useEffect, useState, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { FaPlay, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';


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
            toast.error('This function is limited to premium subscribers only');
        }
    }

    if (loadingUser || loadingClips) return <p>Loading...</p>;

    return (
        <div className="w-4/5 max-w-lg bg-gray-700 p-5 rounded-lg shadow-lg block mx-auto mt-12">
            <h2 className="clipsheader text-2xl font-bold mb-4">{username}'s clips</h2>
            
            {clips.length === 0 ? (
                <p className="text-gray-600">You have no clips.</p>
            ) : (
                <ul className="clipsList space-y-4">
                    {clips.map((clip, index) => (
                        <li key={index} className="mb-2.5 list-none text-left flex-col p-4 bg-gray-400 rounded-lg shadow-sm flex justify-between items-left">
                            <div className="metadata-group">
                                <strong className="text-lg text-blue-950">{clip.title}</strong><br />
                                <small className="text-blue-950">{clip.description}</small><br />
                                <span className="text-blue-950">Duration: {clip.duration} second{clip.duration !== 1 ? 's' : ''}</span><br />
                            </div>
                            <div className="button-group space-x-2">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => playClip(clip.audioURL)}><FaPlay /></button>
                                {subscribedStatus ? (
                                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={() => downloadClip(clip.audioURL, `${clip.title}.mp3`)}>Download</button>
                                ) : (
                                    <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed"
                                    ><Link to="../subscribe" >Download</Link></button>
                                )}
                                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => handleRemove(clip._id)}><FaTrash /></button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SavedClips;