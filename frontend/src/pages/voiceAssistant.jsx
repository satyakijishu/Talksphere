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
  const assistantImage =
    userData?.assistantImage || frontendImage || "/default-avatar.png";

  const [listening, setListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();
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
    if (
      text.toLowerCase().startsWith(`hey ${wakeWord}`) ||
      text.toLowerCase().startsWith(`hi ${wakeWord}`)
    ) {
      const greetMsg = `Hello! How can I assist you today?`;
      setAssistantResponse(greetMsg);
      speakResponse(greetMsg);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text }),
        }
      );

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

      <div className="w-full min-h-screen bg-gradient-to-b from-[#030353] via-[#0b0b3b] to-black flex flex-col items-center pt-6 relative">
        {/* ✅ Back Button */}
        <button
          onClick={() => navigate("/choose-mode")}
          className="absolute top-[80px] left-4 flex items-center gap-2 p-2 text-white hover:text-blue-400 transition-colors duration-300 shadow-md rounded-full backdrop-blur-sm"
        >
          <HiArrowLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* ✅ Assistant Avatar & Name */}
        <div className="flex flex-col items-center mb-6 mt-16 sm:mt-20">
          <div className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] rounded-full overflow-hidden border-4 border-blue-500 shadow-lg mb-2">
            <img
              src={assistantImage}
              alt="Assistant Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-white text-lg sm:text-2xl font-semibold text-center">
            {assistantName}
          </h2>
        </div>

        {/* ✅ Voice Assistant Card */}
        <div className="w-[90%] sm:w-[85%] md:w-[70%] lg:max-w-[800px] backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl p-4 sm:p-6 h-[70vh] border border-white/20 flex flex-col items-center justify-between text-center">
          {/* You Said */}
          <div className="bg-gray-800 text-white rounded-xl p-3 sm:p-6 mb-4 sm:mb-6 w-full max-h-[25%] overflow-y-auto">
            <p className="text-gray-400 text-sm sm:text-base mb-2">
              You said:
            </p>
            <p className="text-sm sm:text-lg font-semibold break-words">
              {recognizedText || "Click the mic and speak..."}
            </p>
          </div>

          {/* Assistant Response */}
          <div className="bg-gray-800 text-white rounded-xl p-3 sm:p-6 mb-4 sm:mb-6 w-full max-h-[40%] overflow-y-auto">
            <p className="text-gray-400 text-sm sm:text-base mb-2">
              {assistantName} says:
            </p>
            <p className="text-sm sm:text-lg font-semibold break-words">
              {loading
                ? "Thinking..."
                : assistantResponse || "Waiting for your voice..."}
            </p>
          </div>

          {/* Voice Control Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4 w-full">
            {!listening ? (
              <button
                onClick={handleStartListening}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition w-full sm:w-auto"
              >
                <MicrophoneIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Start Listening</span>
              </button>
            ) : (
              <button
                onClick={handleStopListening}
                className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition w-full sm:w-auto"
              >
                Stop Listening
              </button>
            )}

            {/* Stop Speaking button */}
            <button
              onClick={stopSpeaking}
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition w-full sm:w-auto"
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
