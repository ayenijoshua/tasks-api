const express = require('express');
const router = express.Router();
const {User,validate,validateLogin} = require('../models/user')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require('jsonwebtoken')

/**
 * ger authenticated user
 */
router.get('/me', async (req,res)=>{
    try {
       const user = await User.findById(req.user._id).select("-password")
       if(!user) return res.status(404).send("authnticated user not found")

       user.token = jwt.sign({_id:user._id}, config.get('jwtPrivateKey'))

       return res.send(user)
    } catch (error) {
        console.error("Error",error)
        res.status(500).send("An error occured while trying to fetch authenticated user")
    }
})

/**
 * create user
 */
router.post('/', async (req, res) => {
    try {
        const {error} = validate(req.body)
        if(error) return res.status(400).send(error.details[0].message)

        let userExists = await User.findOne({email:req.body.email})
        if(userExists) return res.status(400).send("User already exists")

        //
        // let user = new User({
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: req.body.password
        // })

        let user = new User(_.pick(req.body,['name','email','password']))
        let salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password,salt)

        await user.save()

        const token = jwt.sign({_id:user._id}, config.get('jwtPrivateKey'))

        return res.header('x-auth-token',token).send(_.pick(user,['name','email']))

    } catch (error) {
        console.error('Error',error)
        return res.status(500).send("An internal error occured")
    }
    
});

router.post('/login', async (req, res) => {
    try {
        const {error} = validateLogin(req.body)
        if(error) return res.status(400).send(error.details[0].message)

        let user = await User.findOne({email:req.body.email})
        if(!user) return res.status(400).send("User does not exist")
        
       let check = await bcrypt.compare(user.password,user.password)
       if(!check){
            return res.status(400).send("User does not exist")
       }

        const token = jwt.sign({_id:user._id}, config.get('jwtPrivateKey'))

        return res.header('x-auth-token',token).send(_.pick(user,['name','email']))

    } catch (error) {
        console.error('Error',error)
        return res.status(500).send("An internal error occured")
    }
    
});

module.exports = router