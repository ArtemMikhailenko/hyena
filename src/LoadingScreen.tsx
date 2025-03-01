import React from "react";
import { rabbitPhoto } from "./images";

const LoadingScreen: React.FC = () => {
  return (
    <div className="w-full text-black h-screen font-bold flex flex-col max-w-xl justify-center items-center relative">
      {/* Background with gradient */}
      <div
        className="fixed inset-0 w-full h-full backdrop-blur-3xl"
        style={{
          background: "linear-gradient(135deg, #A07747, #664D2B)", // Purple to Yellow gradient
        }}
      ></div>

      {/* Loading Image */}
      {/* <img
        src={rabbitPhoto}
        alt="Loading Character"
        className=" mb-4   animate-bounce  rounded-3xl" // Teal border
      /> */}

      <div className="relative flex flex-col items-center z-50 mb-5 w-full">
        <div className="absolute right-6 -bottom-[1rem] animate-bounce-custom">
          <img
            src={rabbitPhoto}
            alt="rabbit"
            className=" md:w-20 h-20 md:h-20 rounded-3xl opacity-100"
          />
        </div>
        <div className="absolute left-6 -bottom-[1rem] animate-bounce-custom">
          <img
            src={rabbitPhoto}
            alt="rabbit"
            className=" md:w-20 h-20 md:h-20 rounded-3xl opacity-100"
          />
        </div>

        <img
          src={rabbitPhoto}
          alt="Token Logo"
          className="w-36 h-36 rounded-3xl animate-pulse  p-4"
        />
      </div>

      {/* Loading Text */}
      <h1 className="text-2xl font-extrabold text-center text-white animate-pulse">
        Loading...
      </h1>
    </div>
  );
};

export default LoadingScreen;
