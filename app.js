const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog");

const app = express();

// databse setup
mongoose.set("strictQuery", false);

const dev_db_url = "mongodb://127.0.0.1/local-library"
const mongoDB = process.env.MONGODB_URI || dev_db_url;

async function connectToDB() {
  await mongoose.connect(mongoDB);
}

try {
  connectToDB();
} catch (err) {
  console.error(err);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
})

app.use(compression());
// app.use(limiter);
app.use(helmet())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
