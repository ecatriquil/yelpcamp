const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express();

const Campground = require('./models/campgrounds');
const Comment = require('./models/comment');
const seedDB = require('./seeds');

const db = require('./config/keys').MongoURI;
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log(err));

seedDB();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, campgrounds){
        if (err) {
            console.log(err);  
        } else{
            res.render('campgrounds/index', {campgrounds : campgrounds});
        }
    });
});

app.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new');
});

app.post('/campgrounds', function(req, res){
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

app.get('/campgrounds/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground){
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground : campground});
        }
    });
});

app.get('/campgrounds/:id/comments/new', function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);  
        } else {
            res.render('comments/new', {campground : campground})
        }
    });
});

app.post('/campgrounds/:id/comments', function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err,comment){
                if (err) {
                    console.log(err);
                    
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            })
        }
    });
});

const port = process.env.port || 5000;
app.listen(port, console.log(`YelpCamp Server started on port ${port}`));
