const express = require('express');
const mongoose = require('mongoose'); 
const app = express();
const cors=require("cors");
require ("dotenv").config();
const port= process.env.PORT || 4000
app.use(cors());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected Successfully! ✅"))
  .catch(err => {
    console.log("Database Connection Error: ❌");
    console.error(err.message);
  });
app.get('/', (req, res) => {
    res.send("অভিনন্দন! ৬৪-জেলা প্রজেক্টের সার্ভার চালু হয়েছে।");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});