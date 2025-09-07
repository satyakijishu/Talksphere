import React, { useState, useContext } from 'react';
import bg from "../assets/authBg.jpg";
import { useNavigate } from 'react-router-dom';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import signupAnim from "../assets/animation.json"; // ✅ Your Lottie JSON file for signup

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      if (result.status === 201 || result.status === 200) {
        setUserData(result.data);
        console.log(result.data);
        localStorage.setItem("token", result.data.token);
        navigate("/customize");
      } else {
        setError("Unexpected error. Please try again.");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setUserData(null);
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div
      className="w-full h-screen bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Glassmorphic container */}
      <motion.form
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-[90%] max-w-[500px] bg-[#00000070] rounded-2xl flex flex-col justify-center items-center gap-[20px] px-[25px] py-8 backdrop-blur-md shadow-2xl shadow-black border border-gray-700 overflow-hidden"
        onSubmit={handleSignUp}
      >
        {/* ✅ Lottie Animation at Top */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-[150px] h-[150px] flex justify-center items-center mt-[10px]"
        >
          <Lottie animationData={signupAnim} loop={true} />
        </motion.div>

        {/* ✅ Animated Heading */}
        <motion.h1
          className="text-white text-[28px] md:text-[32px] font-semibold text-center leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Create Your <span className="text-blue-400 font-bold">Account</span>
        </motion.h1>

        {/* ✅ Name Input */}
        <motion.input
          type="text"
          placeholder="Enter your Name"
          className="w-full h-[55px] bg-transparent border border-gray-400 outline-none text-white placeholder-gray-400 text-[16px] px-[20px] py-[10px] rounded-full focus:border-blue-400 transition"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />

        {/* ✅ Email Input */}
        <motion.input
          type="email"
          placeholder="Enter your Email"
          className="w-full h-[55px] bg-transparent border border-gray-400 outline-none text-white placeholder-gray-400 text-[16px] px-[20px] py-[10px] rounded-full focus:border-blue-400 transition"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        />

        {/* ✅ Password Input */}
        <motion.div
          className="w-full bg-transparent border border-gray-400 rounded-full text-white flex items-center relative focus-within:border-blue-400 transition"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-[55px] rounded-full outline-none bg-transparent placeholder:text-gray-400 text-white text-[16px] px-[20px] py-[10px]"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {showPassword ? (
            <IoIosEyeOff
              className="absolute top-1/2 right-[20px] transform -translate-y-1/2 text-white w-[24px] h-[24px] cursor-pointer hover:text-blue-400 transition"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoIosEye
              className="absolute top-1/2 right-[20px] transform -translate-y-1/2 text-white w-[24px] h-[24px] cursor-pointer hover:text-blue-400 transition"
              onClick={() => setShowPassword(true)}
            />
          )}
        </motion.div>

        {/* ✅ Errors */}
        {passwordError && (
          <p className="text-red-500 text-[14px]">{passwordError}</p>
        )}
        {error && <p className="text-red-500 text-[14px]">*{error}</p>}

        {/* ✅ Submit Button */}
        <motion.button
          type="submit"
          className="w-[65%] h-[55px] bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full font-semibold text-lg cursor-pointer
          transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-cyan-500 hover:shadow-[0_0_20px_#00f,0_0_40px_#0ff] mt-[10px]"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Sign Up
        </motion.button>

        <p className="text-white text-[16px] cursor-pointer text-center">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </motion.form>
    </div>
  );
}

export default SignUp;
