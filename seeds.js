const mongoose = require('mongoose'),
        Campground = require('./models/campgrounds'),
        Comment = require('./models/comment');
    
const seeds = [
    {
        name:'Clouds Rest', 
        image:'https://images.unsplash.com/photo-1540329957110-b87b06f5718e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80',
        description: 'knfdsnkdan'
    },
    {
        name:'Clouds Rest', 
        image:'https://images.unsplash.com/photo-1540329957110-b87b06f5718e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80',
        description: 'knfdsnkdan'
    },
    {
        name:'Clouds Rest', 
        image:'https://images.unsplash.com/photo-1540329957110-b87b06f5718e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80',
        description: 'knfdsnkdan'
    }
];


async function seedDB(){
    try {
        await Campground.remove({});
        await Comment.remove({});
        for (const seed of seeds) {
            let campground = await Campground.create(seed);
            let comment = await Comment.create(
                {
                    text:'comment',
                    author: 'Homer'
                }
            )
            campground.comments.push(comment);
            campground.save();
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = seedDB;
