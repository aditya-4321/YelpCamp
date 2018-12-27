var mongoose=require("mongoose");
var Campground=require("./models/campgrounds");
var Comment=require("./models/comments");

var data=[
    {
              name:"Salmon Creek",
              image: "https://www.holidify.com/blog/wp-content/uploads/2016/08/Tsomoriri.jpg",
              description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
        },
    {
              name:"Salmon Creek",
              image: "https://www.holidify.com/blog/wp-content/uploads/2016/08/Tsomoriri.jpg",
              description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
        },
    {
              name:"Salmon Creek",
              image: "https://www.holidify.com/blog/wp-content/uploads/2016/08/Tsomoriri.jpg",
              description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
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


