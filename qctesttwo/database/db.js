require('dotenv').config();

// -------------------- Database setup --------------------
var mongooseHandler = require('mongoose');
const uri = process.env.MONGO_URI;
const localuri = 'mongodb://localhost:27017/test';

(async function () {
    await mongooseHandler.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(console.log("Database connected!"));
})();


const { Schema } = mongooseHandler;

const issueSchema = new Schema({
    project_title: String,
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
        project_title: issue.project_title,
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

const listProjectIssue = (projectName, done) => {
    IssueModel.find(
        { 'project_title': projectName },
        { _id: 0, project_title: 0, __v: 0 }
    ).sort({
        'updated_on': 'asc'
    }).exec(function (err, data) {
        if (err) return done(err, null);
        done(null, data);
    });
};

const listFilteredProjectIssue = (projectDetails, done) => {

    IssueModel.find(
        projectDetails,
        { project_title: 0, __v: 0 }
    ).sort({
        'updated_on': 'asc'
    }).exec(function (err, data) {
        if (err) return done(err, null);
        done(null, data);
    });
};

const updateProjectIssue = (projectId, projectDetails, done) => {

    IssueModel.findOneAndUpdate(
        { '_id': projectId },
        projectDetails)
        .findOneAndUpdate(
            { '_id': projectId },
            { $inc: { __v: 1 } },
            { _id: 0, project_title: 0, __v: 0, new: true })
        .sort({
            'updated_on': 'asc'
        })
        .exec(function (err, data) {
            if (err) return done(err, null);
            done(null, data);
        });
};

const deleteProjectIssue = (projectId, done) => {
    IssueModel.deleteOne({ '_id': projectId }, function (err, data) {
        if (err) return done(err, null);
        done(null, data);
    });
};

// -------------------------------- exports --------------------------------
exports.mongooseHandler = mongooseHandler;
exports.IssueModel = IssueModel;
exports.createIssue = createIssue;
exports.listProjectIssue = listProjectIssue;
exports.listFilteredProjectIssue = listFilteredProjectIssue;
exports.updateProjectIssue = updateProjectIssue;
exports.deleteProjectIssue = deleteProjectIssue;
