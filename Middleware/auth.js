const jwt = require("jsonwebtoken");
require("dotenv").config();

async function UserAuth(req, res, next) {
    const token = req.cookies['token']; 
    const user = req.cookies['user']; 
    let decoded_data;
    console.log('user token',token,"user type", user)
    try{
         decoded_data = await jwt.verify(token, process.env.USER_SECRET);

    }catch(error){
        res.locals.autherror = error;
    }

    if (decoded_data) {
        req.userId = decoded_data.id;
        res.locals.autherror = null;
    } 
    else {
         res.locals.autherror = "Invalid Credentials";
    }
    next()
}
async function AdminAuth(req, res, next) {
    const token = req.cookies.token; 

    const decoded_data = await jwt.verify(token, process.env.ADMIN_SECRET);

    if (decoded_data) {
        req.userId = decoded_data.id;

    } else {
        res.locals.autherror = "Invalid Credentials";

    }
    next();

}

module.exports = {
    UserAuth,
    AdminAuth,
    SECRET,
};
