const Genre = require("../models/genre");

exports.genre_list = async (req, res, next) => {
  try {
    const allGenres = await Genre.find().sort({ name: 1 }).exec();

    res.render("genreList", {
      title: "Genre List",
      genre_list: allGenres.map((genre) => genre.toJSON()),
    });
  } catch (err) {
    return next(err);
  }
};

exports.genre_detail = (req, res, next) => {
  res.send(`TODO: Genre detail: ${req.params.id}`);
};

exports.genre_create_get = (req, res, next) => {
  res.send("TODO: Genre create GET");
};

exports.genre_create_post = (req, res, next) => {
  res.send("TODO: Genre create POST");
};

exports.genre_delete_get = (req, res, next) => {
  res.send("TODO: Genre delete GET");
};

exports.genre_delete_post = (req, res, next) => {
  res.send("TODO: Genre delete POST");
};

exports.genre_update_get = (req, res, next) => {
  res.send("TODO: Genre update GET");
};

exports.genre_update_post = (req, res, next) => {
  res.send("TODO: Genre update POST");
};
