"use client";

import { useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VideoAnalysis() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideoFile(e.target.files[0]);
    }
  };

  const analyzeVideo = async () => {
    if (!videoFile) return;

    setIsProcessing(true);

    // Step 1: Convert video to frames (using FFmpeg)
    const formData = new FormData();
    formData.append("video", videoFile);

    const response = await fetch("/api/process-video", {
      method: "POST",
      body: formData,
    });

    const { frames } = await response.json();

    // Step 2: Analyze frames using TensorFlow.js
    const model = await tf.loadGraphModel("/path/to/your/model.json");
    let teamAScore = 0;
    let teamBScore = 0;

    for (const frame of frames) {
      const img = new Image();
      img.src = frame;
      img.onload = async () => {
        const tensor = tf.browser.fromPixels(img).expandDims(0);
        const predictions = await model.executeAsync(tensor);
        // Process predictions to update scores
        // Example: If ball is on Team A's side, increment Team B's score
        teamBScore += 1;
      };
    }

    // Step 3: Determine the winner
    setScoreA(teamAScore);
    setScoreB(teamBScore);
    setWinner(teamAScore > teamBScore ? "Team A" : "Team B");
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Video Analysis</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="space-y-4">
          <div>
            <Label>Upload Match Video</Label>
            <Input type="file" accept="video/*" onChange={handleFileChange} />
          </div>
          <Button onClick={analyzeVideo} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Analyze Video"}
          </Button>
          {winner && (
            <div className="mt-4">
              <h2 className="text-xl font-bold">Final Score</h2>
              <p>Team A: {scoreA}</p>
              <p>Team B: {scoreB}</p>
              <p className="text-green-600 font-bold">Winner: {winner}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}