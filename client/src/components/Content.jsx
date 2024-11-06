import { useState, useEffect } from "react";

const Content = () => {
  const [voiceType, setVoiceType] = useState(["Male", "Female"]);
  const [selectedVoiceType, setSelectedVoiceType] = useState("Male");

  const [volume, setVolume] = useState(10);
  const [voiceSpeed, setVoiceSpeed] = useState(15);
  const [pitch, setPitch] = useState(2);


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
              <select id="TranslateFrom">
                <option value="en" disabled>
                  Translate From
                </option>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
                <option value="ar">Arabic</option>
              </select>
              <select id="TranslateTo">
                <option value="en" disabled>
                  Translate To
                </option>
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
                value="Translated text will show here..."
                disabled
              ></textarea>
            </section>
          </details>
          <div class="button-group">
          <button id="readBtn" className="container-fluid" class="read-button">
            Read!
          </button>
          <button id="saveBtn" className="container-fluid" class="save-button">
            Save voice clip!
          </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Content;
