const express = require('express');
let  router = express.Router();

const Campground = require('../models/campgrounds');

const middleware = require('../middleware');

router.get('/', function(req, res){
    Campground.find({}, function(err, campgrounds){
        if (err) {
            console.log(err);  
        } else{
            res.render('campgrounds/index', {campgrounds : campgrounds});
        }
    });
});

router.get('/new', middleware.isLoggedIn ,function(req, res){
    res.render('campgrounds/new');
});

router.post('/', middleware.isLoggedIn ,function(req, res){
    const { name, image, description } = req.body.campground;
    const { id, username } = req.user;
    const author = {
        id,
        username
    }
    const newCampground = new Campground({
        name,
        image,
        description,
        author
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

router.get('/:id/edit', middleware.checkCampgroundOwnership ,function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        res.render('campgrounds/edit', {campground : campground});
    });
});

router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err) {
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router