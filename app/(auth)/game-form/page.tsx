"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "@/auth";

export default function Game() {
  const [players, setPlayers] = useState(1);
  const [winningScore, setWinningScore] = useState(11);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/auth");
    }
  }, []);

  const onStartGame = (gameDetails: { players: number; winningScore: number }) => {
    router.push({
      pathname: "/score",
      query: gameDetails,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame({ players, winningScore });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <Button type="submit" className="w-full">
        Start Game
      </Button>
    </form>
  );
}