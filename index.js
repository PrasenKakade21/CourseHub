// env
require("dotenv").config();
// server
const express = require("express");
const app = express();
//routes
const userRouter = require("./routes/user");
const courseRouter = require("./routes/course");
const adminRouter = require("./routes/admin");
const contactRouter = require("./routes/contact");
// auth
const jwt = require("jsonwebtoken");
const { UserAuth, AdminAuth, SECRET } = require("./Middleware/auth");
const {limiter,contactLimiter} = require("./Middleware/limiter");
// database
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGOOSE);
//ejs
app.set("view engine","ejs");
//axios
const axios = require('axios');
//cookies 
const cookieParser = require("cookie-parser");
//endpoints
// const courses = [
//   {
//     "title": "Introduction to Web Development",
//     "description": "This course provides an in-depth introduction to the basics of web development, covering HTML, CSS, and JavaScript.",
//     "content": [
//       "HTML basics",
//       "CSS styling",
//       "JavaScript programming",
//       "Responsive design",
//       "Web hosting"
//     ],
//     "price": 99.99,
//     "imageUrl": "https://example.com/course-image.jpg"
//   },
//   {
//     "title": "Introduction to Web Development",
//     "description": "This course provides an in-depth introduction to the basics of web development, covering HTML, CSS, and JavaScript.",
//     "content": [
//       "HTML basics",
//       "CSS styling",
//       "JavaScript programming",
//       "Responsive design",
//       "Web hosting"
//     ],
//     "price": 99.99,
//     "imageUrl": "https://example.com/course-image.jpg"
//   }
// ];

app.use(express.json());
app.use(cookieParser());
// app.use(limiter);

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);
app.use("/contact",contactLimiter, contactRouter);
app.get("/", async (req, res) => {

  const response = await axios.get("http://localhost:3000/course/");
  const courses = response;
  res.render("index", {courses:courses.data.courses});
});

app.get("/signup", async (req, res) => {

  res.render("signup");
});
app.get("/login", async (req, res) => {

  res.render("login");
});
app.get("/aboutus", async (req, res) => {

  res.render("aboutus");
});
app.get("/contactus", async (req, res) => {

  res.render("contactus");
});
app.get("/profile", async (req, res) => {
  usertype =  req.cookies.usertype;
    res.redirect(`/${usertype}/profile`)
});
app.put("/profile", async (req, res) => {
  const isedit = req.query.isedit;
  const ispass = req.query.ispass;
  usertype =  req.cookies.usertype;
  if(ispass){
    res.redirect(`/${usertype}/profile/edit/password`)
  }
  else if(isedit){
    res.redirect(`/${usertype}/profile/edit`)
    console.log("call");
    
  }
});

app.get("/functions.js", async (req, res) => {

  res.sendFile('/functions.js' , { root : __dirname});
});

const port = process.env.PORT;

app.listen(port, () =>
  console.log(`Server running on port http://localhost:${port} 🔥`)
);
