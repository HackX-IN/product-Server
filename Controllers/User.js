const User = require('../Models/UserModel');
const jwt = require('jsonwebtoken');
const { hashPassword,ComparePassword } = require('../Middleware/hashPassword');

module.exports = {
  register: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json("Email already exists");
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create a new user with hashed password
      const newUser = new User({ name, email, password: hashedPassword });

      // Save the user to the database
      const savedUser = await newUser.save();

      // Generate JWT token
      const token = jwt.sign({ userId: savedUser._id }, process.env.SECRET || 'inam123');

      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json("Failed to register user: " + error.message);
    }
    
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json("User not found");
      }

      // Compare the password with the hashed password
      const passwordMatch = await ComparePassword(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json("Invalid password");
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.SECRET || 'inam123');

      res.status(200).json({ token });
       res.cookie('token',token)
    } catch (error) {
      console.error(error);
      res.status(500).json("Failed to log in: " + error.message);
    }
    
  },

  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json("User not found");
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json("Failed to get user");
    }
  },
  getProfile: async (req, res) => {
    const {token}=req.cookies
    if(token){
      jwt.verify(token,process.env.SECRET||'inam123',{},(err,user)=>{
        if(err) throw err;
        res.json(user)
      })
    } else{
      res.json(null)
    }
  
  }
};
