// import type { Server as HTTPServer } from "http";
// import type { Socket as NetSocket } from "net";
// import { NextApiResponse } from "next";
// import { NextResponse } from "next/server";
// import { Server } from "socket.io";
// import type { Server as IOServer } from "socket.io";

// // import { createServer } from "node:http";

// export const dynamic = "force-dynamic"; // Ensure the route is dynamic

// interface SocketServer extends HTTPServer {
//   io?: IOServer | undefined;
// }

// interface SocketWithIO extends NetSocket {
//   server: SocketServer;
// }

// interface NextApiResponseWithSocket extends NextApiResponse {
//   socket: SocketWithIO;
// }

// export async function GET(res: NextApiResponseWithSocket) {
//   if (res.socket?.server?.io) {
//     res
//       .status(200)
//       .json({
//         success: true,
//         message: "Socket is already running",
//         socket: `:${3001}`,
//       });
//     return;
//   }
//   console.log("Initializing Socket.IO server ...");
//   const io = new Server(res.socket.server, {
//     path: "/api/socket",
//     addTrailingSlash: false,
//     cors: { origin: "*" },
//   }).listen(3001);

//   io.on("connection", (socket) => {
//     console.log("A user connected");

//     socket.on("disconnect", () => {
//       console.log("A user disconnect");
//     });
//   });
  
//   res.socket.server.io = io;
//   res.json({ success: true, message: "Socket is started", socket: `${3001}` });

//   // if (!io) {
//   //     const server = createServer((req, res) => res.end());
//   //     io = new Server(server);
//   //     server.listen(3001, () => {
//   //         console.log("Socket.IO server running on port 3001");
//   //     });

//   //     io.on("connection", (socket) => {
//   //         console.log("A user connected");
//   //         socket.on("updateScore", (data) => {
//   //             if (io) {
//   //                 io.emit("scoreUpdated", data);
//   //             }
//   //         });
//   //     });
//   // }
//   return NextResponse.json({ message: "Socket.IO server initialized" });
// }
