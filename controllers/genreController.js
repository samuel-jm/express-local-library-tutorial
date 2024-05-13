const { body, validationResult } = require("express-validator");

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
  res.render("genreForm", { title: "Create Genre" });
};

exports.genre_create_post = [
  body("name", "Genre must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const genre = new Genre({ name: req.body.name });

      if (!errors.isEmpty()) {
        res.render("genreForm", {
          title: "Create Genre",
          genre,
          errors: errors.array(),
        });
      } else {
        const genreExists = await Genre.findOne({ name: req.body.name })
          .collation({ locale: "en", strength: 2 })
          .exec();
        if (genreExists) {
          res.redirect(genreExists.url);
        } else {
          genre.save();
          res.redirect(genre.url);
        }
      }
    } catch (err) {
      return next(err);
    }
  },
];

exports.genre_delete_get = async (req, res, next) => {
  const [genre, books] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({genre: req.params.id}, "title summary").exec()
  ])

  if(genre === null) {
    res.redirect("/catalog/genres");
  }

  res.render("genreDelete", {
    title: "Delete Genre",
    genre,
    books
  })  
};

exports.genre_delete_post = async (req, res, next) => {
  const [genre, books] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({genre: req.params.id}, "title summary").exec()
  ])
  
  if(books.length > 0) {
    res.render("genreDelete", {
      title: "Delete Genre",
      genre,
      books
    })  
  } else {
    await Genre.findByIdAndDelete(req.body.genreid);
    res.redirect("/catalog/genres");
  }

};

exports.genre_update_get = async (req, res, next) => {
  const genre = await Genre.findById(req.params.id)

  res.render("genreForm", {
    title: "Update Genre",
    genre
  })
};

exports.genre_update_post = [
  body("name", "Genre must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const genre = new Genre({ name: req.body.name, _id: req.params.id });

      if (!errors.isEmpty()) {
        res.render("genreForm", {
          title: "Create Genre",
          genre,
          errors: errors.array(),
        });
      } else {
        const genreExists = await Genre.findOne({ name: req.body.name })
          .collation({ locale: "en", strength: 2 })
          .exec();
        if (genreExists) {
          res.redirect(genreExists.url);
        } else {
          await Genre.findByIdAndUpdate(req.params.id, genre)
          res.redirect(genre.url);
        }
      }
    } catch (err) {
      return next(err);
    }
  },
];
