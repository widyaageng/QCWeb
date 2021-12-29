require('dotenv').config();

// -------------------- Database setup --------------------
var mongooseHandler = require('mongoose');
const uri = process.env.MONGO_URI;

(async function () {
    await mongooseHandler.connect('mongodb://localhost:27017/test', {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(console.log("Database connected!"));
})();


const { Schema } = mongooseHandler;

const issueSchema = new Schema({
    issue_title: String,
    issue_text: String,
    created_on: String,
    updated_on: String,
    created_by: String,
    assigned_to: String,
    open: Boolean,
    status_text: String
});

let IssueModel = mongooseHandler.model('Issue', issueSchema);

const createIssue = (issue, done) => {
    let issueEntry = {
        issue_title: issue.issue_title,
        issue_text: issue.issue_text,
        created_on: issue.created_on,
        updated_on: issue.updated_on,
        created_by: issue.created_by,
        assigned_to: issue.assigned_to,
        open: issue.open,
        status_text: issue.status_text
    }

    let newIssue = new IssueModel(issueEntry);

    newIssue.save(function (err, data) {
        if (err) return done(err, null);
        done(null, data);
    })
};

// -------------------------------- exports --------------------------------
exports.mongooseHandler = mongooseHandler;
exports.IssueModel = IssueModel;
exports.createIssue = createIssue;

