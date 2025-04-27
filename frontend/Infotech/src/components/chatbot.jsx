import 'regenerator-runtime';
import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TbMessageCircle } from "react-icons/tb";
import { FaRobot } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const ChatBot = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false }
    ]);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isMuted, setIsMuted] = useState(false); // State for mute functionality

    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            addMessage("Your browser doesn't support speech recognition. Please try using Chrome.", false);
        }
    }, [browserSupportsSpeechRecognition]);

    useEffect(() => {
        // Speak the initial message when the chatbot opens
        if (!isMuted) speakText(messages[0].text);
    }, [isMuted]); // Add isMuted as a dependency to ensure it respects the mute state

    const speakText = (text) => {
        if (isMuted) return; // Do not speak if muted
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    const stopSpeech = () => {
        window.speechSynthesis.cancel(); // Stops any ongoing speech
    };

    const addMessage = (text, isUser) => {
        setMessages((prev) => [...prev, { text, isUser }]);
        if (!isUser && !isMuted) speakText(text); // Speak only bot messages if not muted
    };

    const handleListen = () => {
        if (isListening) {
            SpeechRecognition.stopListening();
            setIsListening(false);

            if (transcript) {
                addMessage(transcript, true);
                processUserInput(transcript);
            }
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: false });
            setIsListening(true);
        }
    };

    const processUserInput = async (input) => {
        setIsProcessing(true);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: input }] }]
            });

            const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";

            addMessage(responseText, false);
        } catch (error) {
            addMessage("Sorry, I couldn't process your request. Please try again.", false);
            console.error("Gemini API Error:", error);
        }
        setIsProcessing(false);
    };

    const handleTextSubmit = (e) => {
        e.preventDefault();
        const input = e.target.userInput.value;
        if (input.trim()) {
            addMessage(input, true);
            processUserInput(input);
            e.target.userInput.value = '';
        }
    };

    const handleClose = () => {
        stopSpeech(); // Stop any ongoing speech
        onClose(); // Close the chatbot
    };

    return (
        <div className="fixed bottom-4 right-4 bg-gradient-to-br from-[#1a1a2e] to-black text-white rounded-lg shadow-lg z-50 w-80 h-96 flex flex-col">
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-sm">
                Investfolio Assistant <FaRobot className="inline text-white text-lg ml-2" />
                </h3>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => {
                            setIsMuted((prev) => {
                                const newMutedState = !prev;
                                if (newMutedState) window.speechSynthesis.cancel(); // stop speaking if muting
                                return newMutedState;
                            });
                        }}
                        className="text-gray-400 hover:text-white"
                    >
                        {isMuted ? '🔇' : '🔊'}
                    </button>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white">
                        ✕
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.length === 1 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <img
                            src="/chatImg.webp"
                            alt="Hello!"
                            className="w-50 h-50 mb-2"
                        />
                        <p className="text-gray-400 text-sm">Hello! I'm here to assist you.</p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`${message.isUser ? 'ml-auto bg-blue-600' : 'mr-auto bg-gray-700'} rounded-xl p-2 max-w-[75%] text-sm`}
                        >
                            <p>{message.text}</p>
                        </div>
                    ))
                )}
            </div>
            <div className="p-3 border-t border-gray-700">
                <div className="flex items-center">
                    <form onSubmit={handleTextSubmit} className="flex-1 mr-2">
                        <input
                            type="text"
                            name="userInput"
                            placeholder="Type your response..."
                            className="w-full px-3 py-2 rounded-full text-black bg-gray-100 focus:outline-none text-sm"
                        />
                    </form>
                    <button
                        onClick={handleListen}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
                            } text-white`}
                    >
                        {isListening ? '🔴' : <FaMicrophone />}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ChatBotToggle = () => {
    const [isChatBotOpen, setIsChatBotOpen] = useState(false);

    const handleToggleChatBot = () => {
        setIsChatBotOpen(prev => !prev);
    };

    return (
        <div>
            <button
                onClick={handleToggleChatBot}
                className="fixed bottom-4 right-4 bg-transparent animate-bounce hover:bg-blue-700 text-white font-semibold p-3 rounded-full shadow-lg z-50"
            >
              <TbMessageCircle className="text-3xl text-blue-300" />
            </button>

            {isChatBotOpen && <ChatBot onClose={handleToggleChatBot} />}
        </div>
    );
};

export default ChatBotToggle;