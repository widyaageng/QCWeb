require('dotenv').config();

// -------------------- Database setup --------------------
var mongooseHandler = require('mongoose');
const uri = process.env.MONGO_URI;
const localuri = 'mongodb://localhost:27017/test';

(async function () {
    await mongooseHandler.connect(localuri, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(console.log("Database connected!"));
})();


const { Schema } = mongooseHandler;

const bookSchema = new Schema({
    title: String,
    commentCount: Number,
    comments: [String]
});

let BookModel = mongooseHandler.model('Book', bookSchema);

const createBook = (book, done) => {
    let bookEntry = {
        title: book.title,
        commentCount: book.commentCount == undefined || book.commentCount == '' ? 0 : book.commentCount,
        comments: book.comments == undefined || book.comments == '' ? [] : book.comments
    };

    let newBook = new BookModel(bookEntry);

    newBook.save(function (err, data) {
        if (err) return done(err, null);
        done(null, data);
    })
};

const listBooks = (bookId, done) => {
    if (bookId == '' || bookId == undefined) {
        BookModel.find(
            {},
            { comments: 0, __v: 0 }
        ).sort({
            'title': 'asc'
        }).exec(function (err, data) {
            if (err) return done(err, null);
            done(null, data);
        });
    } else {
        BookModel.find(
            { '_id': bookId },
            { commentCount: 0, __v: 0 }
        ).sort({
            'title': 'asc'
        }).exec(function (err, data) {
            if (err) return done(err, null);
            done(null, data);
        });
    };
};

const updateBook = (bookId, newComment, done) => {

    BookModel.findOneAndUpdate(
        { '_id': bookId },
        {$push: { comments: String(newComment) }})
        .findOneAndUpdate(
            { '_id': bookId },
            { $inc: { __v: 1, commentCount: 1 } },
            { comments: 0, __v: 0, new: true })
        .exec(function (err, data) {
            if (err) return done(err, null);
            if (data) {
                done(null, {
                    _id: data._id,
                    title: data.title,
                    comments: data.comments
                });
            } else {
                done(err, null);  
            };
        });
};

const deleteBook = (bookId, done) => {
    
    if (bookId === undefined || bookId === '') {
        BookModel.deleteMany({}, function (err, data) {
            if (err) return done(err, null);
            done(null, data);
        });
    } else {
        BookModel.deleteOne({_id : bookId}, function (err, data) {
            if (err) return done(err, null);
            done(null, data);
        });
    };
};

// -------------------------------- exports --------------------------------
exports.mongooseHandler = mongooseHandler;
exports.BookModel = BookModel;
exports.createBook = createBook;
exports.listBooks = listBooks;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;