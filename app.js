const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.urlencoded({extended:true}));

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });

app.set('view engine', 'ejs');



app.get('/', function(req, res) {
  res.render('landing');
})
app.get('/campgraunds/new', function(req, res) {
  res.render('new');
})

app.get('/campgraunds', function(req, res) {
  Campgraund.find({}, function(err, allCampgraund) {
    if(err) {
      console.log(err);
    }else{
      res.render('index', {campgraunds: allCampgraund})
    }
  })
})

app.get('/campgraunds/:id', function(req, res) {
  Campgraund.findById( req.params.id, function(err, foundCampgraund) {
    if(err) {
      console.log(err);
    }else{
      res.render('show', {campgraund: foundCampgraund})
    }
  })
})

// Scema setup
var campgraundScema = new mongoose.Schema({
  name: String,
  username: String,
  image: String,
  description: String
});

var Campgraund = mongoose.model('Campgraund', campgraundScema);


app.post("/campgraunds", function(req, res) {
  var name = req.body.name;
  var username = req.body.username;
  var image = req.body.image;
  var desc = req.body.description;

  var newcampground = {name : name, username: username, image : image, description : desc};
  // campgrounds.push(newcampground);
  
  Campgraund.create(newcampground, function(err, newlyCreated) {
      if (err) {
          console.log(err) 
      } else {
          res.redirect("/campgraunds");
      }
  })
  // create a new campground and save it to db
  // res.redirect("/campgrounds");
})




const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});