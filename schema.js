const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CryptoSchema = new Schema({
  name: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
  base_unit: String,
});
const Crypto = model("Crypto", CryptoSchema);

const uri =
  "mongodb+srv://hasinichaithanya04:Mongodb123@cluster0.suc7fzf.mongodb.net/Crypto";

module.exports = {
  Crypto: Crypto,
  uri: uri,
};
