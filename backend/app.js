const express = require("express");
const usersRoutes = require("./routes/utilisateur-routes");
const equipesRoutes = require("./routes/equipes-routes");
const errorHandler = require("./handler/error-handler");
const mongoose = require("mongoose");

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://2027802:XSSfBZLAGRF8f4yR@cluster-tpsynthese.njoxi6v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-tpsynthese";
const PORT = process.env.PORT || 5000;
mongoose
  .connect(uri)
  .then(() => {
    console.log("connexion BD réussie!");
  })
  .catch(() => {
    console.log("connexion BD échouée...");
  });

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/equipes", equipesRoutes);

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new Error("Route non trouvée");
  error.code = 404;
  next(error);
});

app.use(errorHandler);

app.listen(5000);
