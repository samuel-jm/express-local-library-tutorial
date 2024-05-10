const createError = require("http-errors");
const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog");

Handlebars.registerHelper("ifEquals", function (a, b, options) {
  return a == b ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("ifNotEquals", function (a, b, options) {
  return a != b ? options.fn(this) : options.inverse(this);
});

const app = express();

// databse setup
mongoose.set("strictQuery", false);

const mongoDB = "mongodb://127.0.0.1/local-library";

async function connectToDB() {
  await mongoose.connect(mongoDB);
}

try {
  connectToDB();
} catch (err) {
  console.error(err);
}

// view engine setup
app.engine(
  "hbs",
  handlebars.engine({
    layoutsDir: "./views",
    extname: "hbs",
    defaultLayout: "layout",
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

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
