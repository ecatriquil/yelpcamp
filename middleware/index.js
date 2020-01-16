var middlewareObj = {};
const Campground = require('../models/campgrounds'),
        Comment = require('../models/comment');
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err,campground){
            if (err) {
                res.redirect('back');
            } else {
                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }   
            }
        });
    } else {
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
                    res.redirect('back');
                }   
            }
        });
    } else {
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports = middlewareObj;