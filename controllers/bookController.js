const Book = require("../models/book");

exports.index = (req, res, next) => {
  res.sned("TODO: Site Home Page");
};

exports.book_list = (req, res, next) => {
  res.send("TODO: Book list");
};

exports.book_detail = (req, res, next) => {
  res.sned(`TODO: Book detail: ${req.params.id}`);
};

exports.book_create_get = (req, res, next) => {
  res.send("TODO: Book create GET");
};

exports.book_create_post = (req, res, next) => {
  res.send("TODO: Book create POST");
};

exports.book_delete_get = (req, res, next) => {
  res.send("TODO: Book delete GET");
};

exports.book_delete_post = (req, res, next) => {
  res.send("TODO: Book delete POST");
};

exports.book_update_get = (req, res, next) => {
  res.send("TODO: Book update GET");
};

exports.book_update_post = (req, res, next) => {
  res.send("TODO: Book update POST");
};
