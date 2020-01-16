const express = require('express'),
        passport = require('passport');

const User = require('../models/user');
let  router = express.Router();

router.get('/', function(req, res){
    res.render('landing');
});

router.get('/register', function(req, res){
    res.render('register')
});

router.post('/register', function(req, res){
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req,res,function(){
            res.redirect('/campgrounds');
        });
    });
});

router.get('/login', function(req,res){
    res.render('login');
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }) ,function(req,res){});

router.get('/logout', function(req,res){
    req.logOut();
    res.redirect('/campgrounds');
});

module.exports = router;