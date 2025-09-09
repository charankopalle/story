import { useState, useEffect } from 'react';
import './App.css';
import { FaInstagram, FaYoutube, FaWhatsapp, FaTwitter, FaGithub } from 'react-icons/fa';

// AdSense Component
const AdBanner = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2508523131488747";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
  }, []);

  return (
    <ins className="adsbygoogle"
         style={{ display: 'block', textAlign: 'center', margin: '20px 0' }}
         data-ad-client="ca-pub-2508523131488747"
         data-ad-slot="1234567890"  // <-- Replace with your actual ad slot
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  );
};

const App = () => {
    const [prompt, setPrompt] = useState('');
    const [story, setStory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const generateStory = async () => {
        setStory('');
        setError('');

        if (!prompt) {
            setError('Please enter a prompt to get started.');
            return;
        }

        setIsLoading(true);
        let chatHistory = [];
        chatHistory.push({
            role: "user",
            parts: [{
                text: `You are a creative writing partner. Expand on the following story idea. Write a compelling and detailed narrative. 
                \nStory idea: ${prompt}`
            }]
        });

        const apiKey = "YOUR_API_KEY"; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=AIzaSyDswTPixo6MyvYt-14BQkDD-CAdQBabNrE`;

        try {
            const payload = { contents: chatHistory };
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const generatedText = result.candidates[0].content.parts[0].text;
                setStory(generatedText);
            } else {
                setError('No story was generated. Please try a different prompt.');
            }
        } catch (e) {
            console.error('Failed to generate story:', e);
            setError('An error occurred while generating the story. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container">
            
            {/* Header */}
            <header className="app-header">
                <h1 className="site-title">StoryForge AI</h1>
            </header>

            <div className="main-content">
                <h1 className="main-title">AI Story Writing Assistant</h1>
                <p className="description-text">
                    Enter a story idea or a starting sentence and let the AI help you write.
                </p>

                <div className="input-area">
                    <textarea
                        className="prompt-textarea"
                        rows="4"
                        placeholder="e.g., A lone soldier finds a mysterious letter that was never delivered..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    ></textarea>
                </div>
                
                <button
                    onClick={generateStory}
                    disabled={isLoading}
                    className={`generate-button ${isLoading ? 'loading' : ''}`}
                >
                    {isLoading ? (
                        <span className="loading-text">
                            <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </span>
                    ) : 'Generate Story'}
                </button>

                <div className="output-section">
                    {error && (
                        <div className="error-message" role="alert">
                            <span className="block-message">{error}</span>
                        </div>
                    )}
                    {story && (
                        <div className="story-output">
                            <h2 className="output-title">Your Generated Story</h2>
                            <p className="story-text">{story}</p>
                        </div>
                    )}

                    {/* AdSense banner */}
                    <AdBanner />
                </div>
            </div>
            
            {/* Footer */}
            <footer className="app-footer">
                <p>Connect with us:</p>
                <div className="social-icons">
                    <a href="https://www.instagram.com/codecurx?igsh=MTg2MHc5azJoeXZ0Zw==" target="_blank" rel="noreferrer"><FaInstagram /></a>
                    <a href="https://youtube.com/@codecurx?si=Rn8u1vekacaLREgf" target="_blank" rel="noreferrer"><FaYoutube /></a>
                    <a href="https://github.com/charankopalle" target="_blank" rel="noreferrer"><FaGithub /></a>
                </div>
                <p className="footer-text">© 2025 StoryForge AI. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;
