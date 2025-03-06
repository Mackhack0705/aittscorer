"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function GameForm() {
  const router = useRouter();
  const [players, setPlayers] = useState(1);
  const [winningScore, setWinningScore] = useState(11);

  const handleStartGame = () => {
    router.push(`/scorer?players=${players}&winningScore=${winningScore}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Game Setup</h1>
        <div className="space-y-4">
          <div>
            <Label>Number of Players per Team</Label>
            <select
              value={players}
              onChange={(e) => setPlayers(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>
          <div>
            <Label>Winning Score</Label>
            <Input
              type="number"
              value={winningScore}
              onChange={(e) => setWinningScore(parseInt(e.target.value))}
            />
          </div>
          <Button onClick={handleStartGame} className="w-full">
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
}