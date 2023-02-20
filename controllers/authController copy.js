const User = require("../models/User");
const UserVerification = require("../models/UserVerification");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

 // unique string
const{v4: uuidv4} = require('uuid');

// env variables
require('dotenv').config();

// nodemailer stuff
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, // use SSL
  auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASSWORD
  }
});

// testing success
transporter.verify((error, success) => {
  if(error) {
    console.log(error)
  } else {
    console.log('Ready for messages')
    console.log(success)
  }
}) 


// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'that email is not registered'
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.email = 'that password is incorrect'
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

const maxAge = 2 * 24 * 60 * 60; // 3 days in seconds
const createToken = (id) => {
    return jwt.sign({ id }, 'trusponse node auth secret', {
        expiresIn: maxAge
    })
}

// controller actions
module.exports.index_get = (req, res) => {
  // res.flash('success', 'This is your success message!')
  res.render('index');
}

module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.register_free_get = (req, res) => {
  res.render('register_free');
}

module.exports.register_premium_get = (req, res) => {
  res.render('register_premium');
}

module.exports.register_pro_get = (req, res) => {
  res.render('register_pro');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.fp_get = (req, res) => {
  res.render('forgot-password')
}

module.exports.rp_get = (req, res) => {
  res.render('reset-password')
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user_id: user._id, 
      user_email: user.email, 
      user_pw: user.password });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.register_free_post = async (req, res) => {
  let { name, email, password } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();
  if (name == "" || email =="" || password == "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields"
    })
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    res.json({
      status: "FAILED",
      message: "Invalid name entered"
    })
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
    res.json({
      status: "FAILED",
      message: "Invalid email entered"
    })
  } else if (password.length < 8) {
    res.json({
      status: "FAILED",
      message: "Password must be at least 8 characters"
    })
  } else {
    // Checking if User already exists
    User.find({email}).then(result => {
      if(result.length) {
        // A user with that email already exists
        res.json({
          status: "FAILED",
          message: "A user with that email already exists!"
        })
      } else {
        // Try to create new user

        //================================================================================================================================================================================
         try {
           const user = User.create({ name, email, password, subscription_level });
           const token = createToken(user._id);

           res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }); // httpOnly: true for dev; need to add secure: true for prod;
           res.status(201).json({ user_id: user._id, 
             user_name: user.name,
             user_email: user.email, 
             user_pw: user.password,
             user_sub: subscription_level
            });
         }
         catch(err) {
           const errors = handleErrors(err);
           res.status(400).json({ errors });
         }
        }
        //=========================================================================================================================================================

    }).catch(err => {
      console.log(err)
      res.json({
        status: "FAILED",
        message: "An error occurred while checking for an existing user!"
      })
    })
  }
  const subscription_level = 'free';

  
module.exports.register_premium_post = async (req, res) => {
  const { name, email, password } = req.body;
  const subscription_level = 'premium';

  try {
    const user = await User.create({ name, email, password, subscription_level });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }); // httpOnly: true for dev; need to add secure: true for prod;
    res.status(201).json({ user_id: user._id,
      user_name: user.name,
      user_email: user.email, 
      user_pw: user.password,
      user_sub: subscription_level 
    });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.register_pro_post = async (req, res) => {
  const { name, email, password } = req.body;
  const subscription_level = 'pro';

  try {
    const user = await User.create({ name, email, password, subscription_level });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }); // httpOnly: true for dev; need to add secure: true for prod;
    res.status(201).json({ user_id: user._id, 
      user_name: user.name,
      user_email: user.email, 
      user_pw: user.password,
      user_sub: subscription_level
    });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  // try {
  //   const user = await User.login(email, password)
  //   const token = createToken(user._id);
  //   res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
  //   res.status(200).json({ user:user._id })
  // }
  // catch(err) {
  //   const errors = handleErrors(err);
  //   res.status(400).json({ errors })
  // }
  
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1});
  res.redirect('/');
}