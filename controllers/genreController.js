const Genre = require("../models/genre");
const Book = require("../models/book");

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

exports.genre_detail = async (req, res, next) => {
  try {
    const [genre, booksInGenre] = await Promise.all([
      Genre.findById(req.params.id).exec(),
      Book.find({ genre: req.params.id }, "title summary").exec(),
    ]);
    if (genre === null) {
      const err = new Error("Genre not found");
      err.status = 404;
      return next(err);
    }

    console.log(genre);

    res.render("genreDetail", {
      title: "Genre Detail",
      genre: genre.toJSON(),
      genre_books: booksInGenre.map((book) => book.toJSON()),
    });
  } catch (err) {
    return next(err);
  }
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
