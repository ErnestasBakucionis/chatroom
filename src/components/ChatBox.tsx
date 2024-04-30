"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Message from "./Message";
import InputBox from "./InputBox";
import Button from "./Button";
import "../styles/scrollbar.css";
import { io, Socket } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";

const socket: Socket = io("http://localhost:3001");

type MessageProps = {
  username: string;
  message: string;
  code: string;
};

type ConnectedUser = {
  userId: string;
  username: string;
};

const ChatBox: React.FC = () => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const searchParams = useSearchParams();
  const savedUsername = searchParams.get("username");
  const roomCode = searchParams.get("code");
  const userId = searchParams.get("userId");
  const [otherUser, setOtherUser] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyRoomCodeToClipboard = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    }
  };

  const fetchConnectedUsers = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/connectedUsers/${roomCode}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch connected users");
      }
      const data = await response.json();
      setConnectedUsers(data.users);
    } catch (error) {
      console.error("Error fetching connected users:", error);
    }
  };

  const fetchRoomMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/roomMessages/${roomCode}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch connected users");
      }
      const data = await response.json();
      if (data.roomMessages) {
        setMessages(data.roomMessages);
      }
    } catch (error) {
      console.error("Error fetching connected users:", error);
    }
  };

  const handleSendMessage = () => {
    if (savedUsername && newMessage && roomCode && socket) {
      socket.emit("handleSendMessage", {
        username: savedUsername,
        message: newMessage,
        code: roomCode,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { username: savedUsername, message: newMessage, code: roomCode },
      ]);
      setNewMessage("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (socket) {
      socket.emit("typing", { username: savedUsername, code: roomCode });
    }
  };

  const isInputEmpty = newMessage.trim() === "";

  const displayNotification = (notification: string) => {
    if (roomCode) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { username: "System", message: notification, code: roomCode },
      ]);
    }
  };

  useEffect(() => {
    let typingTimer: NodeJS.Timeout;

    if (socket) {
      socket.emit("associateSocketId", { userId });
    }

    if (roomCode) {
      fetchConnectedUsers();
      fetchRoomMessages();
    }

    if (socket) {
      socket.on(
        "handleSendMessage",
        ({ username, message, code }: MessageProps) => {
          if (code === roomCode) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { username, message, code },
            ]);
          }
        }
      );

      socket.on(
        "typing",
        ({ username, code }: { username: string; code: string }) => {
          if (code === roomCode && username !== savedUsername) {
            setOtherUser(username);
            setIsTyping(true);
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
              setIsTyping(false);
            }, 1000);
          }
        }
      );

      socket.on(
        "updatedUsers",
        ({
          code,
          users,
          newUser,
        }: {
          code: string;
          users: ConnectedUser[];
          newUser: string;
        }) => {
          if (code === roomCode) {
            setConnectedUsers(users);
            if (newUser) {
              displayNotification(`${newUser} has joined the chat.`);
            }
          }
        }
      );
    }

    return () => {
      clearTimeout(typingTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="container max-w-96">
        <h2 className="text-lg font-semibold text-green-700 mb-4 text-center">
          <span className="font-bold">Room Code:</span> {roomCode}
          <button
            onClick={copyRoomCodeToClipboard}
            className="bg-green-500 hover:bg-green-700 text-white font-bold text-center px-2 py-1 m-2 rounded"
          >
            <FontAwesomeIcon icon={copySuccess ? faCheck : faCopy} />
          </button>
        </h2>

        <div className="bg-green-100 border border-green-200 rounded-lg p-4 max-h-96 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col space-y-4">
            {/* Display messages */}
            {messages.map((message, index) => (
              <Message
                className={
                  message.username == "System"
                    ? "text-sm italic text-gray-500"
                    : ""
                }
                key={index}
                username={message.username}
                message={message.message}
              />
            ))}
            {/* Display typing notification */}
            <p
              className={`text-sm italic text-gray-500 ${
                isTyping
                  ? "opacity-100 transition-opacity duration-500 ease-in-out"
                  : "opacity-0 transition-opacity duration-500 ease-in-out"
              }`}
            >
              {otherUser} is typing...
            </p>
          </div>
        </div>
        {/* Input box for sending messages */}
        <div className="flex flex-row mt-2">
          <InputBox
            placeholder="Type your message..."
            value={newMessage}
            onChange={handleInputChange}
            className="border-green-300"
          />
          <Button
            label="Send"
            onClick={handleSendMessage}
            className=" bg-green-600 w-full max-w-full"
            disabled={isInputEmpty}
          />
        </div>
        {/* Display connected users */}
        <div className="mt-4 border border-gray-300 rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Connected Users:</h3>
          <ul className="list-disc pl-4">
            {connectedUsers.map((user, index) => (
              <li key={index} className="text-base text-gray-700">
                {user.username === savedUsername
                  ? `${user.username} (You)`
                  : user.username}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
