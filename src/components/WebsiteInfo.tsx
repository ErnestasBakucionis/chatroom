import React from "react";
import { version, creator, creationDate } from "../utils/constants";

const WebsiteInfo: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-50 p-4 text-center">
      <p className="text-sm text-gray-400">{creationDate}</p>
      <p className="text-sm text-gray-400">Version: {version}</p>
      <p className="text-sm text-gray-400">Created by {creator}</p>
    </div>
  );
};

export default WebsiteInfo;
