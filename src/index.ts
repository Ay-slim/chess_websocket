import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const httpServer = createServer();
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const port = process.env.PORT || 1337;
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
      promotionSquaresInfo?: {
        src: string;
        dest: string;
      };
    }) => {
      io.emit(move.opponentId, move);
    },
  );

  socket.on("joinedGame", (opponentId: string) => {
    io.emit(`${opponentId}-joined`);
  });
});
