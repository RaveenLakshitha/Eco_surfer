const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Route files
const users = require("./routes/users");
const posts = require("./routes/posts");
//Connect to Database
connectDB();

//Initialize app variable with express
const app = express();

//body parser
app.use(express.json());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Mount ROuters
app.use("/api/v1/EcoUsers", users);
app.use("/api/v1/Ecoposts", posts);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

//To run the server
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server and exit process
  server.close(() => process.exit(1));
});
