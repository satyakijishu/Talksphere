import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// ✅ Import all pages
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Customize from './pages/Customize';
import Customize2 from './pages/customize2';
import Assistance from './pages/assistance';
import VoiceAssistant from './pages/voiceAssistant'; // ✅ New Voice Assistant page
import AssistantModeSelector from './pages/AssistantModeSelector'; // ✅ New Mode Selection page

// ✅ Import UserContext
import { UserContext } from "./context/UserContext";

function App() {
  const { userData, handleCurrentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      await handleCurrentUser(); // fetch user data on page load
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    return <div className="text-center text-xl mt-20 text-white">Loading...</div>;
  }

  return (
    <Routes>
      {/* ✅ Default route: Decide where to go */}
       <Route path="/" element={<Home />} />
      {/* ✅ Auth pages */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* ✅ Protected Routes */}
      <Route path="/home" element={userData ? <Home /> : <Navigate to="/signin" />} />
      <Route path="/customize" element={userData ? <Customize /> : <Navigate to="/signin" />} />
      <Route path="/customize2" element={userData ? <Customize2 /> : <Navigate to="/signin" />} />
      <Route path="/assistance" element={userData ? <Assistance /> : <Navigate to="/signin" />} />
      <Route path="/voice" element={userData ? <VoiceAssistant /> : <Navigate to="/signin" />} />
      <Route path="/choose-mode" element={userData ? <AssistantModeSelector /> : <Navigate to="/signin" />} />
    </Routes>
  );
}

export default App;
