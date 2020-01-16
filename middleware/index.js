var middlewareObj = {};
const Campground = require('../models/campgrounds'),
        Comment = require('../models/comment');

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err,campground){
            if (err) {
                req.flash('error', 'Campground not found');
                res.redirect('back');
            } else {
                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You dont have permission to do that.');
                    res.redirect('back');
                }   
            }
        });
    } else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if (err) {
                res.redirect('back');
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You dont have permission to do that');
                    res.redirect('back');
                }   
            }
        });
    } else {
        req.flash('error', 'You need to be logged to do that');
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
}

module.exports = middlewareObj;