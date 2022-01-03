/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const DB = require('../database/db');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    
      let bookId = '';

      DB.listBooks(bookId, function (err, book) {
        if (err) return res.send(err);
        if (book.length < 1) {
          res.send('no book exists');
        } else {
          res.json(book);
        };
      });
    })
    
    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      if (!title || title == '') {
        res.send('missing required field title');
      } else {
        DB.createBook({ title: title }, function (err, book) {
          if (err) return res.send('cannot create book');
          res.json({
            _id: String(book._id),
            title: book.title
          });
        });
      };
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      DB.deleteBook('', function (err, book) {
        if (err) return res.send(err);
        if (book.deletedCount < 1) {
          res.send('no book exists');
        } else {
          res.send('complete delete successful');
        };
      });
    });


    
  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookId = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      DB.listBooks(bookId, function (err, book) {
        if (err) return res.send(err);
        if (book.length < 1) {
          res.send('no book exists');
        } else {
          res.json(book[0]);
        };
      });
    })
    
    .post(function(req, res) {
      let bookId = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (comment == undefined || comment == '') {
        res.send('missing required fied comment');
      } else {
        DB.updateBook(bookId, comment, function (err, book) {
          if (err) return res.send(err);
          if (book == null || book == {}) {
            res.send('no book exists');
          } else {
            res.json(book);
          };
        });
      };
    })
    
    .delete(function(req, res){
      let bookId = req.params.id;
      //if successful response will be 'delete successful'

      DB.deleteBook(bookId, function (err, book) {
        if (err) return res.send(err);
        console.log(book);
        if (book.deletedCount < 1) {
          res.send('no book exists');
        } else {
          res.send('delete successful');
        };
      });
    });
};
