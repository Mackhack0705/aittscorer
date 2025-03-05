import { useState } from "react";
import Webcam from "react-webcam";

export default function Score() {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Score Screen</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <Webcam className="mb-4" />
        <div className="flex justify-between">
          <div className="text-center">
            <h2 className="text-xl">Team A</h2>
            <p className="text-3xl">{scoreA}</p>
          </div>
          <div className="text-center">
            <h2 className="text-xl">Team B</h2>
            <p className="text-3xl">{scoreB}</p>
          </div>
        </div>
      </div>
    </div>
  );
}