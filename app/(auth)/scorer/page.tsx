import AIDetection from "./ai-detection";

export default function Scorer() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Score Screen</h1>
      <AIDetection />
    </div>
  );
}