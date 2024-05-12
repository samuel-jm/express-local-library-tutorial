const Handlebars = require("handlebars");

Handlebars.registerHelper("ifEquals", function (a, b, options) {
  return a == b ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("ifNotEquals", function (a, b, options) {
  return a != b ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("ifelse", function (exists, ifExists, ifNotExists) {
  console.log(`"${exists}"`, `"${ifExists}"`, `"${ifNotExists}"`);
  console.log(exists === undefined ? `"${ifExists}"` : `"${ifNotExists}"`);
  return exists === undefined ? ifExists : ifNotExists;
});
