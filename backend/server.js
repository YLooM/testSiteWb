const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create a new Express application
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "https://resplendent-fairy-c401cc.netlify.app/games",
      "https://testsitewb.onrender.com",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
});

app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "https://resplendent-fairy-c401cc.netlify.app/games",
      "https://testsitewb.onrender.com",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  })
);

// MongoDB connection string and client setup
const uri =
  "mongodb+srv://adnane552:syyhoPq5h1WUr4PW@ultimate-website.khl5l93.mongodb.net/?retryWrites=true&w=majority&appName=ultimate-website";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Function to connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

// Connect to MongoDB
connectToMongoDB();

// Middleware for token authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    console.log("No token provided");
    return res.sendStatus(403);
  }

  jwt.verify(token, "secret_key", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join_game", (roomId, callback) => {
    if (!roomId) {
      console.log("No room ID provided");
      callback(null);
      return;
    }
    socket.join(roomId);
    const room = io.sockets.adapter.rooms.get(roomId);
    let color = "white";
    if (room.size === 1) {
      color = "white";
    } else if (room.size === 2) {
      color = "black";
    } else {
      console.log("Room is full");
      callback(null);
      return;
    }
    console.log(`Client joined room: ${roomId} as ${color}`);
    callback(color);
    io.to(roomId).emit("game_status", {
      message: `Player joined room ${roomId} as ${color}`,
    });
  });

  socket.on(
    "make_move",
    ({
      roomId,
      move,
      inCheck,
      checkMate,
      currentPlayer,
      enPassant,
      hasMoved,
      board,
    }) => {
      console.log("Move made in room:", roomId, "by", currentPlayer);
      socket.to(roomId).emit("move_made", {
        move,
        inCheck,
        checkMate,
        currentPlayer,
        enPassant,
        hasMoved,
        board,
      });
    }
  );

  socket.on("disconnect", async () => {
    console.log("Client disconnected");

    // Iterate through all rooms the socket was part of
    const rooms = Array.from(socket.rooms).filter(
      (roomId) => roomId !== socket.id
    );

    for (const roomId of rooms) {
      const room = io.sockets.adapter.rooms.get(roomId);

      // Check if the room is empty
      if (!room || room.size === 0) {
        console.log(`Room ${roomId} is empty, deleting lobby from database.`);
        try {
          await client
            .db("signup")
            .collection("lobbies")
            .deleteOne({ _id: new ObjectId(roomId) });
          console.log(`Lobby ${roomId} deleted from database.`);
        } catch (err) {
          console.error("Error deleting lobby:", err);
        }
      }
    }
  });
});

// Function to check and delete empty lobbies
async function checkAndDeleteEmptyLobbies() {
  try {
    const lobbies = await client
      .db("signup")
      .collection("lobbies")
      .find({})
      .toArray();

    //console.log("Checking lobbies for active players...");

    for (const lobby of lobbies) {
      const roomId = lobby._id.toString();
      const room = io.sockets.adapter.rooms.get(roomId);

      if (!room || room.size === 0) {
        console.log(`Lobby ${roomId} is empty, deleting it from the database.`);
        await client
          .db("signup")
          .collection("lobbies")
          .deleteOne({ _id: new ObjectId(roomId) });
        console.log(`Lobby ${roomId} deleted.`);
      } else {
        console.log(`Lobby ${roomId} still has players.`);
      }
    }
  } catch (err) {
    console.error("Error checking or deleting lobbies:", err);
  }
}

// Set up a timer to run the check every 30 seconds
setInterval(checkAndDeleteEmptyLobbies, 30000);

// Route to fetch all users (for admin purposes)
app.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await client
      .db("signup")
      .collection("users")
      .find({}, { projection: { email: 1, username: 1, timeSpent: 1 } })
      .toArray();
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to register a new user
app.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await client.db("signup").collection("users").insertOne({
      email,
      username,
      password: hash,
      timeSpent: 0,
      timeSpentOnChess: 0,
      timeSpentOnTetris: 0,
      timeSpentOnSpaceInv: 0,
    });
    res.send({ message: "User registered" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to login
app.post("/login", async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    const user = await client
      .db("signup")
      .collection("users")
      .findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      "secret_key",
      { expiresIn: "1h" }
    );
    res.send({ message: "Login successful", token });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to update time spent
app.post("/track-time", authenticateToken, async (req, res) => {
  const { timeSpent, game } = req.body;
  const userId = new ObjectId(req.user.id);

  try {
    const update = { $inc: { timeSpent: timeSpent } };
    if (game) {
      update.$inc[`timeSpentOn${game}`] = timeSpent;
    }

    const result = await client
      .db("signup")
      .collection("users")
      .updateOne({ _id: userId }, update);

    if (result.modifiedCount === 1) {
      res.json({ success: true, message: "Time tracked successfully" });
    } else {
      res.status(404).send({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error("Error tracking time:", err);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
});

// Route to get time spent
app.get("/get-time-spent/:id", authenticateToken, async (req, res) => {
  const userId = new ObjectId(req.params.id);
  try {
    const user = await client
      .db("signup")
      .collection("users")
      .findOne(
        { _id: userId },
        {
          projection: {
            timeSpent: 1,
            timeSpentOnChess: 1,
            timeSpentOnTetris: 1,
            timeSpentOnSpaceInv: 1,
          },
        }
      );

    if (user) {
      res.json({
        totalTimeSpent: user.timeSpent || 0,
        timeSpentOnChess: user.timeSpentOnChess || 0,
        timeSpentOnTetris: user.timeSpentOnTetris || 0,
        timeSpentOnSpaceInv: user.timeSpentOnSpaceInv || 0,
      });
    } else {
      res.status(404).send({ success: false, message: "User not found" });
    }
  } catch (err) {
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
});

// System to create and join a lobby
app.post("/create-lobby", authenticateToken, async (req, res) => {
  const { lobbyName } = req.body;
  const userId = req.user.id;

  try {
    const newLobby = {
      name: lobbyName,
      host: userId,
      players: [userId],
      createdAt: new Date(),
    };

    const result = await client
      .db("signup")
      .collection("lobbies")
      .insertOne(newLobby);

    console.log("New Lobby Created:", newLobby);

    res.json({ success: true, lobbyId: result.insertedId });
  } catch (err) {
    console.error("Error creating lobby:", err);
    res.status(500).send({ success: false, error: "Failed to create lobby" });
  }
});

app.get("/fetch-lobbies", async (req, res) => {
  try {
    const lobbies = await client
      .db("signup")
      .collection("lobbies")
      .find({})
      .toArray();

    console.log("Lobbies in database:", lobbies);

    res.send({ success: true, lobbies });
  } catch (err) {
    console.error("Error fetching lobbies:", err);
    res.status(500).send({ success: false, error: "Failed to fetch lobbies" });
  }
});

// Start the server
server.listen(5000, () => {
  console.log("Server started on port 5000");
});
