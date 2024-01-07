import { Server, Socket } from "socket.io";

export default function (server) {
  if (server.httpServer) {
    const io = new Server(server.httpServer);

    io.on("connection", (socket: Socket) => {
      socket.on("join-room", async (roomID: string) => {
        socket.join(roomID);
        const users = await io.in(roomID).fetchSockets();
        socket.to(roomID).emit("user-joined", socket.id);
        socket.emit("users", [...users.map((user) => user.id)]);
      });

      socket.on(
        "offer",
        (payload: {
          target: string;
          caller: string | undefined;
          sdp: RTCSessionDescription | null;
        }) => {
          io.to(payload.target).emit("offer", payload);
        }
      );

      socket.on(
        "answer",
        (payload: {
          target: any;
          caller: string | undefined;
          sdp: RTCSessionDescription | null;
        }) => {
          io.to(payload.target).emit("answer", payload);
        }
      );

      socket.on("ice-candidate", (incoming) => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
      });

      socket.on("end-call", (data) => {
        io.to(data.to).emit("end-call", data);
      });

      socket.on("disconnecting", (reason) => {
        for (const room of socket.rooms) {
          if (room !== socket.id) {
            socket.to(room).emit("user-left", socket.id);
          }
        }
      });
    });
  }
};
