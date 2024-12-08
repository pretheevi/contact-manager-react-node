const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const UserSchema = require("../Models/userModel");


const User_database_path = path.join(__dirname, '../Database/user.json');

function getUserData(){
  const Data = JSON.parse(fs.readFileSync(User_database_path, 'utf8'));
  return Data;
};

//@desc Register a User
//@route POST /api/contacts
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(req.body)
  try{

    //get all users from the database    
    const getAllUsers = await getUserData();

    //find if user is already exist
    const findUser = getAllUsers.find( user => user.email === email);
    if(findUser){
      res.status(400);
      throw new Error(`User ${email} already exists`);
    }

    //hash the user password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user model
    const registerUser = new UserSchema(name, email, hashedPassword);
    getAllUsers.push(registerUser.getDetails());
    fs.writeFileSync(User_database_path, JSON.stringify(getAllUsers, null, 2));
    
    res.status(201).json({
      message:"Registered the user successfully",
      data: registerUser.getDetails()
    });

  }catch(error){
    res.status(500);
    return next(error)
  }
});

//@desc Login a User
//@route POST /api/contacts
//@access public
const loginUser = asyncHandler(async  (req, res, next) => {
  const { email, password } = req.body;
  try{
    if(!email || !password){
      res.status(400);
      throw new Error("Please provide all required information");
    };

    //get all users from the database    
    const getAllUsers = await getUserData();

   //find if user is already exist
    const findUser = await getAllUsers.find( user => user.email === email);
    if(!findUser){
      res.status(400);
      throw new Error(`User ${email} doesn't exists`);
    }

    if(findUser && (await bcrypt.compare(password, findUser.password))){
      const accessToken = jwt.sign({
        user:{
          username: findUser.name,
          email: findUser.email,
          id: findUser.User_id 
        }
      }, 
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: "1d" });

      console.log("User Logged in successfully")
      return res.status(200).json({ accessToken });
    }else{
      res.status(401);
      throw new Error("email or password not valid"); 
    }

    res.json({message:"Login user"})
  }catch(error){
    
    return next(error)
  }
}); 

//@desc Current User Info 
//@route POST /api/contacts
//@access private
const currentUser = asyncHandler(async  (req, res, next) => {
  try{
    const user = req.user;
    res.json({message:"current user", user: user});
  }catch(error){
    res.status(500);
    return next(error);
  }
  
}); 

module.exports = { registerUser, loginUser, currentUser };