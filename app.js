const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/todoDB");

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);
const WorkItem = mongoose.model("WorkItem", itemsSchema);

let itemName = "";
const app = express();

const workTitle = "Work List";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

function createDoc(item, bool) {
  console.log(item);
  if (bool === false) {
    let workItemDoc = new WorkItem({
      name: item,
    });
    workItemDoc.save().then(() => console.log("uploaded " + item));
  } else {
    let itemDoc = new Item({
      name: item,
    });
    itemDoc.save().then(() => console.log("uploaded " + item));
  }
}

function deleteDoc(id, bool) {
  if (bool === false) {
    WorkItem.findByIdAndDelete(id, (err) => {
      console.log(err);
    });
  } else {
    Item.findByIdAndDelete(id, (err) => {
      console.log(err);
    });
  }
}

app.get("/", (req, res) => {
  Item.find({}, (err, items) => {
    if (err) {
      console.log(err);
    } else {
      res.render("list", { listTitle: "Today", item: items });
    }
  });
});

app.get("/work", (req, res) => {
  WorkItem.find({}, (err, items) => {
    if (err) {
      console.log(err);
    } else {
      res.render("list", { listTitle: workTitle, item: items });
    }
  });
});

app.post("/", (req, res) => {
  itemName = req.body.newItem;
  buttonVal = req.body.list;
  console.log(buttonVal);
  if (buttonVal === workTitle) {
    createDoc(itemName, false);
    res.redirect("/work");
  } else {
    createDoc(itemName);
    res.redirect("/");
  }
});

app.post("/delete", (req, res) => {
  checkVal = req.body.check;
  Item.countDocuments({ _id: checkVal }, function (err, count) {
    if (err) {
      console.log(err);
    } else if (count > 0) {
      deleteDoc(checkVal);
      res.redirect("/");
    } else {
      deleteDoc(checkVal, false);
      res.redirect("/work");
    }
  });
});

app.listen(3000, () => {
  console.log("server on 3000");
});
