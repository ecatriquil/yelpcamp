const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    app = express();

const Campground = require('./models/campgrounds');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');

const db = require('./config/keys').MongoURI;
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log(err));

// seedDB();

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());
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
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

const commentRoutes = require('./routes/comments'),
        campgroundRoutes = require('./routes/campgrounds'),
        indexRoutes = require('./routes/index');

app.use('/',indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, function(){
    console.log(`YelpCamp Server started on port`);
});
