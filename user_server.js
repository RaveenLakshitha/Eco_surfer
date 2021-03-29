const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Route files
const auth = require("./routes/auth");
const posts = require("./routes/posts");
const User = require("./routes/users");
const react = require("./routes/Reactions");
//Connect to Database
connectDB();

//Initialize app variable with express
const app = express();

//body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//File uploading
app.use(fileupload());

//Sanitize Data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS headers
app.use(xss());

//Rate limit
const limit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});

app.use(limit);

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

//Mount ROuters
app.use("/api/v1/auth", auth);
app.use("/api/v1/Ecoposts", posts);
app.use("/api/v1/reacts", react);
app.use("/api/v1/EcoUsers", User);
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
