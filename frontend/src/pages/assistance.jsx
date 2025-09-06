import React, { useContext, useState, useRef, useEffect } from "react";
import Navbar from "./navbar";
import { UserContext } from "../context/UserContext";
import { MicrophoneIcon, PlusIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { IoIosSend } from "react-icons/io";
import { FaPause } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function Assistance() {
    const { userData, frontendImage } = useContext(UserContext);
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showUploadOptions, setShowUploadOptions] = useState(false);
    const recognitionRef = useRef(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ✅ Handle Send Message
    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input, type: "text" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: input })
            });
            const data = await response.json();

            const botMessage = {
                sender: "assistant",
                text: data.response || "Sorry, I couldn't process that.",
                type: "text",
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [
                ...prev,
                { sender: "assistant", text: "Error occurred.", type: "text" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Pause Button (Stop response - placeholder)
    const handlePause = () => {
        alert("Pause functionality will be implemented later.");
        setLoading(false);
    };

    // ✅ Voice Input
    const startVoiceRecognition = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Voice recognition not supported in this browser.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
        };
        recognition.start();
        recognitionRef.current = recognition;
    };

    // ✅ Device Upload with Image Preview
    const handleDeviceUpload = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            const imageUrl = URL.createObjectURL(file);
            const fileMessage = {
                sender: "user",
                text: file.name,
                image: imageUrl,
                type: "image",
            };
            setMessages((prev) => [...prev, fileMessage]);
        }
    };

    // ✅ Drive Upload Placeholder
    const handleDriveUpload = () => {
        alert("Google Drive upload integration will be implemented here in the future.");
    };

    // ✅ Handle Enter Key
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !loading) {
            handleSend();
        }
    };

    return (
        <>
            <Navbar />

            <div className="w-full min-h-[100vh] bg-gradient-to-b from-[#030353] via-[#0b0b3b] to-black flex flex-col items-center pt-6 relative">
{/* ✅ Professional Transparent Back Button */}
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
                            src={frontendImage || userData?.assistantImage}
                            alt="Assistant Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="text-white text-[22px] font-semibold">
                        {userData?.assistantName || "Your Assistant"}
                    </h2>
                </div>

                {/* ✅ Chat Box */}
                <div className="w-full max-w-[800px] flex flex-col backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl p-6 h-[70vh] overflow-y-auto border border-white/20 custom-scrollbar">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`my-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`p-4 rounded-2xl text-base leading-relaxed max-w-[70%] shadow-md ${
                                    msg.sender === "user"
                                        ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-br-none"
                                        : "bg-gradient-to-br from-gray-700 to-gray-900 text-gray-100 rounded-bl-none"
                                }`}
                            >
                                {msg.type === "image" ? (
                                    <img src={msg.image} alt="Uploaded" className="rounded-lg max-w-full" />
                                ) : (
                                    msg.text
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start my-3">
                            <div className="bg-gray-700 text-gray-300 rounded-2xl px-4 py-3 text-sm animate-pulse">
                                Assistant is typing...
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef}></div>
                </div>

                {/* ✅ Input Bar */}
                <div className="w-full max-w-[800px] flex items-center bg-[#0f0f1a] rounded-full mt-4 px-4 py-2 relative">
                    {/* ➕ Plus Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUploadOptions(!showUploadOptions)}
                            className="p-2 rounded-full bg-gray-600 hover:bg-gray-700 transition"
                        >
                            <PlusIcon className="w-6 h-6 text-white" />
                        </button>
                        {showUploadOptions && (
                            <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white rounded-xl shadow-xl p-2 space-y-2 w-56">
                                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 px-4 py-2 rounded-lg transition">
                                    <PhotoIcon className="w-5 h-5 text-blue-400" />
                                    Upload from Device
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleDeviceUpload}
                                    />
                                </label>
                                <button
                                    onClick={handleDriveUpload}
                                    className="block w-full text-left hover:bg-gray-700 px-4 py-2 rounded-lg transition"
                                >
                                    Upload from Drive
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Input Field */}
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent text-white text-lg px-4 outline-none"
                    />

                    {/* Voice Button */}
                    <button
                        onClick={startVoiceRecognition}
                        className="p-2 rounded-full bg-transparent hover:bg-white/10 transition ml-2"
                    >
                        <MicrophoneIcon className="w-6 h-6 text-white" />
                    </button>

                    {/* Send / Pause Button */}
                    {loading ? (
                        <button
                            onClick={handlePause}
                            className="ml-3 px-5 py-2 rounded-full font-semibold flex items-center justify-center gap-2 bg-gray-700/60 hover:bg-gray-600/80 transition-all duration-300 shadow-md"
                        >
                            <FaPause className="w-5 h-5 text-white" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className={`ml-3 px-5 py-2 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300
                                ${
                                    !input.trim()
                                        ? "bg-gray-500 cursor-not-allowed"
                                        : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg hover:scale-105"
                                }`}
                        >
                            <IoIosSend className="w-5 h-5 text-white" />
                            <span className="text-white">Send</span>
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default Assistance;
