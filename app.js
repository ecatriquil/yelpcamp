const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express();

const db = require('./config/keys').MongoURI;
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

const Campground = mongoose.model('Campground', campgroundSchema);


app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, campgrounds){
        if (err) {
            console.log(err);  
        } else{
            res.render('index', {campgrounds : campgrounds});
        }
    });
});

app.get('/campgrounds/new', function(req, res){
    res.render('new');
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
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
        } else {
            res.render('show', {campground : campground});
        }
    });

});
const port = process.env.port || 5000;
app.listen(port, console.log(`YelpCamp Server started on port ${port}`));
