import React from "react";

interface MessageProps {
  username: string;
  message: string;
  className?: string;
}

const Message: React.FC<MessageProps> = ({ username, message, className }) => {
  return (
    <div className="flex flex-col mb-2">
      {username !== "System" && (
        <p className={`font-semibold ${className}`}>
          {username}: <span className="font-light">{message}</span>
        </p>
      )}
      {username === "System" && (
        <p className={`font-light ${className}`}>{message}</p>
      )}
    </div>
  );
};

export default Message;
