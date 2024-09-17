const mongoose = require("mongoose");
const { Crypto, uri } = require("./schema.js");
const cors = require("cors");
const express = require("express");
const axios = require("axios");
const app = express();
app.use(cors());
app.use(express.json());
let dbConnection = false;

mongoose
  .connect(uri)
  .then(() => {
    dbConnection = true;
    console.log("Database connection is Successful");
  })
  .catch((e) => {
    console.log("Error connecting to database: ", e);
  });

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

const fetchTop10Data = async () => {
  try {
    const { data } = await axios.get("https://api.wazirx.com/api/v2/tickers");
    const top10 = Object.values(data).slice(0, 10);
    await Crypto.deleteMany();

    const cryptoData = top10.map((item) => ({
      name: item.name,
      last: parseFloat(item.last),
      buy: parseFloat(item.buy),
      sell: parseFloat(item.sell),
      volume: parseFloat(item.volume),
      base_unit: item.base_unit,
    }));

    await Crypto.insertMany(cryptoData);
    console.log("Top 10 cryptocurrencies fetched and saved to MongoDB");
  } catch (err) {
    console.log("Error fetching data from WazirX API");
  }
};
fetchTop10Data();

setInterval(fetchTop10Data, 10000);
app.get("/getTop10", async (req, res) => {
  try {
    const top10Cryptos = await Crypto.find();
    res.json(top10Cryptos);
  } catch (err) {
    res.status(500).send("Error fetching data from database");
  }
});
