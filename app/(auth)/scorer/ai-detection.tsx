"use client";

import { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd"; // Import COCO-SSD
import * as tf from "@tensorflow/tfjs"; // Import TensorFlow.js
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  path: "/api/socket"
});

export default function AIDetection() {
  const webcamRef = useRef<Webcam>(null);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null); // Use COCO-SSD type

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
        const ballDetected = predictions.some(
          (prediction) => prediction.class === "sports ball" // COCO-SSD class for "sports ball"
        );

        // Update scores if a ball is detected
        if (ballDetected) {
          const newScoreB = scoreB + 1;
          setScoreB(newScoreB);
          socket.emit("updateScore", { scoreA, scoreB: newScoreB });
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

  return (
    <div className="flex flex-col items-center space-y-4">
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      <Button onClick={detect}>Detect Score</Button>
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