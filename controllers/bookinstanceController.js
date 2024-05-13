const BookInstance = require("../models/bookinstance");
const Book = require("../models/book")
const { body, validationResult } = require("express-validator")

exports.bookinstance_list = async (req, res, next) => {
  try {
    const allBookInstances = await BookInstance.find().populate("book").exec();

    res.render("bookinstanceList", {
      title: "Book Instance List",
      bookinstance_list: allBookInstances.map((instance) => instance.toJSON()),
    });
  } catch (err) {
    return next(err);
  }
};

exports.bookinstance_detail = async (req, res, next) => {
  try {
    const bookInstance = await BookInstance.findById(req.params.id)
      .populate("book")
      .exec();

    if (bookInstance === null) {
      const err = new Error("Book copy not found");
      err.status = 404;
      return next(err);
    }

    res.render("bookinstanceDetail", {
      title: "Book:",
      bookinstance: bookInstance.toJSON(),
    });
  } catch (err) {
    return next(err);
  }
};

exports.bookinstance_create_get = async (req, res, next) => {
  const books = await Book.find({}, "title").sort({title: 1}).exec();

  res.render("bookinstanceForm", {
    title: "Create BookInstance",
    book_list: books,
  })
};

exports.bookinstance_create_post = [
  body("book", "Book must be specified").trim().isLength({min: 1}).escape(),
  body("imprint", "Imprint must be specified").trim().isLength({min: 1}).escape(),
  body("status").escape(),
  body("due_back", "Invalid date").optional({values: "falsy"}).isISO8601().toDate(),
  async (req, res, next) => {
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    });

    if(!errors.isEmpty()) {
      const books = await Book.find({}, "title").sort({title: 1}).exec();

      res.render("bookinstanceForm", {
        title: "Create BookInstance",
        book_list: books,
        selected_book: bookInstance.book._id,
        errors: errors.array(),
        bookinstance: bookInstance
      })
    } else {
      await bookInstance.save();
      res.redirect(bookInstance.url);
    }
  }
]

exports.bookinstance_delete_get = async (req, res, next) => {
  const bookinstance = await BookInstance.findById(req.params.id).exec();

  if(bookinstance === null) {
    res.redirect("/catalog/bookinstances")
  }

  res.render("bookinstanceDelete", {
    title: "Delete Book Instance",
    bookinstance
  })
};

exports.bookinstance_delete_post = async (req, res, next) => {
  await BookInstance.findByIdAndDelete(req.body.bookinstanceid)
  res.redirect("/catalog/bookinstances");
};

exports.bookinstance_update_get = async (req, res, next) => {
  const [books, bookinstance] = await Promise.all([
    Book.find({}, "title").sort({title: 1}).exec(),
    BookInstance.findById(req.params.id).populate("book")
  ]);

  res.render("bookinstanceForm", {
    title: "Update BookInstance",
    book_list: books,
    bookinstance,
    selected_book: bookinstance,
  })
};

exports.bookinstance_update_post = [
  body("book", "Book must be specified").trim().isLength({min: 1}).escape(),
  body("imprint", "Imprint must be specified").trim().isLength({min: 1}).escape(),
  body("status").escape(),
  body("due_back", "Invalid date").optional({values: "falsy"}).isISO8601().toDate(),
  async (req, res, next) => {
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id
    });

    if(!errors.isEmpty()) {
      const books = await Book.find({}, "title").sort({title: 1}).exec();

      res.render("bookinstanceForm", {
        title: "Update BookInstance",
        book_list: books,
        selected_book: bookInstance.book._id,
        errors: errors.array(),
        bookinstance: bookInstance
      })
    } else {
      await BookInstance.findByIdAndUpdate(req.params.id, bookInstance);
      res.redirect(bookInstance.url);
    }
  }
]