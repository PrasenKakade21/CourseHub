//server
const express = require("express");
const contactRouter = express.Router();
//db schemes
const { UserModel, AdminModel, CourseModel, PurchaseModel, ContactModel } = require("../db");
//validation
const { z } = require("zod");
//encryption
const bcrypt = require("bcrypt");
//auth
const jwt = require("jsonwebtoken");
//endpoints

contactRouter.post("/submit", async (req, res) => {
  const reqBody = z.object({
    name: z.string().min(3).max(100),
    email: z.string().min(3).max(100).email(),
    message: z.string().min(8).max(500)
  });

  const parsedData = reqBody.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Invalid Data",
      error: parsedData.error,
    });
    return;
  }
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  try {
    await ContactModel.create({
      name: name,
      email: email,
      message: message,
    });
    
  } catch (error) {
    res.json({
        message:"Failed To Send Message"
    })
    console.log(error);
    return;
  }
  res.json({
    message: "Message Sent!",
  });
});

module.exports = contactRouter;
