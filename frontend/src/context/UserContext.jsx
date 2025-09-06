import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const serverUrl = import.meta.env.VITE_BACKEND_URL ;

  // ✅ Default structure for user data
  const defaultUserData = {
    assistantName: "",
    assistantImage: "",
  };

  // ✅ Safe JSON parser
  const safeParse = (data) => {
    try {
      const parsed = JSON.parse(data);
      return parsed && typeof parsed === "object" ? parsed : defaultUserData;
    } catch {
      return defaultUserData;
    }
  };

  // ✅ Load userData from localStorage safely
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? safeParse(savedUser) : defaultUserData;
  });

  // ✅ Load assistant image from localStorage or empty
  const [frontendImage, setFrontendImage] = useState(() => {
    return localStorage.getItem("frontendImage") || "";
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // ✅ Persist userData in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  // ✅ Persist frontendImage in localStorage whenever it changes
  useEffect(() => {
    if (frontendImage) {
      localStorage.setItem("frontendImage", frontendImage);
    }
  }, [frontendImage]);

  // ✅ Fetch current user from backend and merge with local settings
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/current`, {
        withCredentials: true,
      });

      setUserData((prev) => ({
        ...defaultUserData,
        ...result.data,
        assistantName:
          prev.assistantName || result.data.assistantName || "",
        assistantImage:
          prev.assistantImage || result.data.assistantImage || "",
      }));
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  // ✅ Handle custom image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedImage(null);

      const reader = new FileReader();
      reader.onload = () => {
        setFrontendImage(reader.result);
        setUserData((prev) => ({
          ...prev,
          assistantImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Handle selecting a default image
  const handleDefaultSelect = (img) => {
    setSelectedImage(img);
    setFrontendImage(img);
    setSelectedFile(null);

    setUserData((prev) => ({
      ...prev,
      assistantImage: img,
    }));
  };

  // ✅ Save assistant name & image to backend
  const handleSetAssistant = async (assistantName) => {
    try {
      const response = await axios.post(
        `${serverUrl}/set-assistant`,
        {
          assistantName,
          assistantImage: frontendImage || "",
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUserData((prev) => ({
          ...prev,
          assistantName,
          assistantImage: frontendImage,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error(
        "Error setting assistant:",
        error.response?.data || error.message
      );
      return false;
    }
  };

  const assistantName = userData?.assistantName || "";
  const assistantImage = userData?.assistantImage || frontendImage || "";

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        serverUrl,
        handleCurrentUser,
        frontendImage: assistantImage,
        selectedImage,
        handleImageUpload,
        handleDefaultSelect,
        handleSetAssistant,
        assistantName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserContext };
