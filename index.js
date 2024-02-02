require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt')
const cors = require('cors');
const mongoose = require('mongoose');
const usermodel = require('./Model/User');
const create = require('./Model/Create')
const Private = require('./Model/private')
const vertoken = require('./Middleware/Jwt')
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3500;
const MONGODB_URI = process.env.MONGODB_URI;
const jwtSecretKey = process.env.JWT_SECRET_KEY || 'default_secret_key';

const app = express();
app.use(cors());


app.use(express.json()); // Add this line to parse JSON requests

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Database is connected');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.message);
  });
  


app.post('/user', async (req, res) => {
  const { Name, email, password } = req.body;

  try {
    // Ensure the email is unique
    const existingUser = await usermodel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashpwd = await bcrypt.hash(password, 10);
    const newUser = await usermodel.create({ Name, email, password: hashpwd });

    console.log(newUser);
    res.json({ message: "User created successfully" });
  } catch (error) {
    console.error('Error during user creation:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/auth', async (req, res) => {
  const { Name, password,email } = req.body;

  try {
    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ userId: user._id }, jwtSecretKey, { expiresIn: '1h' });
      res.json({ token, userId: user._id, Name: user.Name }); // Include Name in the response
    } else {
      return res.status(401).json({ message: "Incorrect password" });
    }

  } catch (error) {
    console.error('Error during authentication:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});






app.post('/add', async (req, res) => {
  try {
    const {locations,userid,postMail,postTitle,postbody,number,time} =req.body
    const creates = await Private.create({locations,time,userid,postMail,postTitle,postbody,number });

    console.log(creates);
    res.json(creates);
  } catch (error) {
    console.error('Error in /add route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/posts/:postId',async(req,res) =>{
  try {
    const postId =req.params.postId
    const deleted = await Private.findByIdAndDelete(postId)
    if(!deleted){
      res.status(404).json({message:"Can't Delete"})
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Internal Server Error');
  }
})


app.get('/posts', async (req, res) => {
  try {
    const { email } = req.query;
    console.log(email);

    // Find the user by email
    const user = await usermodel.findOne({ email: email });

    if (!user) {
      // Handle case where user with the provided email is not found
      return res.status(404).json({ message: 'User not found' });
    }
      const posts = await Private.find({ postMail: email });
      res.json(posts);
      console.log(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// API endpoint to update a post
app.put('/postss/:id', async (req, res) => {
  try {
    const updatedPost = await Private.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    console.log(updatedPost)
    res.json(updatedPost);
  } catch (error) {
    res.json({ message: error.message });
  }
});





// All posts Display
app.get('/postes', async (req, res) => {
  try {
    const createPosts = await create.find();
    const privatePosts = await Private.find();

    const allPosts = {
      create: createPosts,
      private: privatePosts,
    };

    res.json(allPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/postes', async (req, res) => {
  const { postTitle, postbody, postMail, number } = req.body;

  try {
    const newPost = new Post({ postTitle, postbody, postMail, number });
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
