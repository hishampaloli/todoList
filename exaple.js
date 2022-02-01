
const express = require("express");
const bodyParser = require("body-parser");
let items = ["code", "eat", "sleep"];
let workList = [];

const app = express();

app.set('view engine' , 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/", function(req, res){

    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    let day = today.toLocaleDateString("en-us", options);
    
    res.render("list", {listTitle : day, newListItems : items})
})

app.get("/work", function(req, res){
    res.render("list", {listTitle : "work", newListItems : workList})
})


app.post("/", function(req, res){

    let list = req.body.newItem;
    let lis = req.body.list;

    if(lis ==="work"){
        workList.push(list);
        res.redirect("/work");
    }else{
        items.push(list);
        res.redirect("/");
    }
  
})



app.listen("3000", function(){
    console.log("786 ready to go");
})
let today = new Date();

let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
}

let day = today.toLocaleDateString("en-us", options);


const itemsSchema = {
    name: String
};

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



Item.find({}, function(err, foundItems){
    if(foundItems.length === 0){
Item.insertMany(defaultItems, function(err){
if (err){
  console.log(err);
} else {
   console.log("786 data added");
}
});
res.redirect("/");
    }else{
       
    }

});



app.post("/", function(req,res){

    let  itemName = req.body.newItem;
  
    const item =  new Item({
        name: itemName
    });
  
    item.save();
  
    res.redirect("/");
  
  });
  






  if(listName == day){
    item.save();
    res.redirect("/")
  }else{
      List.findOne({name: listName}, function(err, foundList){
          foundList.items.push(item);
          foundList.save();
          res.redirect("/" + listName);
      })
  }





  app.get("/:customListName", function(req,res){
    const customListName = req.params.customListName;

    List.findOne({name: customListName}, function(err, foundlist){
        if(!err){
            if(!foundlist){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save();
                res.redirect("/" + customListName);
            }else{
                res.render("list",{listTitle: customListName, newListItemsDB : foundlist.items})
            }
        }
    })

   
})