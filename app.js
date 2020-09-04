var dotenv = require('dotenv');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport        = require("passport");
var bodyParser      = require("body-parser");
var LocalStrategy   = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var Campgraund = require('./modules/campgraunds');
var Comment = require('./modules/comment');
var User = require('./modules/user');



app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });

app.set('view engine', 'ejs');

//PASSPORT CONFIGURATIONS
app.use(require("express-session")({
  secret : "weiwei is a good girl",
  resave : false,
  saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function( req, res, next ) {
  res.locals.currentUser = req.user;
  next();
})







app.get('/', function(req, res) {
  res.render('landing');
})
app.get('/campgraunds/new', function(req, res) {
  res.render('campgraunds/new');
})

app.get('/campgraunds', function(req, res) {
  Campgraund.find({}, function(err, allCampgraund) {
    if(err) {
      console.log(err);
    }else{
      res.render('campgraunds/index', {campgraunds: allCampgraund})
    }
  })
})

app.get('/campgraunds/:id', function(req, res) {
  Campgraund.findById( req.params.id).populate('comments').exec (function(err, foundCampgraund) {
    if(err) {
      console.log(err);
    }else{
      res.render('campgraunds/show', {campgraund: foundCampgraund})
    }
  })
})




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


// comments new
app.get("/campgraunds/:id/comments/new", isLoggedIn, function(req, res) {
  // find campground by id
  Campgraund.findById(req.params.id, function(err, campgraund) {
      if (err) {
          console.log(err)
      } else {
          res.render("comments/new", {campgraund : campgraund});
      }
  })
})


app.post('/campgraunds/:id/comments', isLoggedIn, function(req, res) {
  Campgraund.findById(req.params.id, function(err, campgraund) {
    if (err) {
      console.log(err)
      res.redirect('/campgraunds');
    } else {
      if(err) {
        console.log(err)
      }else{
        Comment.create(req.body.comment, function(err, comment) {
          if(err) {
            console.log(err)
          }else{
            campgraund.comments.push(comment)
            campgraund.save();
            res.redirect('/campgraunds/' + campgraund._id)
          }
        })
      }
    }
  })

})


//AUTHINTICATE ROUTE
app.get('/register', function (req, res) {
  res.render('auth/register');
})

// handle sign up logic
app.post("/register", function(req, res) {
  User.register(new User({username : req.body.username}), req.body.password, function(err, user) {
      if (err) {
          return res.render("register");
      } 
      passport.authenticate("local")(req, res, function() {
         res.redirect("/campgraunds"); 
      });
      
  })
})

// show login form
app.get("/login", function(req, res) {
  res.render("auth/login")
})

// handling login logic
app.post("/login", passport.authenticate("local", {
  successRedirect : "/campgraunds",
  failureRedirect : "/login"
}), function(req, res) {
  
})

// add logout route
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/campgraunds");
})

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect("/login");
}








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