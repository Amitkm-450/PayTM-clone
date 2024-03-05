const express = require("express");
const cors = require("cors");
const app = express();
const {connectDB} = require('./db');

app.use(cors())
app.use(express.json());

const rootRouter = require("./routes/index");

connectDB();


app.use("/api/v1", rootRouter);


app.listen(3000);
