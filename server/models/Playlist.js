const mongoose = require("mongoose");

const ingredientSchema = mongoose.Schema({
  type: { type: String },
  reference: { type: String },
  imageUrl: { type: String },
  name: {type: String}
});

const playlistSchema = mongoose.Schema({
  userId: { type: mongoose.ObjectId },
  playlistId: {type: String},
  ingredients: [ingredientSchema],
  noRemixes: { type: Boolean },
  noInstrumentals: { type: Boolean },
  name: { type: String, unique: 1 },
  description: { type: String },
  public: { type: Boolean },
});

const Playlist = mongoose.model("Playlist", playlistSchema);
const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = { Playlist, Ingredient };
