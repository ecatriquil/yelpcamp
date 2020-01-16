const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    app = express();

const Campground = require('./models/campgrounds');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');

const db = require('./config/keys').MongoURI;
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log(err));

seedDB();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended : true}));

app.use(require('express-session')({
    secret: 'Secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res , next){
    res.locals.currentUser = req.user;
    next();
});

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

app.get('/campgrounds/new', isLoggedIn ,function(req, res){
    res.render('campgrounds/new');
});

app.post('/campgrounds', isLoggedIn ,function(req, res){
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

app.get('/campgrounds/:id/comments/new', isLoggedIn ,function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);  
        } else {
            res.render('comments/new', {campground : campground})
        }
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn ,function(req, res){
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

app.get('/register', function(req, res){
    res.render('register')
});

app.post('/register', function(req, res){
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

app.get('/login', function(req,res){
    res.render('login');
});

app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }) ,function(req,res){});

app.get('/logout', function(req,res){
    req.logOut();
    res.redirect('/campgrounds');
});

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}



const port = process.env.port || 5000;
app.listen(port, console.log(`YelpCamp Server started on port ${port}`));
