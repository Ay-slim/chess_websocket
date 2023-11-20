import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const port = 1337;
httpServer.listen(port);
console.log(`Web socket listening on port ${port}`);

io.on("connection", (socket) => {
  socket.on(
    "validMove",
    (move: {
      srcSquareId: string;
      targetSquareId: string;
      pieceId: string;
      opponentId: string;
    }) => {
      io.emit(move.opponentId, move);
    },
  );
});
