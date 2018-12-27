var express=require("express")
var router=express.Router()
var Campground=require("../models/campgrounds")
var Comment=require("../models/comments")
var middleware=require("../middleware")

router.get("/",function(req , res){
    //Get all the campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
             res.render("campgrounds/index",{camgrounds:allCampgrounds})
        }
    })
    
   
})

//Adding post route according to restfull convention.
//CREATE Campgrounds
router.post("/",middleware.isLoggedIn,function(req , res){
    var author={
        id: req.user._id,
        username: req.user.username
    }
    
    var name=req.body.name;
    var image=req.body.image;
    var price=req.body.price;
    var desc=req.body.description;
    var newCampground={name : name,image : image,description : desc,author: author,price: price};
    
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
router.get("/new",middleware.isLoggedIn,function(req, res){
    res.render("campgrounds/new");
})
//Show description of the clicked camp.
router.get("/:id",function(req, res){
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

//Edit route
router.get("/:id/edit",middleware.checkAuthorisation,function(req, res) {
                Campground.findById(req.params.id, function(err, foundCampground){
                    if(err){
                        req.flash("error","Campground not Found")
                        res.redirect("back")
                    }   
                        
                            res.render("campgrounds/edit",{campground: foundCampground})
                     })
})

//Find and Update Campground
router.put("/:id",middleware.checkAuthorisation,function(req, res){
    Campground.findByIdAndUpdate(req.params.id , req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error","Campground not Found")
            res.redirect("/campgrounds")
        } else {
            req.flash("success","Update Campground")
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})
//Delete route
router.delete("/:id",middleware.checkAuthorisation,function(req, res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds")
        } else{
            req.flash("success","Deleted Campground")
            res.redirect("/campgrounds")
        }
    })
})



module.exports=router;