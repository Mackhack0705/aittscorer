import { NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const videoFile = formData.get("video") as File;

  // Save the uploaded video to a temporary file
  const tempVideoPath = path.join(process.cwd(), "temp", videoFile.name);
  const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
  fs.writeFileSync(tempVideoPath, videoBuffer);

  // Extract frames from the video using FFmpeg
  const frames: string[] = [];
  const tempFramesDir = path.join(process.cwd(), "temp", "frames");
  if (!fs.existsSync(tempFramesDir)) {
    fs.mkdirSync(tempFramesDir, { recursive: true });
  }

  await new Promise((resolve, reject) => {
    ffmpeg(tempVideoPath)
      .on("end", () => resolve(frames))
      .on("error", (err) => reject(err))
      .screenshot({
        folder: tempFramesDir,
        filename: "frame-%i.png",
        count: 10, // Extract 10 frames for analysis
      });
  });

  // Read frames as base64 strings
  const frameFiles = fs.readdirSync(tempFramesDir);
  for (const file of frameFiles) {
    const framePath = path.join(tempFramesDir, file);
    const frameBuffer = fs.readFileSync(framePath);
    frames.push(`data:image/png;base64,${frameBuffer.toString("base64")}`);
  }

  // Clean up temporary files
  fs.unlinkSync(tempVideoPath);
  fs.rmSync(tempFramesDir, { recursive: true });

  return NextResponse.json({ frames });
}