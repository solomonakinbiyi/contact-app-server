import express from "express";
import cors from "cors";
import { readdirSync } from "fs";

require("dotenv").config();

const app = express();

// middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//autoload routes
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

//port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`server is running on port ${port}`));
