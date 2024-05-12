const { body, validationResult } = require("express-validator");
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
  res.render("authorForm", { title: "Create Author" });
};

exports.author_create_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Date should be in the form dd/mm/yyyy.")
    .toDate(),
  body("date_of_death")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Date should be in the form dd/mm/yyyy.")
    .toDate(),
  async (req, res, next) => {
    const errors = validationResult(req);

    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      res.render("authorForm", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
    } else {
      await author.save();
      res.redirect(author.url);
    }
  },
];

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
