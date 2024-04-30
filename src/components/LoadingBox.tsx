import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center  bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-700"></div>
        <p className="text-black mt-4">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
