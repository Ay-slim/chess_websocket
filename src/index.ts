import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

type MoveType = {
  srcSquareId: string;
  targetSquareId: string;
  pieceId: string;
  opponentId: string;
  promotionSquaresInfo?: {
    src: string;
    dest: string;
  };
};

type VideoCallType = {
  opponentId: string;
  signalData: string; //not actually a string, only stating that so eslint will let me commit in peace. The type really doesn't matter as websocket simply pipes it back as is
};

type JoinedGameType = {
  selfId: string;
  initiatorId: string;
};

const httpServer = createServer();
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const port = process.env.PORT || 1337;
httpServer.listen(port);
console.log(`Web socket listening on port ${port}`);

// Add the status endpoint handler to the server's routing table
httpServer.on("request", (req, res) => {
  if (req.url === "/status") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("App is running");
    return;
  }
});

io.on("connection", (socket) => {
  socket.on("validMove", (move: MoveType) => {
    io.to(move.opponentId).emit("validMove", move);
  });

  socket.on("joinedGame", (joinedGameData: JoinedGameType) => {
    io.to(joinedGameData.initiatorId).emit("joinedGame", joinedGameData.selfId);
  });

  socket.on("resignation", (opponentId: string) => {
    io.to(opponentId).emit("resignation");
  });

  socket.on("initiateVideoCall", (initiatePacket: VideoCallType) => {
    io.to(initiatePacket.opponentId).emit(
      `initiateVideoCall`,
      initiatePacket.signalData,
    );
  });

  socket.on("joinVideoCall", (joinPacket: VideoCallType) => {
    io.to(joinPacket.opponentId).emit(`joinVideoCall`, joinPacket.signalData);
  });

  socket.on("initiatorVideoOff", (opponentId) => {
    io.to(opponentId).emit(`initiatorVideoOff`);
  });

  socket.on("initiatorVideoOn", (opponentId) => {
    io.to(opponentId).emit(`initiatorVideoOn`);
  });
});
