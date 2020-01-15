const router = require('express').Router();
const User = require('../db/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

//Add a user - both driver sign-ups and root admin additions follow the same structure
router.post('/register', async (req, res) => {

    //Validate the req. data before creating a user
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check if the user is already in the database
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send('Email already exists');

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword,
        privileges: req.body.privileges
    });
    try{
        const savedUser = await user.save();
        res.send('now you can log in');
    }catch(err){
        res.status(500).send(err);
    }
});

//Authenticate a user
router.post('/login', async (req,res) => {

    //Validate the req. data before creating a user
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check if the email exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email or password is wrong');

    //Check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid password');

    //Create and assign a token
    const token = jwt.sign({id: user._id},process.env.TOKEN_SECRET);
    res.cookie('auth_token',token,{
        expires:false, httpOnly: true
    }).send('http://localhost:3001/dashboard');
});

//Delete a user
router.delete('/delete', async (req,res) => {
    if(!req.cookies['auth_token'])
        return res.status(403).send('You are not authorized');
    try {
            id = jwt.verify(c,process.env.TOKEN_SECRET);
            const deletingUser = await User.findById(id);
            if(!deletingUser) 
                return res.status(403).send('You are not authorized');
            if(deletingUser.privileges < 5) 
                return res.status(403).send('You are not authorized');
            
            const deletedUser = await User.deleteOne(req.body.id);
            res.send(deletedUser);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;