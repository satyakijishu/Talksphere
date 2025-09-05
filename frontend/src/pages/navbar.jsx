import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Lottie from "lottie-react";
import logoAnimation from "../assets/animation.json"; // ✅ Your Lottie JSON

function Navbar() {
  const { userData, setUserData } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customizeDropdownOpen, setCustomizeDropdownOpen] = useState(false);
  const [assistantDropdownOpen, setAssistantDropdownOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const userDropdownRef = useRef(null);
  const customizeDropdownRef = useRef(null);
  const assistantDropdownRef = useRef(null);

  const handleLogout = () => {
    setUserData(null);
    navigate("/signin");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) setDropdownOpen(false);
      if (customizeDropdownRef.current && !customizeDropdownRef.current.contains(event.target)) setCustomizeDropdownOpen(false);
      if (assistantDropdownRef.current && !assistantDropdownRef.current.contains(event.target)) setAssistantDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show/Hide Navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) setShowNavbar(true);
      else if (currentScrollY > lastScrollY + 10) setShowNavbar(false);
      else if (currentScrollY < lastScrollY - 10) setShowNavbar(true);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 w-full flex items-center justify-between px-6 text-white transition-transform duration-500 z-50
        ${showNavbar ? "translate-y-0" : "-translate-y-full"}
        bg-black/30 backdrop-blur-md border-b border-white/10 shadow-lg
      `}
      style={{ height: "70px" }}
    >
      {/* Logo + Lottie */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <div className="w-12 h-12">
          <Lottie animationData={logoAnimation} loop={true} />
        </div>
        <div className="text-2xl font-bold hover:text-blue-400 transition-all duration-300 transform hover:scale-110">
          TalkSphere
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Customize Dropdown */}
        <div className="relative" ref={customizeDropdownRef}>
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-110 cursor-pointer"
            onClick={() => {
              setCustomizeDropdownOpen((prev) => !prev);
              setDropdownOpen(false);
              setAssistantDropdownOpen(false);
            }}
          >
            Customize
          </button>
          {customizeDropdownOpen && (
            <div className="absolute top-full mt-2 w-56 bg-white text-black rounded-lg shadow-xl animate-slideDown z-50">
              <ul className="flex flex-col">
                <li
                  className="px-4 py-2 hover:bg-blue-100 transform hover:scale-105 transition-all cursor-pointer"
                  onClick={() => {
                    setCustomizeDropdownOpen(false);
                    navigate("/customize");
                  }}
                >
                  Customize Assistant
                </li>
                <li
                  className="px-4 py-2 hover:bg-blue-100 transform hover:scale-105 transition-all cursor-pointer"
                  onClick={() => {
                    setCustomizeDropdownOpen(false);
                    navigate("/customize2");
                  }}
                >
                  Customize Name
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Assistant Mode Dropdown */}
        <div className="relative" ref={assistantDropdownRef}>
          <button
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-110 cursor-pointer"
            onClick={() => {
              setAssistantDropdownOpen((prev) => !prev);
              setDropdownOpen(false);
              setCustomizeDropdownOpen(false);
            }}
          >
            Assistant Mode
          </button>
          {assistantDropdownOpen && (
            <div className="absolute top-full mt-2 w-56 bg-white text-black rounded-lg shadow-xl animate-slideDown z-50">
              <ul className="flex flex-col">
                <li
                  className="px-4 py-2 hover:bg-blue-100 transform hover:scale-105 transition-all cursor-pointer"
                  onClick={() => {
                    setAssistantDropdownOpen(false);
                    navigate("/voice");
                  }}
                >
                  Talk to Assistant
                </li>
                <li
                  className="px-4 py-2 hover:bg-blue-100 transform hover:scale-105 transition-all cursor-pointer"
                  onClick={() => {
                    setAssistantDropdownOpen(false);
                    navigate("/assistance");
                  }}
                >
                  Chat with Assistant
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        {userData && (
          <div className="relative" ref={userDropdownRef}>
            <div
              className="flex items-center gap-4 ml-6 cursor-pointer"
              onClick={() => {
                setDropdownOpen((prev) => !prev);
                setCustomizeDropdownOpen(false);
                setAssistantDropdownOpen(false);
              }}
            >
              {userData?.assistantImage && (
                <img
                  src={userData.assistantImage}
                  alt="Assistant"
                  className="w-12 h-12 rounded-full border-2 border-white hover:scale-110 transition-transform duration-300"
                />
              )}
              <span className="text-lg font-medium">
                {userData?.assistantName || "Your Assistant"}
              </span>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white text-black rounded-lg shadow-xl animate-slideDown z-50">
                <ul className="flex flex-col">
                  <li
                    className="px-4 py-2 hover:bg-red-100 text-red-600 font-semibold transform hover:scale-105 transition-all cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
