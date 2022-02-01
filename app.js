const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();


let workList = [];

let today = new Date();

let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
}

let day = today.toLocaleDateString("en-us", options);
app.set('view engine' , 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Eat"
});

const item2 = new Item({
    name: "Code"
});

const item3 = new Item({
    name: "Sleep"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){
  

    Item.find({}, function(err, foundItems){
        if(foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                } else{
                    console.log("786 data added");
                }
            });
            res.redirect("/");
        }else{
            res.render("list", {listTitle :"Today", newListItemsDB : foundItems});
        }
    });
});


app.get("/:custom", function(req, res){
    const customListName = req.params.custom
    
    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName)
            }else{
                res.render("list", {listTitle :customListName, newListItemsDB : foundList.items})
            }
        }
    })
})




app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

    
  const item = new Item({
    name: itemName
});

    if(listName === "Today"){
       
        item.save();
    res.redirect("/")
    }else{
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName)
        })
    }

    
   

})



app.post("/delete", function(req, res){
    
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId, function(err){
            if (!err) {
                console.log("786 deleted");
                res.redirect("/");
            }
        });
    }else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        })
       
    };
   
});




app.get("/work", function(req, res){
    res.render("list", {listTitle : "work", newListItems : workList})
})

app.get("/about", function(req,res){
    res.render("about");
})




app.listen("3000", function(){
    console.log("786 ready to go ");
})



