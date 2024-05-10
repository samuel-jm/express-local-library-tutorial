const BookInstance = require("../models/bookinstance");

exports.bookinstance_list = async (req, res, next) => {
  try {
    const allBookInstances = await BookInstance.find().populate("book").exec();

    allBookInstances.forEach((instance) => {
      console.log(instance.book.title);
    });

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

exports.bookinstance_create_get = (req, res, next) => {
  res.send("TODO: BookInstance create GET");
};

exports.bookinstance_create_post = (req, res, next) => {
  res.send("TODO: BookInstance create POST");
};

exports.bookinstance_delete_get = (req, res, next) => {
  res.send("TODO: BookInstance delete GET");
};

exports.bookinstance_delete_post = (req, res, next) => {
  res.send("TODO: BookInstance delete POST");
};

exports.bookinstance_update_get = (req, res, next) => {
  res.send("TODO: BookInstance update GET");
};

exports.bookinstance_update_post = (req, res, next) => {
  res.send("TODO: BookInstance update POST");
};
