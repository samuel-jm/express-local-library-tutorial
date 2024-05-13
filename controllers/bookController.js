const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");
const { body, validationResult } = require("express-validator");

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

    res.render("bookList", {
      title: "Book List",
      book_list: allBooks.map((book) => book.toJSON()),
    });
  } catch (err) {
    return next(err);
  }
};

exports.book_detail = async (req, res, next) => {
  try {
    const [book, bookInstances] = await Promise.all([
      Book.findById(req.params.id).populate("author").populate("genre").exec(),
      BookInstance.find({ book: req.params.id }).exec(),
    ]);

    if (book === null) {
      const err = new Error("Book not found");
      err.status = 404;
      return next(err);
    }

    res.render("bookDetail", {
      title: book.toJSON().title,
      book: book.toJSON(),
      book_instances: bookInstances.map((instance) => instance.toJSON()),
    });
  } catch (err) {
    return next(err);
  }
};

exports.book_create_get = async (req, res, next) => {
  const [authors, genres] = await Promise.all([
    Author.find().sort({ family_name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);

  res.render("bookForm", { title: "Create Book", authors, genres });
};

exports.book_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre.*").escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if(!errors.isEmpty()) {
      const [authors, genres] = await Promise.all([
        Author.find().sort({ family_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      for(const genre of genres) {
        if(book.genre.includes(genre._id)) {
          genre.checked = "true"
        }
      }

      res.render("bookForm", {
        title: "Create Book",
        authors,
        genres,
        book,
        errors: errors.array()
      })
    } else {
      await book.save();
      res.redirect(book.url)
    }
  },
];

exports.book_delete_get = async (req, res, next) => {
  const [book, instances] = await Promise.all([
    Book.findById(req.params.id, "title author").populate("author").exec(),
    BookInstance.find({book: req.params.id}, "imprint status due_back").sort({imprint: 1}).exec()
  ])

  if(book === null) {
    res.redirect("/catalog/books")
  }

  res.render("bookDelete", {
    title: "Delete Book",
    book,
    instances
  })
};

exports.book_delete_post = async (req, res, next) => {
  const [book, instances] = await Promise.all([
    Book.findById(req.params.id, "title author").populate("author").exec(),
    BookInstance.find({book: req.params.id}, "imprint status due_back").sort({imprint: 1}).exec()
  ])

  if(instances.length > 0) {
    res.render("bookDelete", {
      title: "Delete Book",
      book,
      instances
    })
  } else {
    await Book.findByIdAndDelete(book._id);
    res.redirect("/catalog/books")
  }
};

exports.book_update_get = async (req, res, next) => {
  const [book, authors, genres] = await Promise.all([
    Book.findById(req.params.id).populate("author").exec(),
    Author.find().sort({family_name: 1}).exec(),
    Genre.find().sort({name: 1}).exec(),
  ])

  if(book === null) {
    const err = new Error("Book not found");
    err.status = 404;
    return next(err)
  }

    genres.forEach(genre => {
      if(book.genre.includes(genre._id)) {
        genre.checked = true
      }
    })

  res.render("bookForm", {
    title: "Update Book",
    authors,
    genres,
    book
  })
};

exports.book_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre.*").escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
      _id: req.params.id
    });

    if(!errors.isEmpty()) {
      const [authors, genres] = await Promise.all([
        Author.find().sort({ family_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      for(const genre of genres) {
        if(book.genre.includes(genre._id)) {
          genre.checked = "true"
        }
      }

      res.render("bookForm", {
        title: "Update Book",
        authors,
        genres,
        book,
        errors: errors.array()
      })
    } else {
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, book, {})
      res.redirect(updatedBook.url)
    }
  },
];