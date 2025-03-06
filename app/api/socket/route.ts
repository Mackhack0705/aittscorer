import { NextResponse } from "next/server";
import { Server } from "socket.io";
import { createServer } from "http";

export const dynamic = "force-dynamic"; // Ensure the route is dynamic
let io: Server | null = null;

export default function GET() {
    console.log('bye there');

    if (!io) {
        const server = createServer((req, res) => res.end());
        io = new Server(server);
        server.listen(3001, () => {
            console.log("Socket.IO server running on port 3001");
        });

        io.on("connection", (socket) => {
            console.log("A user connected");
            socket.on("updateScore", (data) => {
                if (io) {
                    io.emit("scoreUpdated", data);
                }
            });
        });
    }
    return NextResponse.json({ message: "Socket.IO server initialized" });
};
