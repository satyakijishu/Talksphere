import React, { useRef, useContext, useState } from "react";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpg";
import { LuImagePlus } from "react-icons/lu";
import { UserContext } from "../context/UserContext";

function Customize() {
  const {
    frontendImage,
    selectedImage,
    handleImageUpload,
    handleDefaultSelect,
  } = useContext(UserContext);

  const navigate = useNavigate();
  const inputImage = useRef();

  const [uploadSelected, setUploadSelected] = useState(false);

  const images = [image1, image2, image3, image4, image5, image6, image7];

  const handleUploadClick = () => {
    inputImage.current.click();
    setUploadSelected(true);
  };

  const handleAvatarClick = (img) => {
    handleDefaultSelect(img);
    setUploadSelected(false);
  };

  return (
    <>
      <Navbar />

      <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col items-center p-6">
        {/* Heading */}
        <h1 className="text-white mb-6 text-[34px] font-bold text-center">
          Customize Your <span className="text-blue-400">Assistant</span>
        </h1>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row w-full max-w-[1200px] justify-between items-start gap-10">
          {/* Left Section: Image Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 w-full lg:max-w-[800px]">
            {/* Default avatars */}
            {images.map((img, index) => (
              <div
                key={index}
                onClick={() => handleAvatarClick(img)}
                className={`cursor-pointer rounded-2xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500 relative ${
                  selectedImage === img
                    ? "border-4 border-white shadow-lg shadow-blue-500"
                    : "border-2 border-blue-400" // slight blue border always
                }`}
              >
                <Card image={img} />
              </div>
            ))}

            {/* Upload Box behaving exactly like other avatars */}
            <div
              onClick={handleUploadClick}
              className={`cursor-pointer rounded-2xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500 relative ${
                uploadSelected
                  ? "border-4 border-white shadow-lg shadow-blue-500"
                  : "border-2 border-blue-400" // slight blue border always
              }`}
            >
              <div className="w-full aspect-square flex items-center justify-center">
                <LuImagePlus className="text-white w-[50px] h-[50px]" />
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={inputImage}
              hidden
              onChange={handleImageUpload}
            />
          </div>

          {/* Right Section: Selected Image Preview */}
          {(frontendImage || selectedImage) && (
            <div className="flex flex-col items-center sticky top-20">
              <h2 className="text-white text-2xl font-bold mb-4">
                Selected Image
              </h2>
              <div className="w-[200px] sm:w-[250px] md:w-[350px] aspect-square border-4 border-green-400 rounded-2xl overflow-hidden shadow-3xl">
                <img
                  src={frontendImage || selectedImage}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Next Button */}
              <button
                type="button"
                disabled={!frontendImage && !selectedImage}
                className={`mt-6 px-12 py-3 rounded-full font-bold text-xl transition-all duration-300 ease-in-out ${
                  !frontendImage && !selectedImage
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-white text-black cursor-pointer hover:bg-blue-300 hover:text-black hover:shadow-lg hover:scale-105"
                }`}
                onClick={() => navigate("/customize2")}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Customize;
