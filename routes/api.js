/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err,db) => {
        let dbo = db.db("library");
        let bookTitle = req.body.title;
        dbo.collection("books").find({}).toArray((err,result) => {
          if (err) {
            res.send("An error has occurred");
          }
          else if (result === null) {
            res.send("no book exists")
          }
          else {
            res.json(result)
          }
          
        });
      });
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err,db) => {
        let dbo = db.db("library");
        let bookTitle = req.body.title;
        dbo.collection("books").insertOne({title: bookTitle, comments: [],commentcount:0}, (err,result) => {
          console.log(result);
          if (err) {
            res.send("An error has occurred");
          }
          else if (result === null) {
            res.send("no book exists")
          }
          else {
            res.json(result.ops[0])
          }
          
        });
      });
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err,db) => {
        let dbo = db.db("library");
        dbo.collection("books").deleteMany({}, (err,result) => {
          if (err) {
            res.send("An error has occurred");
          }
          else if (result === null) {
            res.send("no book exists")
          }
          else {
            res.send("Complete delete successful");
          }
          
        });
      });
      //if successful response will be 'complete delete successful'
    });

  app.route('/api/books/:id')
    .get(function (req, res){
    
      let bookId = req.params.id;
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err,db) => {
        let dbo = db.db("library");
        dbo.collection("books").findOne({_id: new ObjectId(bookId)}, {_id: 1, title: 1, comments: 1} , (err,result) => {
          if (err) {
            res.send("An error has occurred");
          }
          else if (result === null) {
            res.send("no book exists")
          }
          else {
            res.json(result)
          }
          
        });
      });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookId = req.params.id;
      let comment = req.body.comment;
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err,db) => {
        let dbo = db.db("library");
        dbo.collection("books").updateOne({_id: new ObjectId(bookId)}, {$push: {comments: comment}, $inc: {commentcount: 1}}, (err,result) => {
          if (err) {
            res.send("An error has occurred");
          }
          else if (result === null) {
            res.send("no book exists")
          }
          else {
            dbo.collection("books").findOne({_id: new ObjectId(bookId)}, (err,result) => {
              res.json(result)
            });
          }
      
        });
        
      });
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookId = req.params.id;
      MongoClient.connect(MONGODB_CONNECTION_STRING, (err,db) => {
        let dbo = db.db("library");
        dbo.collection("books").deleteOne({_id: new ObjectId(bookId)}, (err,result) => {
          if (err) {
            res.send("An error has occurred");
          }
          else if (result === null) {
            res.send("no book exists")
          }
          else {
            res.send("Delete successful");
          }
          
        });
      });
      //if successful response will be 'delete successful'
    });
  
};
