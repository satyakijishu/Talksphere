import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import { UserContext } from "../context/UserContext";
import modebg from "../assets/mode-bg.mp4";
import Lottie from "lottie-react";

// Import your Lottie JSON animations
import chatLottie from "../assets/Topictalk_icon.json";
import voiceLottie from "../assets/voice icon lottie animation.json";
import bottomLottie from "../assets/AI logo Foriday.json"; // <-- bottom Lottie animation

function AssistantModeSelector() {
  const { userData, frontendImage } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      {/* ✅ Video Background */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-between">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        >
          <source src={modebg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* ✅ Gradient Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-0"></div>

        {/* ✅ Main Content */}
        <div className="relative z-10 flex flex-col items-center pt-8 sm:pt-12 w-full px-4">
          {/* ✅ Avatar & Assistant Name */}
          <div className="flex flex-col items-center mb-8 sm:mb-12">
            <div className="w-24 mt-20 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg mb-3">
              <img
                src={frontendImage || userData?.assistantImage}
                alt="Assistant Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold text-center">
              {userData?.assistantName || "Your Assistant"}
            </h2>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg mt-2 text-center px-2">
              How would you like to interact?
            </p>
          </div>

          {/* ✅ Options Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-[900px] mb-10">
            {/* ✅ Chat Mode Button */}
            <div
              onClick={() => navigate("/assistance")}
              className="cursor-pointer group relative bg-white/10 border border-white/20 rounded-3xl shadow-lg p-6 sm:p-10 flex flex-col items-center text-center
                         backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:shadow-blue-500/50"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4">
                <Lottie
                  loop
                  animationData={chatLottie}
                  play
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2">
                Chat Mode
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base">
                Type and send messages in real-time.
              </p>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </div>

            {/* ✅ Voice Mode Button */}
            <div
              onClick={() => navigate("/voice")}
              className="cursor-pointer group relative bg-white/10 border border-white/20 rounded-3xl shadow-lg p-6 sm:p-10 flex flex-col items-center text-center
                         backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:border-green-400 hover:shadow-green-500/50"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4">
                <Lottie
                  loop
                  animationData={voiceLottie}
                  play
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2">
                Voice Mode
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base">
                Use your voice for a hands-free experience.
              </p>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </div>
          </div>

          {/* ✅ Bottom Lottie Animation */}
          <div className="mb-6 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32">
            <Lottie
              loop
              animationData={bottomLottie}
              play
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AssistantModeSelector;
