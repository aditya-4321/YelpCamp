var mongoose=require("mongoose");
var Campground=require("./models/campgrounds");
var Comment=require("./models/comments");

var data=[
    {
              name:"Spiti Valley",
              image: "https://ihplb.b-cdn.net/wp-content/uploads/2014/12/Lahual-spiti.jpg",
              description: "The Valley beyond"
        },
    {
              name:"Jaisalmer, Rajasthan",
              image: "https://ihplb.b-cdn.net/wp-content/uploads/2014/06/Camping-in-Jaisalmer.jpg",
              description: "The natural setting of Jaisalmer makes it a perfect paradise for campers. Fondly known as the ‘Golden City of India’, Jaisalmer is indeed a trekker’s paradise."
        },
    {
              name:"Chandertal Lake – Himachal Pradesh",
              image: "https://ihplb.b-cdn.net/wp-content/uploads/2014/06/camping-at-Chandertal-Lake.jpg",
              description: "Located at a high altitude in Lahaul and Spiti Valley, Chandertal Lake is situated about 4,300 meters above sea level. "
        }]

function seedDB(){
Campground.remove({},function(err){
    if(err){
        console.log(err);
    }
 
        console.log("Everything is Removed");
        data.forEach(function(seed){
             Campground.create(seed,function(err, campground){
            if(err){
                console.log(err);
            }
            else{
                console.log("New added Campground");
                
                Comment.create({
                    text:"I can be a Ninja,if i want to",
                    author:"Paddy"
                },function(err, comment){
                    if(err){
                        console.log(err);
                    }
                    else{
                    campground.comments.push(comment);
                    campground.save();
                    }
                })
                
                }
    })
       
    
})
})
}
module.exports=seedDB; 


