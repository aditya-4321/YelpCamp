//All the middleware goes here
var middlewareObj = {};
var Campground=require("../models/campgrounds");
var Comment=require("../models/comments");



middlewareObj.checkAuthorisation=function(req, res, next){
      if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                
                if(err){
                    req.flash("error","Campground not Found")
                    res.redirect("back")
                }
                else{
                    if(foundCampground.author.id.equals(req.user._id))
                {   
                    // res.render("campgrounds/edit",{campground: foundCampground})
                    next()
                     } else {
                                req.flash("error","You don't have permission to do so")
                                res.redirect("back")    
                            }
                
                }
                
                
            })
        }
        else{       req.flash("error","You need to be logged In to do that")
                    res.redirect("back")
                   
        }
}
//checkCommentOwnerhip
middlewareObj.checkCommentOwnerShip=function(req, res, next){
      if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    req.flash("error","Campground not Found")
                    res.redirect("back")
                }
                else{
                    if(foundComment.author.id.equals(req.user._id))
                {   
                    // res.render("campgrounds/edit",{campground: foundCampground})
                    next()
                     } else {
                                req.flash("error","You don't have permission to do so")
                                res.redirect("back")    
                            }
                
                }
                
                
            })
        }
        else{       req.flash("error","You need to be logged In to do that")
                    res.redirect("back")
                   
        }
}
//isLoggedIN
middlewareObj.isLoggedIn=function(req, res, next){
    console.log("running");
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First")
    res.redirect("/login")
}
module.exports=middlewareObj;