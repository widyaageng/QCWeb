/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const BookModel = require('../database/db').BookModel;
const { before, after } = require('mocha');

chai.use(chaiHttp);

before(function (done) {
  BookModel.deleteMany({}, function (err, data) {
    console.log("Data deleted successfully");
    done();
  });
});

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function (done) {
  //   chai.request(server)
  //     .get('/api/books')
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        const bookEntry = {
          title: "Calclueless I"
        }
        chai
          .request(server)
          .post(`/api/books`)
          .send(bookEntry)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'title');
            assert.equal(res.body.title, bookEntry.title);
            assert.property(res.body, '_id');
            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        const bookEntry = {
        }

        chai
          .request(server)
          .post(`/api/books`)
          .send(bookEntry)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {

        const booksToPost = [
          { title: 'Calclueless II' },
          { title: 'Calclueless III' },
          { title: 'Calclueless IV' }
        ];

        (new Promise((resolve, reject) => {
          booksToPost.forEach(async (book) => {
            await chai
              .request(server)
              .post(`/api/books`)
              .send(book)
              .then(console.log("Posting book: ", book));
          });
          resolve("Posting books done...");
        })).then((msg) => {
          console.log(msg);
          chai
            .request(server)
            .get(`/api/books`)
            .end(function (err, res) {
              assert.equal(res.statusCode, 200);
              assert.isArray(res.body);
              assert.isAtLeast(res.body.length, 3);
              res.body.forEach((book) => {
                assert.isObject(book);
                assert.property(book, 'title');
                assert.isString(book.title);
                assert.property(book, '_id');
                assert.property(book, 'commentcount');
                assert.isNumber(book.commentcount);
              });
              done();
            });
        });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {

        const invalidId = '5f665eb46e296f6b9b6a504d';

        chai
          .request(server)
          .get(`/api/books/${invalidId}`)
          .end(function (err, res) {
            assert.isString(res.text);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {

        chai
          .request(server)
          .post(`/api/books`)
          .send({ title: 'Object Oriented Programming in Javanese' })
          .end(function (err, ret) {
            chai
              .request(server)
              .get(`/api/books/${ret.body._id}`)
              .end(function (err, res) {
                assert.isObject(res.body);
                assert.property(res.body, 'title');
                assert.equal(res.body.title, 'Object Oriented Programming in Javanese');
                assert.property(res.body, 'comments');
                assert.isArray(res.body.comments);
                done();
              });
          });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {

        chai
          .request(server)
          .post(`/api/books`)
          .send({ title: 'How to become good Data Anal' })
          .end(function (err, ret) {
            chai
              .request(server)
              .post(`/api/books/${ret.body._id}`)
              .send({ comment: 'Dope, great anal book' })
              .end(function (err, ret2) {
                chai
                  .request(server)
                  .post(`/api/books/${ret2.body._id}`)
                  .send({ comment: 'Legit, the god of the books' })
                  .end(function (err, res) {
                    assert.isObject(res.body);
                    assert.property(res.body, '_id');
                    assert.property(res.body, 'title');
                    assert.property(res.body, 'comments');
                    assert.lengthOf(res.body.comments, 2);
                    res.body.comments.forEach((comment) => {
                      assert.isString(comment);
                      assert.oneOf(comment, ['Dope, great anal book', 'Legit, the god of the books']);
                    });
                    done();
                  })
              });
          });
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai
          .request(server)
          .post(`/api/books`)
          .send({ title: 'How to become good ML Engineer' })
          .end(function (err, ret) {
            chai
              .request(server)
              .post(`/api/books/${ret.body._id}`)
              .send({})
              .end(function (err, ret2) {
                assert.isString(ret2.text);
                assert.equal(ret2.text, 'missing required field comment');
                done();
              });
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai
          .request(server)
          .post(`/api/books`)
          .send({ title: 'How to become good Investor' })
          .end(function (err, ret) {
            chai
              .request(server)
              .post(`/api/books/61d310a76e61b1d97db9ffff`)
              .send({ comment: 'Never Seen Comment' })
              .end(function (err, ret2) {
                assert.isString(ret2.text);
                assert.equal(ret2.text, 'no book exists');
                done();
              });
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .post('/api/books/')
          .send({ title: 'How to be a Warren Buffet' })
          .end(function (err, res) {
            chai
              .request(server)
              .delete(`/api/books/${res.body._id}`)
              .end(function (err, res2) {
                assert.isString(res2.text);
                assert.equal(res2.text, 'delete successful');
                done();
              });
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai
          .request(server)
          .delete(`/api/books/61d310a76e6fffd97db9ffff`)
          .end(function (err, res2) {
            assert.isString(res2.text);
            assert.equal(res2.text, 'no book exists');
            done();
          });
      });
    });
  });
});

after(function (done) {
  BookModel.find({}, function (err, book) {
    if (err) return done(err);
    BookModel.deleteMany({}, function (err, data) {
      console.log(`Data deleted successfully, deletedCount : ${data.deletedCount}`);
      done();
    });
  });
});