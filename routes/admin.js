//server
const express = require("express");
const adminRouter = express.Router();
const { AdminAuth } = require("../Middleware/auth");
//db schemes
const { UserModel, AdminModel, CourseModel, PurchaseModel, ContactModel } = require("../db");
//validation
const { z } = require("zod");
//encryption
const bcrypt = require("bcrypt");
//auth
const jwt = require("jsonwebtoken");
//endpoints

adminRouter.post("/signup", async (req, res) => {
  const reqBody = z.object({
    username: z.string().min(3).max(100),
    phone: z.string().min(10).max(10),
    email: z.string().min(3).max(100).email(),
    password: z.string().min(8).max(30)
  });

  const parsedData = reqBody.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Invalid Data",
      error: parsedData.error,
    });
    return;
  }
  const username = req.body.username;
  const phone = req.body.phone;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const hashed_passowrd = await bcrypt.hash(password, 5);
    await AdminModel.create({
      username: username,
      phone: phone,
      email: email,
      password: hashed_passowrd,
    });
  } catch (error) {
    res.json({
        message:"Signup Failed"
    })
    console.log(error);
  }
  res.json({
    message: "You are Logged in",
  });
});

adminRouter.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await AdminModel.findOne({
    email: email,
  });

  const matchUser = await bcrypt.compare(password, user.password);
  if (matchUser) {
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.ADMIN_SECRET
    );
    res.cookie('token', token, { httpOnly: false, maxAge: 3600000 });  // 1-hour expiry
    res.cookie('usertype', 'admin', { httpOnly: false, maxAge: 3600000 });  // 1-hour expiry
    res.json({
      message: "Loggin Successfull",
      token: token,
    });
  } else {
    res.status(404).json({
      message: "Invalid Login",
    });
  }
});

adminRouter.get("/profile", AdminAuth, async (req, res) => {
  
  const tokenData = jwt.verify(req.cookies.token, process.env.ADMIN_SECRET);
  const user = await AdminModel.findOne({
    _id: tokenData.id,
  });
  const data = {
    username:user.username,
    phone:user.phone,
    email:user.email,
  }
  res.render("profile", { data: data });
});
adminRouter.put("/profile/edit", AdminAuth, async (req, res) => {
  const { username, email, phone } = req.body;
  const tokenData = jwt.verify(req.cookies.token, process.env.ADMIN_SECRET);
  try {
    const updatedUser = await AdminModel.findByIdAndUpdate(
      tokenData.id,
      {
        username,
        email,
        phone,
      },
      { new: true } 
    );
    console.log(updatedUser);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});
adminRouter.put("/profile/edit/password", AdminAuth, async (req, res) => {
  const { currentpassword, newpassword } = req.body;
  const tokenData = jwt.verify(req.cookies.token, process.env.ADMIN_SECRET);
  
  const user = await AdminModel.findOne({
    _id: tokenData.id,
  });
  const passwordmatch = await bcrypt.compare(newpassword,currentpassword);
  newpassword_hashed = await bcrypt.hash(newpassword,5);
  console.log(user.password,currentpassword)
  if(passwordmatch){
    try {
      const updatedUser = await AdminModel.findByIdAndUpdate(
        tokenData.id,
        {
          password:newpassword_hashed
        },
        { new: true } 
      );
      console.log(updatedUser);
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
      res.json({ message: "password updated successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
    }
  }
  else{
    return res.json({
      message:"incorrent password"
    })
  }
 
});


module.exports = adminRouter;
