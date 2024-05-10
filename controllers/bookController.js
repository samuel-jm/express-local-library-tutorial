const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

exports.index = async (req, res, next) => {
  const [
    numBooks,
    numBookInstances,
    numAvailableBookInstances,
    numAuthors,
    numGenres,
  ] = await Promise.all([
    Book.countDocuments().exec(),
    BookInstance.countDocuments().exec(),
    BookInstance.countDocuments({ available: true }).exec(),
    Author.countDocuments().exec(),
    Genre.countDocuments().exec(),
  ]).catch((err) => next(err));

  console.log(typeof numBooks);

  res.render("index", {
    title: "Local Library Home",
    book_count: numBooks,
    book_instance_count: numBookInstances,
    book_instance_available_count: numAvailableBookInstances,
    author_count: numAuthors,
    genre_count: numGenres,
  });
};

exports.book_list = async (req, res, next) => {
  try {
    const allBooks = await Book.find({}, "title author")
      .sort({ title: 1 })
      .populate("author")
      .exec();

    console.log(allBooks[0].author.name);

    res.render("bookList", {
      title: "Book List",
      book_list: allBooks.map((book) => book.toJSON()),
    });
  } catch (err) {
    return next(err);
  }
};

exports.book_detail = (req, res, next) => {
  res.send(`TODO: Book detail: ${req.params.id}`);
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
