import React, { useEffect, useState, useRef, useContext } from "react";
import Navbar from "./navbar";
import { UserContext } from "../context/UserContext";
import { MicrophoneIcon } from "@heroicons/react/24/solid";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function VoiceAssistant() {
    const { frontendImage, userData } = useContext(UserContext);
    const navigate = useNavigate();

    const assistantName = userData?.assistantName || "Your Assistant";
    const assistantImage = userData?.assistantImage || frontendImage || "/default-avatar.png";

    const [listening, setListening] = useState(false);
    const [recognizedText, setRecognizedText] = useState("");
    const [assistantResponse, setAssistantResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Speech Recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onresult = async (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            setRecognizedText(transcript);
            handleSendToAssistant(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognitionRef.current = recognition;
    }, []);

    const handleStartListening = () => {
        if (recognitionRef.current) {
            setListening(true);
            recognitionRef.current.start();
        }
    };

    const handleStopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setListening(false);
        }
    };

    /** ✅ Remove HTML tags and code blocks */
    const cleanResponseText = (text) => {
        return text
            .replace(/```[a-z]*|```/gi, "")
            .replace(/import\s+.*;?/gi, "")
            .replace(/injectIntoGlobalHook.*;/gi, "")
            .replace(/window\.\$RefreshReg\$.*;/gi, "")
            .replace(/window\.\$RefreshSig\$.*;/gi, "")
            .replace(/Vite\s*\+\s*React/gi, "")
            .replace(/<[^>]*>?/gm, "")
            .trim();
    };

    /** ✅ Stop AI Speech */
    const stopSpeaking = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
    };

    /** ✅ Process user speech */
    const handleSendToAssistant = async (text) => {
        stopSpeaking();

        const wakeWord = assistantName.toLowerCase();
        if (text.toLowerCase().startsWith(`hey ${wakeWord}`) || text.toLowerCase().startsWith(`hi ${wakeWord}`)) {
            const greetMsg = `Hello! How can I assist you today?`;
            setAssistantResponse(greetMsg);
            speakResponse(greetMsg);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: text })
            });

            const json = await res.json();

            if (!json.response) {
                setAssistantResponse("Error: No valid response from AI.");
                return;
            }

            const cleanResponse = cleanResponseText(json.response);
            setAssistantResponse(cleanResponse);
            speakResponse(cleanResponse);
        } catch (error) {
            console.error("Error communicating with assistant:", error);
            const fallback = "Sorry, I couldn't process that.";
            setAssistantResponse(fallback);
            speakResponse(fallback);
        }
        setLoading(false);
    };

    /** ✅ Voice output */
    const speakResponse = (text) => {
        const synth = window.speechSynthesis;
        if (!synth) {
            alert("Your browser does not support speech synthesis.");
            return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        synth.speak(utterance);
    };

    return (
        <>
            <Navbar />

            <div className="w-full min-h-[100vh] bg-gradient-to-b from-[#030353] via-[#0b0b3b] to-black flex flex-col items-center pt-6 relative">

                {/* ✅ Back Button */}
                <button
                    onClick={() => navigate("/choose-mode")}
                    className="absolute top-[90px] left-6 flex items-center gap-2 p-2 text-white hover:text-blue-400 transition-colors duration-300 shadow-md rounded-full backdrop-blur-sm"
                    style={{ backgroundColor: "rgba(0,0,0,0)" }}
                >
                    <HiArrowLeft className="w-6 h-6" />
                </button>

                {/* ✅ Assistant Avatar & Name */}
                <div className="flex flex-col items-center mb-6 mt-12">
                    <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-blue-500 shadow-lg mb-2">
                        <img
                            src={assistantImage}
                            alt="Assistant Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="text-white text-[22px] font-semibold">{assistantName}</h2>
                </div>

                {/* ✅ Voice Assistant Card */}
                <div className="w-full max-w-[800px] flex-col backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl p-6 h-[70vh] border border-white/20 flex items-center justify-center text-center">
                    
                    {/* You Said */}
                    <div className="bg-gray-800 text-white rounded-xl p-6 mb-6 w-full">
                        <p className="text-gray-400 mb-2">You said:</p>
                        <p className="text-lg font-semibold">{recognizedText || "Click the mic and speak..."}</p>
                    </div>

                    {/* Assistant Response */}
                    <div className="bg-gray-800 text-white rounded-xl p-6 mb-6 w-full">
                        <p className="text-gray-400 mb-2">{assistantName} says:</p>
                        <p className="text-lg font-semibold">
                            {loading ? "Thinking..." : assistantResponse || "Waiting for your voice..."}
                        </p>
                    </div>

                    {/* Voice Control Buttons */}
                    <div className="flex justify-center mt-4 space-x-4">
                        {!listening ? (
                            <button
                                onClick={handleStartListening}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition flex items-center space-x-2"
                            >
                                <MicrophoneIcon className="w-6 h-6" />
                                <span>Start Listening</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleStopListening}
                                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition"
                            >
                                Stop Listening
                            </button>
                        )}

                        {/* Stop Speaking button */}
                        <button
                            onClick={stopSpeaking}
                            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-4 rounded-full text-lg font-semibold transition"
                        >
                            Stop Talking
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VoiceAssistant;
