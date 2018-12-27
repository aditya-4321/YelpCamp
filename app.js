var express     = require("express"),
    app         = express(),
    bodyparser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campgrounds"),
    seedDB      = require("./seeds"),
    passport    = require("passport"),
    LocalStrategy    = require("passport-local"),
    User             = require("./models/user"),
    Comment     =require("./models/comments"),
    commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index"),
    methodOverride   = require("method-override"),
    flash            =require("connect-flash")

seedDB();


mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())
// Campground.create(
//     {
//         name: "Salmon Creek",
//         image: "https://www.holidify.com/blog/wp-content/uploads/2016/08/Tsomoriri.jpg",
//         description: "This is a beautiful campground."
//     }, function(err, campground){
//         if(err){
//             console.log(err)
//     }   else{
//         console.log("Newly Created Campground: ");
//         console.log(campground);
//     }
    
//     }
//     )

app.set("view engine","ejs");
   
app.use(bodyparser.urlencoded({extended : true}));


// passport configuration
app.use(require("express-session")(
    {
    secret:"Ninja",
    resave:false,
    saveUninitialised:false,
    }
    )
    )


app.use(passport.initialize());
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error")
    res.locals.success=req.flash("success")
    next();
})
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//Signup
app.get("/register",function(req , res){
    res.render("register");
})
app.post("/register",function(req, res) {
    var newUser=new User({username: req.body.username})
    User.register(newUser,req.body.password,function(err, user){
        if(err){
            console.log(err)
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds")
        })
    })
})
app.get("/",function(req , res){
    res.render("Landing");
})

//Login
app.get("/login",function(req , res){
    res.render("login");
})
app.post("/login",passport.authenticate("local",
        {
           successRedirect: "/campgrounds",
           failureRedirect: "/login"
        }),
function(req, res) {
  
})
//Get all the campgrounds
app.get("/campgrounds",function(req , res){
    //Get all the campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
             res.render("campgrounds/index",{camgrounds:allCampgrounds})
        }
    })
    
   
})

//logout
app.get("/logout",function(req , res){
    req.logout();
    res.redirect("/campgrounds")
})
//Adding post route according to restfull convention.
//CREATE Campgrounds
app.post("/campgrounds",function(req , res){
 
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.desc;
    var price=req.body.price;
    var newCampground={name : name,image : image,description : desc,price: price };
    // Create a new Campground and save it to the database.
    Campground.create(newCampground, function(err , newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    
    
    })
    
    
});

//show form to create a campgrounds
app.get("/campgrounds/new",function(req, res){
    res.render("campgrounds/new");
})
//Show description of the clicked camp.
app.get("/campgrounds/:id",function(req, res){
    // res.render("show");
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundCampground);
            res.render("campgrounds/show",{campground: foundCampground});    
        }
})


})
function isLoggedIn(req, res, next){
    console.log("running");
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

//===============
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req, res){
    Campground.findById(req.params.id,function(err, campground){
        if(err){
            console.log(err);
        }
        else{
          res.render("comments/new",{campground: campground});
        }
    }
        )
 
})

app.post("/campgrounds/:id/comments",function(req, res) {
    Campground.findById(req.params.id,function(err, campground) {
        if(err){
        console.log(err)
        res.redirect("/campgrounds")
    }
        else{
            
            Comment.create(req.body.comment,function(err, comment){
                if(err){
                   console.log(err)
                }
                else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
            
        }
    })
    
})
//======Isloggedin====

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("Server has Started");
});
