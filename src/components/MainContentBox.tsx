"use client";
import React, { useState, useRef, useEffect } from "react";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

const MainContentBox: React.FC = () => {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const userId = useRef(uuidv4());
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
  };

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCode(e.target.value);
  };

  const handleJoinRoom = async () => {
    try {
      if (userId && username && roomCode) {
        const response = await fetch("http://localhost:3001/api/joinRoom", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, userId, roomCode }),
        });

        if (!response.ok) {
          throw new Error(`Room ${roomCode} does not exist.`);
        }
        router.push(
          `/room?code=${encodeURIComponent(
            roomCode
          )}&username=${encodeURIComponent(username)}&userId=${userId.current}`
        );
      }
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleCreateRoom = async () => {
    try {
      if (userId && username) {
        const response = await fetch("http://localhost:3001/api/createRoom", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, username }),
        });

        if (!response.ok) {
          throw new Error("Failed to create room.");
        }

        const { roomCode } = await response.json();
        router.push(
          `/room?code=${encodeURIComponent(
            roomCode
          )}&username=${encodeURIComponent(username)}&userId=${userId.current}`
        );
      }
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  const isInputEmpty = username.trim() === "" || roomCode.trim() === "";

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="container max-w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Welcome to the Chat Room
        </h1>
        <div className="flex flex-col space-y-4">
          <InputBox
            placeholder="Your username"
            value={username}
            onChange={handleUsernameChange}
          />
          <div className="flex flex-col sm:flex-row">
            <InputBox
              placeholder="Room code"
              value={roomCode}
              onChange={handleRoomCodeChange}
              className="mb-2 sm:mb-0 sm:mr-2"
            />
            <Button
              label="JOIN ROOM"
              onClick={handleJoinRoom}
              disabled={isInputEmpty}
              className="w-full max-w-full"
            />
          </div>
          <Button
            label="CREATE ROOM"
            onClick={handleCreateRoom}
            disabled={username.trim() === ""}
            className="w-full"
          />
        </div>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default MainContentBox;
