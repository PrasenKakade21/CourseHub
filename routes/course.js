//env
require("dotenv").config();
//server
const express = require("express");
const { UserAuth, AdminAuth } = require("../Middleware/auth");
const courseRouter = express.Router();
//db schemes
const {
  UserModel,
  AdminModel,
  CourseModel,
  PurchaseModel,
  ContactModel,
} = require("../db");
//validation
const { z, string } = require("zod");
//encryption
const bcrypt = require('bcryptjs');
//auth
const jwt = require("jsonwebtoken");
//endpoints
courseRouter.get("/", async (req, res) => {
  const courses = await CourseModel.find();
  res.json({
    courses: courses,
  });
});
courseRouter.get("/all", async (req, res) => {
  const cources = await CourseModel.find();
  res.render("courses", { courses: cources });
});
courseRouter.get("/add", AdminAuth, async (req, res) => {
  res.render("addcourse");
});
courseRouter.post("/make", AdminAuth, async (req, res) => {
  // zod velidation
  const reqBody = z.object({
    title: z.string().min(3).max(200),
    description: z.string().min(3).max(500),
    content: z.array(z.string().max(200)),
    price: z.number(),
    imageUrl: z.string().max(300),
  });
  const parsedData = reqBody.safeParse(req.body);
  if (!parsedData.success) {
    console.log(parsedData.error);
    res.json({
      message: "Invalid Data",
      error: parsedData.error,
    });
    return;
  }
  // fetch data
  const { title, description, content, price, imageUrl } = req.body;
  // get user
  const data = jwt.verify(req.cookies.token, process.env.ADMIN_SECRET);
  const exists = await CourseModel.findOne({
    title: title,
  });
  console.log(exists);
  // upload data
  if (!exists) {
    try {
      await CourseModel.create({
        creatorId: data.id,
        title: title,
        description: description,
        content: content,
        price: price,
        imageUrl: imageUrl,
      });
      res.json({
        message: "Course created",
      });
    } catch (error) {
      res.json({
        message: "creation Failed",
      });
      console.log(error);
    }
  } else {
    res.json({
      message: "course Already exists",
      exists: exists.toString(),
    });
  }
});
courseRouter.put("/edit", AdminAuth, (req, res) => {});

courseRouter.post("/purchase", UserAuth, async (req, res) => {
  const courseId = req.body.courseId;
  let data;
  let bought;
  try {
    data = await jwt.verify(req.cookies.token, process.env.USER_SECRET);
  } catch (error) {
    res.href = "http://localhost:3000/login";
  }
  console.log("course id",courseId,"user id", data.id);
  try{

    bought = await PurchaseModel.findOne({
      courseId: courseId,
      userId: data.id,
    });
    console.log(bought);
    if (bought == null) {
      try {
        await PurchaseModel.create({
          courseId: courseId,
          userId: data.id,
        });
        res.status(201).json({
          message: "Purchase successfull",
        });
        return;
      } 
      catch (error) {
        res.send(error)
        res.json({
          message: "Purchase Failed",
        });
        console.log(error);
        return;
      }
    } else {
      res.status(208).json({
        message: "Already Purchase"
      });
    }
  }
  catch(err){
    res.send(err)
  }

});
courseRouter.get("/mypurchases", async (req, res) => {
  const data = jwt.verify(req.cookies.token, process.env.USER_SECRET);
  console.log(data.id);

  const purchases = await PurchaseModel.find({
    userId: data.id,
  });

  const courseIds = purchases.map((purchase) => purchase.courseId);
  console.log(courseIds);
  const courses = await CourseModel.find({
    _id: { $in: courseIds },
  });
  console.log(courses);
  res.render("mycourses", { courses: courses });
});

courseRouter.get("/purchasestatus", UserAuth, async (req, res) => {
  const courseId = req.query.id;
  const token = req.query.token;
  req.cookies.token = token;
  let data;
  let bought;

  
  try {
    data = await jwt.verify(req.cookies.token, process.env.USER_SECRET);
  } catch (error) {
    console.log("eooro jew",error)
    res.href = "http://localhost:3000/login";
  }
  console.log("log data ",courseId,data,req.cookies.token);
  try{
    bought = await PurchaseModel.findOne({
      courseId: courseId,
      userId: data.id,
    });
  }
catch(error){
  console.log(error)
  return res.status(404).json({
    error: error
  })
}
  console.log("bought ",bought);
  if (bought == null) {
    return res.status(208).send("not bought");
    

  } else {
    return res.status(200).send("bought");
    
  }
});


courseRouter.get("/details", async (req, res) => {
  const courseId = req.query.id;
  req.cookies.token = req.cookies['token'];

  let status;
  console.log(courseId);
  const course = await CourseModel.findOne({
    _id: courseId,
  });
  const mentor = await AdminModel.findOne({
    _id: course.creatorId,
  });

  console.log(course, mentor);
  console.log(req.cookies['token'])
  if(req.cookies.token != null){

    const response = await fetch(
      `http://localhost:3000/course/purchasestatus?id=${courseId}&token=${req.cookies['token']}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    status = response.status;
  }
  else{
    status = 208
  }
  console.log("course fetch status ", status);
  res.render("courseinfo", {
    course: course,
    mentor: mentor,
    purchaseStatus: status,
  });
});

module.exports = courseRouter;
