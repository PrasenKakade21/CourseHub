const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  username: String,
  phone: String,
  email: { type: String, unique: true },
  password: String,
});
const Admin = new Schema({
  username: String,
  phone: String,
  email: { type: String, unique: true },
  password: String,
});

const Course = new Schema({
  creatorId: ObjectId,
  title: String,
  description: String,
  content: {type:[String]},
  price: Number,
  imageUrl: String,
});
const Purchase = new Schema({
  userId: ObjectId,
  courseId: String,
  note: String,
});
const Contact = new Schema({
  name: String,
  email: { type: String, unique: false },
  message: String
});

const UserModel = mongoose.model("users", User);
const AdminModel = mongoose.model("admin", Admin);
const CourseModel = mongoose.model("courses", Course);
const PurchaseModel = mongoose.model("purchase", Purchase);
const ContactModel = mongoose.model("contact", Contact);

module.exports = {
  UserModel,
  AdminModel,
  CourseModel,
  PurchaseModel,
  ContactModel
};
