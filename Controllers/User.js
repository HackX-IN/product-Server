const User = require('../Models/UserModel');
const Product = require('../Models/Product');
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
      const token = jwt.sign({  userId: savedUser._id, email: savedUser.email, name: savedUser.name }, process.env.SECRET || 'inam123');

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
    const token = jwt.sign({ userId: user._id,email:user.email,name:user.name }, process.env.SECRET || 'inam123');

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
  
  },
    addToWishlist : async (req, res) => {
    const { userId, productId } = req.params;
    try {
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json("User not found");
      }
  
      // Check if the product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json("Product not found");
      }
  
      // Check if the product is already in the user's wishlist
      if (user.wishlist.includes(productId)) {
        return res.status(400).json("Product is already in the wishlist");
      }
  
      // Add the product's ObjectId to the user's wishlist
      user.wishlist.push(productId);
      await user.save();
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      res.status(500).json("Failed to add product to wishlist");
    }
  },
 removeFromWishlist : async (req, res) => {
    const { userId, productId } = req.params;
    try {
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json("User not found");
      }
  
      // Check if the product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json("Product not found");
      }
  
      // Check if the product is in the user's wishlist
      if (!user.wishlist.includes(productId)) {
        return res.status(400).json("Product is not in the wishlist");
      }
  
      // Remove the product's ObjectId from the user's wishlist
      user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
      await user.save();
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      res.status(500).json("Failed to remove product from wishlist");
    }
  },getWishlist : async (req, res) => {
    const { userId } = req.params;
    try {
      // Check if the user exists
      const user = await User.findById(userId).populate('wishlist', 'name price'); // Only retrieve 'name' and 'price' properties of the products
      if (!user) {
        return res.status(404).json("User not found");
      }
  
      res.status(200).json(user.wishlist);
    } catch (error) {
      console.error("Error getting user wishlist:", error);
      res.status(500).json("Failed to get user wishlist");
    }
  }
};
