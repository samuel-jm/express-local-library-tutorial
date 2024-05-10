const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: Date,
  date_of_death: Date,
});

AuthorSchema.virtual("name").get(function () {
  return this.first_name && this.family_name
    ? `${this.first_name} ${this.family_name}`
    : "";
});

AuthorSchema.virtual("url").get(function () {
  `/catalog/author/${this._id}`;
});

AuthorSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Author", AuthorSchema);
