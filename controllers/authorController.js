const { body, validationResult } = require("express-validator");
const Author = require("../models/author");
const Book = require("../models/book");

exports.author_list = async (req, res, next) => {
  try {
    const allAuthors = await Author.find().sort({ family_name: 1 }).exec();

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

exports.author_delete_get = async (req, res, next) => {
  const [author, authorBooks] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({author: req.params.id}, "title summary").exec()
  ])

  if(author === null) {
    res.redirect("/catalog/authors");
  }

  res.render("authorDelete", {
    title: "Delete Author",
    author: author,
    author_books: authorBooks
  })
};

exports.author_delete_post = async (req, res, next) => {
  const [author, authorBooks] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({author: req.params.id}, "title summary").exec()
  ])

  if(authorBooks.length > 0) {
    res.render("authorDelete", {
      title: "Delete Author",
      author: author,
      author_books: authorBooks
    })
  } else {
    await Author.findByIdAndDelete(req.body.authorid);
    res.redirect("/catalog/authors")
  }
};

exports.author_update_get = async (req, res, next) => {
  const author = await Author.findById(req.params.id).exec();

  res.render("authorForm", { title: "Create Author", author });
};

exports.author_update_post = [
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
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      res.render("authorForm", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
    } else {
      await Author.findByIdAndUpdate(author._id, author);
      res.redirect(author.url);
    }
  }]
