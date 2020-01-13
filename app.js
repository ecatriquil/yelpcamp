const express = require('express'),
    bodyParser = require('body-parser'),
    app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

var campgrounds = [
    {name: 'Salomon Creek', image: 'https://images.unsplash.com/photo-1520824071669-892f70d8a23d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=697&q=80'},
    {name: 'Granite Hill', image: 'https://images.unsplash.com/photo-1520824071669-892f70d8a23d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=697&q=80'},
    {name: "Mountain Goat's Rest", image: 'https://images.unsplash.com/photo-1520824071669-892f70d8a23d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=697&q=80'}
];

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    res.render('campgrounds', {campgrounds : campgrounds});
});

app.get('/campgrounds/new', function(req, res){
    res.render('new');
});

app.post('/campgrounds', function(req, res){
    const newCampground = req.body;
    campgrounds.push(newCampground);
    res.redirect('/campgrounds');
});


const port = process.env.port || 5000;
app.listen(port, console.log(`YelpCamp Server started at ${port}`));
