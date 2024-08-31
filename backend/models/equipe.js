const mongoose = require("mongoose");
const EquipeSchema = new mongoose.Schema({
  nomEquipe: { type: String, required: true },
  imageUrl: { type: String, required: true },
  sport: { type: String, required: true },
});
module.exports = mongoose.model("Equipe", EquipeSchema);
