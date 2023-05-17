//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Leon’s career started at Red Hat, where he worked as a software engineer, and because of his work ethic, he quickly became the youngest manager in the company, overseeing a global team. However, he soon realized that hard work wasn’t enough to cope with the increasing complexity and requirements of the job. Before he knew it, he was in search of ways to go beyond his “fixed ability” and invested heavily in researching everything he could on productivity and management. Because of what he learned, it didn’t take long for him to outpace the demands of his work — and by his mid-20s he had already successfully managed over 150 engineering projects. In the span of less than 5 years, he achieved more than what most project managers could do in 10. That’s when he realized that he could use this knowledge to help anyone in the world who was stuck somewhere in their lives. So, he left his job at Red Hat to dedicate his time to sharing this information through Lifehack.org.";
const aboutContent = "A user-friendly and customizable blogging platform that suits your needs. Research and explore various routes within your chosen niche. Write detailed and informative blog posts about each route, including important details such as distance, difficulty level, highlights, directions, and any other relevant information.";
const contactContent = "Contact at email: harshlalawathlhl@gmail.com";

const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/blogDB");

const blogSchema = mongoose.Schema({
  title: String,
  content: String
});

const blogModel = new mongoose.model("BlogModel",blogSchema);


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  blogModel.find().then(function(post){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: post
      });
  })

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  const compo = new blogModel(post);
  compo.save();

  blogModel.find().then(function(content){
    // console.log(content);
  })

  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const requestedId = req.params.postName;

  blogModel.find({_id: requestedId}).then(function(posts){
    posts.forEach(function(post){
        res.render("post", {
          title: post.title,
          content: post.content
        });
      });
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
