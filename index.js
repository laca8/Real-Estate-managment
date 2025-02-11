const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const globalError = require("./middlwares/errorHandler");
dotenv.config();
const connDb = require("./config/db");

const ApiError = require("./utils/AppError");
const app = express();
//protect xss
app.use(xss());
// Basic security headers with Helmet
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all requests
app.use(limiter);

// static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connDb();

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "../clients/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../clients", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is running...");
  });
}
//routes
app.use("/api/user", require("./routes/user"));
app.use("/api/agent", require("./routes/agent"));
app.use("/api/property", require("./routes/property"));

app.use("*", (req, res, next) => {
  next(new ApiError("this route not found", 404));
});
app.use(globalError);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running at port ${PORT}...`);
});
