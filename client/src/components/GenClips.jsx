import axios from 'axios';
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_GETCLIPS, QUERY_ME  } from '../utils/queries';
import { SAVE_CLIP, SAVE_AUDIO } from '../utils/mutations';
import Auth from '../utils/auth';

const GenClips = () => {
    
    const [voiceType, setVoiceType] = useState(["Male", "Female"]);
    const [selectedVoiceType, setSelectedVoiceType] = useState("Male");
    const [volume, setVolume] = useState(10);
    const [voiceSpeed, setVoiceSpeed] = useState(9);
    const [pitch, setPitch] = useState(1);
    const [text, setText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [sourceLang, setSourceLang] = useState("en");
    const [targetLang, setTargetLang] = useState("en");
    
    const API_KEY = 'AIzaSyCMJ05_dwlQH6ipqi-7lOuxRcSQYw2-n2Q';
    const XI_API_KEY = 'sk_1fa718e479887812560ae779d9acff5a07f721d8261d2837';
    
    //Prepare our mutation functions
    const [saveAudio] = useMutation(SAVE_AUDIO);
    const [saveClip] = useMutation(SAVE_CLIP);

    // Fetch user data from the GraphQL server
    const { loading: loadingUser, data:userData } = useQuery(QUERY_ME, {
      skip: !Auth.loggedIn(), // Only run if logged in
    });
    const username = userData?.me?.username || "";

    //Function to translate text from a source to destination language
    const translateText = async (myText) => {
        if (sourceLang === targetLang) {
            console.log("Will not translate!");
            setTranslatedText(myText);
            return myText;
        }
        console.log("Translating...");
        const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}&source=${sourceLang}&target=${targetLang}&q=${encodeURIComponent(myText)}`;

        try {
            const response = await axios.get(url);
            const translatedText = response.data.data.translations[0].translatedText;
            setTranslatedText(translatedText);
            return translatedText;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    };
  
    //Function to generate the voice data from the Elevenlabs API 
    const readText = async () => {
        const VOICE_ID = selectedVoiceType === "Male" ? 'pqHfZKP75CvOlQylNhV4' : 'Xb7hH8MSUJpSbSDYk0k2';
        const finalText = await translateText(text);
        setTranslatedText(finalText);

        if (!finalText) {
            alert("Please enter text to be read or translated.");
            return;
        }
    
        try {
            const response = await axios({
            method: 'post',
            url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            headers: {
            "Accept": "application/json",
            "xi-api-key": XI_API_KEY,
            "Content-Type": "application/json"
        },
        data: {
          text: finalText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.9,
            similarity_boost: 0.5,
            pitch: pitch
          }
        },
            responseType: 'arraybuffer'
        });
        return response.data;
        } catch (error) {
        console.error('Error generating speech:', error.response || error);
        }
    };

    //Function to playback voice data
    const TTSread = async () => {
        const voiceData = await readText();
        if (voiceData) {
          const audioBlob = new Blob([voiceData], { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.volume = volume / 10;
          audio.playbackRate = voiceSpeed / 10;
    
          audio.play().catch((error) => {
            console.error("Error playing audio:", error);
          });
        } else {
          console.error("Failed to retrieve voice data.");
        }
    };

    //Function the save voice data to a file
    const TTSsave = async () => {
            
      // Check if the user is logged in
      if (!Auth.loggedIn()) {
        alert('Please log in to save the audio file.');
      return;
      }

      const voiceData = await readText();
      if (voiceData) {
        const base64Audio = btoa(
            new Uint8Array(voiceData).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        try {
            console.log('Attempting to save file');
            
            // Save the audio data and get the generated file URL
            const { data: audioData } = await saveAudio({ variables: { audioData: base64Audio } });
            const fileUrl = audioData?.saveAudio?.fileUrl;

            if (fileUrl && fileUrl.includes('uploads')) {
                const startIndex = fileUrl.indexOf('uploads');
                const subpath = fileUrl.substring(startIndex);

                // Decode the base64 audio data to get the duration
                const audioBuffer = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();

                audioContext.decodeAudioData(audioBuffer.buffer)
                    .then(async (decodedData) => {
                        const duration = decodedData.duration; // Get the duration in seconds

                        // Define input data for the mutation, including the duration
                        const input = {
                            title: 'Voice Clip', // Replace with dynamic title if available
                            description: `Generated audio clip using ${selectedVoiceType} voice`, // Replace with dynamic description if available
                            userId: Auth.getProfile().data._id,
                            duration: Math.round(duration), // Round to nearest second if needed
                            audioURL: subpath, // Use the file URL returned from saveAudio
                            format: 'mp3',
                            date: new Date().toISOString(),
                        };

                        // Execute the SAVE_CLIP mutation
                        const { data } = await saveClip({
                            variables: { input },
                            refetchQueries: [{ query: QUERY_GETCLIPS, variables: { username } }],
                        });

                        if (data && data.saveClip) {
                            const { username, clipCount } = data.saveClip;
                            console.log(`Audio file saved successfully for user ${username}. Total clips: ${clipCount}`);
                            alert(`Audio file saved successfully!`);
                        } else {
                            console.error('Error saving audio.');
                        }
                    })
                    .catch(error => {
                        console.error('Error decoding audio data:', error);
                    });
              } else {
                console.error('Failed to get file URL from saveAudio.');
              }
          } catch (error) {
            console.error('Error saving audio:', error);
          }
      } else {
          console.error("Failed to retrieve voice data.");
      }
    };
    
    return (
        <div className="md:mt-20 md:px-20">
          <main className="border rounded-xl p-4 bg-indigo-950 max-w-[1200px] mx-2 md:mx-auto">
            <h1 className="mt-6 mb-12 text-3xl">VocaliseIt</h1>
            <section className="container">
              <div className="grid">
                <label className="" htmlFor="Voice">
                  Voice Options
                </label>
                <select
                  id="Voice"
                  value={selectedVoiceType}
                  onChange={(e) => setSelectedVoiceType(e.target.value)}
                >
                  {voiceType.map((voice, index) => (
                    <option key={index} value={voice}>
                      {voice}
                    </option>
                  ))}
                </select>
              </div>
    
              <div className="grid">
                <section>
                <textarea
                    id="ttsUserInput"
                    name="bio"
                    placeholder="Write something short and sweet to say..."
                    aria-label="Professional short bio"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  ></textarea>
                </section>
              </div>
    
              <details>
                <summary role="button" className="contrast outline noBorder">
                  Audio Output
                </summary>
                <div className="container-fluid centered">
                  <div className="">
                    <label htmlFor="volume">Volume Control</label>
                    <input
                      type="range"
                      id="volume"
                      min="0"
                      max="10"
                      step="1"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                    />
                  </div>
    
                  <div className="">
                    <label htmlFor="speed">Voice Speed Control</label>
                    <input
                      type="range"
                      id="speed"
                      min="0"
                      max="15"
                      step="3"
                      value={voiceSpeed}
                      onChange={(e) => setVoiceSpeed(e.target.value)}
                    />
                  </div>
    
                  <div className="">
                    <label htmlFor="pitch">Pitch Control</label>
                    <input
                      type="range"
                      id="pitch"
                      min="0"
                      max="2"
                      step="0.5"
                      value={pitch}
                      onChange={(e) => setPitch(e.target.value)} />
                  </div>
                </div>
              </details>
    
              <details>
                <summary role="button" className="contrast outline noBorder">
                  Translation Options
                </summary>
                <div className="grid">
                  <label>Translate From</label>
                  <select
                    id="TranslateFrom"
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                    <option value="ar">Arabic</option>
                  </select>
    
                  <label>Translate To</label>
                  <select
                    id="TranslateTo"
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
                <section>
                  <textarea
                    id="langOutput"
                    name="disabled"
                    value={translatedText}
                    onChange={(e) => setTranslatedText(e.target.value)}
                    disabled
                  ></textarea>
                </section>
              </details>
              <div className="button-group">
              <button id="readBtn" className="read-button" onClick={ TTSread }>
                Read!
              </button>
              <button id="saveBtn" className="save-button" onClick={ TTSsave }>
                Save voice clip!
              </button>
              </div>
            </section>
          </main>
        </div>
    );
    
}

export default GenClips;