"use client";

import { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd"; // Import COCO-SSD
import * as tf from "@tensorflow/tfjs"; // Import TensorFlow.js
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  path: "/api/socket", // Match the path in the server
});

export default function AIDetection() {
  const webcamRef = useRef<Webcam>(null);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null); // Use COCO-SSD type
  const [isDetecting, setIsDetecting] = useState(false); // Track detection state

  useEffect(() => {
    async function initializeTF() {
      await tf.setBackend("webgl"); // Explicitly set WebGL backend
      await tf.ready(); // Wait for TensorFlow.js to be ready
      console.log("TensorFlow.js backend:", tf.getBackend());
    }
    initializeTF();
  }, []);

  // Load the COCO-SSD model
  useEffect(() => {
    async function loadModel() {
      const loadedModel = await cocoSsd.load(); // Load COCO-SSD model
      setModel(loadedModel);
    }
    loadModel();
  }, []);

  // Start/stop continuous detection
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isDetecting && model) {
      interval = setInterval(() => {
        console.log('detecting')
        detect();
      }, 1000); // Detect every second
    }

    return () => {
      if (interval) clearInterval(interval); // Clean up on unmount or when detection stops
    };
  }, [isDetecting, model]);

  // Detect ball movement and update scores
  const detect = async () => {
    if (webcamRef.current && model) {
      const image = webcamRef.current.getScreenshot();
      const img = new Image();
      img.src = image as string;
      img.onload = async () => {
        // Detect objects in the image
        const predictions = await model.detect(img);
  
        // Check if a ball is detected
        const ballPrediction = predictions.find(
          (prediction) => prediction.class === "sports ball" // COCO-SSD class for "sports ball"
        );
  
        if (ballPrediction) {
          const [x, y, width, height] = ballPrediction.bbox; // Bounding box coordinates
          const ballCenterX = x + width / 2; // Calculate the center of the ball
  
          // Determine which side the ball is on
          const imageWidth = img.width; // Width of the captured image
          if (ballCenterX < imageWidth / 2) {
            // Ball is on the left side (Team A's side)
            const newScoreA = scoreA + 1;
            setScoreA(newScoreA);
            socket.emit("updateScore", { scoreA: newScoreA, scoreB });
          } else {
            // Ball is on the right side (Team B's side)
            const newScoreB = scoreB + 1;
            setScoreB(newScoreB);
            socket.emit("updateScore", { scoreA, scoreB: newScoreB });
          }
        }
      };
    }
  };

  // Listen for score updates from the server
  useEffect(() => {
    socket.on("scoreUpdated", (data) => {
      setScoreA(data.scoreA);
      setScoreB(data.scoreB);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Reset scores for a new match
  const resetScores = () => {
    setScoreA(0);
    setScoreB(0);
    socket.emit("updateScore", { scoreA: 0, scoreB: 0 });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      <Button
        onClick={() => setIsDetecting(!isDetecting)}
        className={isDetecting ? "bg-red-500" : "bg-green-500"}
      >
        {isDetecting ? "Stop Detection" : "Start Detection"}
      </Button>

      {/* Reset button */}
      <Button onClick={resetScores} className="bg-blue-500">
        Reset Scores
      </Button>
      <div className="flex space-x-8">
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
  );
}