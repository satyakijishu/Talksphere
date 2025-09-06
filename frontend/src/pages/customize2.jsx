import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import { UserContext } from "../context/UserContext";

function Customize2() {
  const navigate = useNavigate();
  const { frontendImage, handleSetAssistant } = useContext(UserContext);
  const [assistantName, setAssistantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateAssistant = async () => {
    if (!assistantName.trim()) {
      setError("Please enter an assistant name.");
      return;
    }
    console.log("Creating assistant with name:", assistantName);
    setError("");
    setLoading(true);

    try {
      const success = await handleSetAssistant(assistantName.trim());
      if (success) {
        navigate("/choose-mode");
      } else {
        setError("Something went wrong while saving your assistant.");
      }
    } catch (err) {
      console.error("Error setting assistant:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full min-h-[100vh] bg-gradient-to-t from-black to-[#030353] flex flex-col items-center p-[20px]">
        {/* Heading */}
        <h1 className="text-white mb-4 text-[38px] font-bold text-center mt-10">
          Enter Your <span className="text-blue-400">Assistant Name</span>
        </h1>

        {/* Description / Tip */}
        <p className="text-gray-300 text-center max-w-[500px] mb-6 text-[16px]">
          Choose a unique name for your assistant. You can always change it later!
        </p>

        {/* Selected Avatar Preview */}
        <div className="w-[150px] h-[150px] rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-blue-400 mt-6">
          {frontendImage ? (
            <img
              src={frontendImage}
              alt="Selected Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-300 text-sm text-center px-2">
              No Avatar Selected
            </span>
          )}
        </div>

        {/* Assistant Name Input */}
        <input
          type="text"
          value={assistantName}
          onChange={(e) => setAssistantName(e.target.value)}
          placeholder="e.g. Jarvis"
          aria-label="Assistant Name"
          className="w-full max-w-[600px] h-[60px] bg-transparent border-2 border-white outline-none text-white placeholder-gray-400 text-[18px] px-[20px] py-[10px] mt-10 rounded-full"
          required
        />

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Final Button */}
        <button
          type="button"
          disabled={!assistantName.trim() || loading}
          className={`mt-8 px-12 py-3 rounded-full font-bold text-xl transition-all duration-300 ease-in-out ${
            !assistantName.trim() || loading
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-white text-black cursor-pointer hover:bg-blue-300 hover:text-black hover:shadow-lg hover:scale-105"
          }`}
          onClick={handleCreateAssistant}
        >
          {loading ? "Saving..." : "Create Assistant"}
        </button>
      </div>
    </>
  );
}

export default Customize2;
