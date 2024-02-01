const express = require('express')
const bcrypt = require('bcrypt')
const usermodel = require('../Model/User') 
const create = require('../Model/Create')
const Private =require('../Model/private')
const router = express.Router()



router.get('/test',(req,res) =>{
res.json({message:"Api testing Succesfully"})
}
)


router.get('/data',vertoken,(req,res) =>{
    res.json({message: `Welcome, ${req.user.email} this is protected data`})
})



router.post('/user', async (req, res) => {
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

router.post('/auth', async (req, res) => {
  const { Name, password } = req.body;

  try {
    const user = await usermodel.findOne({ Name });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ userId: user._id }, jwtSecretKey, { expiresIn: '1h' });
      res.json({ token, userId: user._id }); // Include userId in the response
    } else {
      return res.status(401).json({ message: "Incorrect password" });
    }

  } catch (error) {
    console.error('Error during authentication:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});






router.post('/add',async(req,res) =>{
  try {
    const creates = await Private.create(req.body)
    console.log(creates)
    res.json(creates)
  } catch (error) {
    console.error('Error in /sign route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
router.get('/posts', async (req, res) => {
  try {
   
    const posts = await Private.find(req.body);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/posts/:postId',async(req,res) =>{
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

router.get('/postss', async (req, res) => {
  try {
    const posts = await Private.find();
    res.json(posts);
  } catch (error) {
    res.json({ message: error.message });
  }
});

// API endpoint to update a post
router.put('/postss/:id', async (req, res) => {
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
router.get('/postes', async (req, res) => {
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


router.post('/postes', async (req, res) => {
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




  
module.exports = router