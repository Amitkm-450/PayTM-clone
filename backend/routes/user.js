const express = require("express");
const router = express.Router();
const zod = require("zod");
const {User, Account} = require("../db");

const {JWT_SECRET} = require('../config');

const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");

const signupBody = zod.object({
    username: zod.string().email(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string()
})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
})

const updateBody = zod.object({
    password: zod.string().min(8).optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
})

router.post('/signup', async(req, res) => {
  //validate the input
  const { success } = signupBody.safeParse(req.body);
  if(!success) {
    return res.status(411).json({
        message: "Email is already taken / Incorrect inputs"
    })
  }

  const existingUser = await User.findOne({
    username: req.body.username
  })

  //if user already exits
  if(existingUser) {
    return res.status(411).json({
        message: "Email is already taken / Incorrect inputs"
    })
  }
  
  const newUser = await User.create({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password
  })
  
  const userId = newUser._id;
  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000
  })

  const token = jwt.sign({
    userId
  }, JWT_SECRET);

  res.json({
    message: "User created successfully",
    token: token
  })
  
})

router.post('/signin', async(req, res) => {
    const {success} = signinBody.safeParse(req.body);
    if(!success) {
        res.status(411).json({
            message: "Error while logging in",
        })
    }
    
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if(!user) { 
        res.status(411).json({
                message: "Error while logging in"
        })
    }

    
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    

})

router.put('/update', authMiddleware, async(req, res) => {
    const {success} = updateBody.safeParse(req.body);
    if(!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async(req, res) => {
   const filter = req.params.filter || "";
   const users = await User.find({
      $or: [
        {
            firstname: {
                "$regex": filter
            }
        }, {
            lastname: {
                "$regex": filter
            }
        }
      ]
    
   })

   res.json({
    user: users.map(user => ({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        _id: user._id
    }))
   })
})

module.exports = router