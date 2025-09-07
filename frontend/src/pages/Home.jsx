import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import bgVideo from "../assets/bg-video.mp4";
import animationData from "../assets/animation.json";
import { UserContext } from "../context/UserContext";
import Lottie from "lottie-react";
import {
  FaRobot,
  FaUserCog,
  FaClock,
  FaShieldAlt,
  FaChartLine,
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";

function Home() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleGetStarted = () => {
    navigate(user ? "/choose-mode" : "/signin");
  };

  const features = [
    {
      icon: <FaRobot />,
      title: "Smart Assistance",
      text: "AI-powered responses for your tasks, queries, and planning needs.",
    },
    {
      icon: <FaUserCog />,
      title: "Personalization",
      text: "Customize your assistant’s name, image, and preferences easily.",
    },
    {
      icon: <FaClock />,
      title: "24/7 Availability",
      text: "Always available whenever you need help — day or night.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Data Security",
      text: "Your privacy is protected with top-grade encryption and secure systems.",
    },
    {
      icon: <FaChartLine />,
      title: "Productivity Insights",
      text: "Track your tasks and boost your efficiency with smart insights.",
    },
  ];

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden">
      {/* ✅ Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* ✅ Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 z-0"></div>

      {/* ✅ Top-right Get Started Button */}
      <motion.div
        className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <button
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow-lg transition-transform transform hover:scale-110"
        >
          Get Started
        </button>
      </motion.div>

      {/* ✅ Hero Section */}
      <section className="relative z-20 flex flex-col items-center text-center px-4 sm:px-6 pt-20 sm:pt-24">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-white">Welcome to </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            TalkSphere
          </span>
        </motion.h1>

        <motion.div
          className="text-lg sm:text-xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 max-w-xl md:max-w-2xl mx-auto mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <Typewriter
            options={{
              strings: [
                "Plan. Organize. Achieve.",
                "Stay Productive Effortlessly.",
                "Your AI-powered Assistant.",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </motion.div>
      </section>

      {/* ✅ Lottie Animation */}
      <motion.div
        className="relative z-20 flex justify-center items-center mt-6 sm:mt-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <Lottie
          animationData={animationData}
          className="w-[180px] sm:w-[200px] md:w-[300px]"
          loop
        />
      </motion.div>

      {/* ✅ Features Section */}
      <section className="relative z-20 mt-12 sm:mt-16 px-4 sm:px-6 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 text-center">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="relative group p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-xl shadow-xl border border-white/10 hover:border-cyan-400 hover:shadow-cyan-400/40 hover:scale-105 transition-all overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Gradient Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-cyan-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-xl transition duration-500"></div>

            {/* Icon */}
            <div className="relative z-10 flex justify-center items-center h-14 w-14 sm:h-16 sm:w-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white text-2xl sm:text-3xl shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>

            {/* Title */}
            <h3 className="relative z-10 text-lg sm:text-xl font-bold mb-2 text-white group-hover:text-cyan-300 transition">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="relative z-10 text-gray-300 text-xs sm:text-sm">
              {feature.text}
            </p>
          </motion.div>
        ))}
      </section>

      {/* ✅ Stats Section */}
      <motion.section
        className="relative z-20 mt-12 sm:mt-20 flex flex-col sm:flex-row justify-center gap-10 sm:gap-16 text-center px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {[
          { value: "10K+", label: "Active Users" },
          { value: "99.9%", label: "Uptime Guarantee" },
          { value: "4.9★", label: "User Rating" },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400">
              {stat.value}
            </h3>
            <p className="text-gray-300 text-sm sm:text-base">{stat.label}</p>
          </div>
        ))}
      </motion.section>

      {/* ✅ CTA Section */}
      <motion.section
        className="relative z-20 mt-16 sm:mt-20 text-center pb-10 sm:pb-16 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
          Ready to make your life easier?
        </h2>
        <motion.button
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg transition-transform transform hover:scale-110"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started Now
        </motion.button>
      </motion.section>

      {/* ✅ Footer */}
      <footer className="relative z-30 bg-black py-8 sm:py-10 px-4 sm:px-6 mt-12 sm:mt-16 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Brand & Tagline */}
          <div className="text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              TalkSphere
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              AI Assistant for Smarter Productivity.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 sm:gap-5 text-lg sm:text-2xl text-gray-400">
            <a
              href="https://github.com/yourprofile"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://instagram.com/yourprofile"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center text-gray-500 text-xs sm:text-sm mt-4 sm:mt-6 border-t border-gray-700 pt-3 sm:pt-4">
          © 2025 TalkSphere. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
