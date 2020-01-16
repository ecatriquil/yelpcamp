const express = require('express');
let  router = express.Router();
const Campground = require('../models/campgrounds');

router.get('/', function(req, res){
    Campground.find({}, function(err, campgrounds){
        if (err) {
            console.log(err);  
        } else{
            res.render('campgrounds/index', {campgrounds : campgrounds});
        }
    });
});

router.get('/new', isLoggedIn ,function(req, res){
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn ,function(req, res){
    const { name, image, description } = req.body.campground;
    const newCampground = new Campground({
        name,
        image,
        description
    });
    newCampground.save()
                    .then(res.redirect('/campgrounds'))
                    .catch(err => console.log(err));
});

router.get('/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground){
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground : campground});
        }
    });
});


function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports = router