require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const create = require('./Model/Create')
const Private = require('./Model/private')
app.use(cors());
const vertoken = require('./Middleware/Jwt')
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3522;
const MONGODB_URI = process.env.MONGODB_URI;



app.use(cors());
app.use(express.json()); // Add this line to parse JSON requests

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Database is connected');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.message);
  });
  

  app.use('/Auth',require('./Route/AuthRouter'))







app.post('/add', async (req, res) => {
  try {
    const {locations,userId, names,postMail,postTitle,postbody,number,time} =req.body
    const creates = await Private.create({locations,time, names,userId,postMail,postTitle,postbody,number });

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
    const { userId } = req.query;
    console.log(userId);

      const posts = await Private.find({ userId: userId });
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
