const Author = require("../models/author");

exports.author_list = (req, res, next) => {
  res.send("TODO: Author list");
};

exports.author_detail = (req, res, next) => {
  res.send(`TODO: Author detail: ${req.params.id}`);
};

exports.author_create_get = (req, res, next) => {
  res.send("TODO: Author create GET");
};

exports.author_create_post = (req, res, next) => {
  res.send("TODO: Author create POST");
};

exports.author_delete_get = (req, res, next) => {
  res.send("TODO: Author delete GET");
};

exports.author_delete_post = (req, res, next) => {
  res.send("TODO: Author delete POST");
};

exports.author_update_get = (req, res, next) => {
  res.send("TODO: Author update GET");
};

exports.author_update_post = (req, res, next) => {
  res.send("TODO: Author update POST");
};
