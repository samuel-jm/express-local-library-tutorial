const Author = require("../models/author");
const Book = require("../models/book");

exports.author_list = async (req, res, next) => {
  try {
    const allAuthors = await Author.find().sort({ family_name: 1 }).exec();

    console.log(allAuthors);

    res.render("authorList", {
      title: "Author List",
      author_list: allAuthors.map((author) => author.toJSON()),
    });
  } catch (err) {
    return next(err);
  }
};

exports.author_detail = async (req, res, next) => {
  try {
    const [author, allBooksByAuthor] = await Promise.all([
      Author.findById(req.params.id).exec(),
      Book.find({ author: req.params.id }, "title summary").exec(),
    ]);

    if (author === null) {
      const err = new Error("Author not found");
      err.status = 404;
      return next(err);
    }

    res.render("authorDetail", {
      title: "Author Detail",
      author: author.toJSON(),
      author_books: allBooksByAuthor.map((book) => book.toJSON()),
    });
  } catch (err) {
    return next(err);
  }
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
