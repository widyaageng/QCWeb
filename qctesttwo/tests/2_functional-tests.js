const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const IssueModel = require('../database/db').IssueModel;
const { before, after } = require('mocha');

chai.use(chaiHttp);

before(function (done) {
    IssueModel.deleteMany({}, function (err, data) {
        console.log("Data deleted successfully");
        done();
    });
});

suite('Functional Tests', function () {
    const projectId = 'testproject';

    test('POST with every field', function (done) {
        const issueEntry = {
            project_title: projectId,
            issue_title: "Test POST successful?",
            issue_text: "Is it going to pass though or fail?",
            created_on: (new Date('2021-12-01')).toISOString(),
            updated_on: (new Date('2021-12-31')).toISOString(),
            created_by: "TestGuy",
            assigned_to: "SolverGuy",
            open: true,
            status_text: "Under QA check",
        };

        const urlParams = new URLSearchParams(issueEntry);

        chai
            .request(server)
            .post(`/api/issues/${projectId}?${urlParams}`)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, issueEntry.issue_title);
                assert.equal(res.body.issue_text, issueEntry.issue_text);
                assert.equal(res.body.created_on, issueEntry.created_on);
                assert.equal(res.body.created_by, issueEntry.created_by);
                assert.equal(res.body.updated_on, issueEntry.updated_on);
                assert.equal(res.body.open, issueEntry.open);
                done();
            });
    });

    test('POST with only required fields', function (done) {
        const issueEntry = {
            project_title: projectId,
            issue_title: "Test POST ok?",
            issue_text: "Is it going to suck big time?",
            created_by: "TestDude"
        };

        const urlParams = new URLSearchParams(issueEntry);

        chai
            .request(server)
            .post(`/api/issues/${projectId}?${urlParams}`)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, issueEntry.issue_title);
                assert.equal(res.body.issue_text, issueEntry.issue_text);
                assert.equal(res.body.created_by, issueEntry.created_by);
                done();
            });
    });

    test('POST with missing required fields', function (done) {
        const issueEntry = {
            project_title: projectId,
            issue_title: "Test POST successful?",
            issue_text: "Is it going be error?",
        };

        const urlParams = new URLSearchParams(issueEntry);

        chai
            .request(server)
            .post(`/api/issues/${projectId}?${urlParams}`)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'required field(s) missing');
                done();
            });
    });

    test('GET to view issues', function (done) {
        chai
            .request(server)
            .get(`/api/issues/${projectId}`)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body, "array is not returned: not ok!");
                assert.equal(res.body.length, 2); //from previous successful POST twice
                done();
            });
    });

    test('GET to view issues with one filter', function (done) {
        const issueQuery = {
            created_by: "TestDude"
        };

        const urlParams = new URLSearchParams(issueQuery);

        chai
            .request(server)
            .get(`/api/issues/${projectId}?${urlParams}`)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body, "array is not returned: not ok!");
                assert.equal(res.body.length, 1);
                assert.equal(res.body[0].created_by, issueQuery.created_by);
                done();
            });
    });

    test('POST to add more data', function (done) {
        const issueEntry = {
            issue_title: "Test POST ok?",
            issue_text: "Is it going to suck big time?",
            created_by: "TestDude",
            created_on: '2021-12-15',
            open: false,
        };

        const urlParams = new URLSearchParams(issueEntry);

        chai
            .request(server)
            .post(`/api/issues/${projectId}?${urlParams}`)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, issueEntry.issue_title);
                assert.equal(res.body.issue_text, issueEntry.issue_text);
                assert.equal(res.body.created_on, (new Date(issueEntry.created_on)).toISOString());
                assert.equal(res.body.created_by, issueEntry.created_by);
                assert.equal(res.body.open, issueEntry.open);
                done();
            });
    });

    test('GET to view issues with multiple filters', function (done) {
        const issueEntry = {
            issue_title: "Test POST ok?",
            issue_text: "Is it going to suck big time?",
            created_by: "TestDude",
            created_on: '2021-12-15',
            open: false,
        };

        const issueQuery = {
            project_title: projectId,
            created_by: "TestDude",
            open: false
        };

        const urlQueryParams = new URLSearchParams(issueQuery);

        chai
            .request(server)
            .get(`/api/issues/${projectId}?${urlQueryParams}`)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body, "array is not returned: not ok!");
                assert.equal(res.body.length, 1);
                assert.equal(res.body[0].created_on, (new Date(issueEntry.created_on)).toISOString());
                done();
            });
    });

    test('PUT with one field', function (done) {
        IssueModel.find(
            {},
            { project_title: 0, __v: 0 })
            .sort({ 'updated_on': 'asc' }).limit(1).exec(function (err, data) {
                let issueUpdate = Object.assign({}, data[0]._doc);
                issueUpdate._id = String(issueUpdate._id);
                issueUpdate.open = false;
                let urlUpdateParams = new URLSearchParams(issueUpdate);

                chai
                    .request(server)
                    .put(`/api/issues/${projectId}?${urlUpdateParams}`)
                    .end(function (err, res) {
                        // console.log(res);
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, 'successfully updated');
                        assert.equal(res.body._id, issueUpdate._id);
                        done();
                    });
            });
    });

    test('PUT with mutliple fields', function (done) {
        IssueModel.find(
            {},
            { project_title: 0, __v: 0 })
            .sort({ 'updated_on': 'asc' }).limit(1).exec(function (err, data) {
                let issueUpdate = Object.assign({}, data[0]._doc);
                issueUpdate._id = String(issueUpdate._id);
                issueUpdate.open = false;
                issueUpdate.assigned_to = "Widya";
                let urlUpdateParams = new URLSearchParams(issueUpdate);

                chai
                    .request(server)
                    .put(`/api/issues/${projectId}?${urlUpdateParams}`)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, 'successfully updated');
                        assert.equal(res.body._id, issueUpdate._id);
                        done();
                    });
            });
    });

    test('PUT with missing id', function (done) {
        IssueModel.find(
            {},
            { project_title: 0, __v: 0 })
            .sort({ 'updated_on': 'asc' }).limit(1).exec(function (err, data) {
                let issueUpdate = Object.assign({}, data[0]._doc);
                issueUpdate._id = '';
                issueUpdate.open = false;
                issueUpdate.assigned_to = "Widya";
                let urlUpdateParams = new URLSearchParams(issueUpdate);

                chai
                    .request(server)
                    .put(`/api/issues/${projectId}?${urlUpdateParams}`)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, 'missing _id');
                        done();
                    });
            });
    });

    test('PUT with no fields to update', function (done) {
        IssueModel.find(
            {},
            { project_title: 0, __v: 0 })
            .sort({ 'updated_on': 'asc' }).limit(1).exec(function (err, data) {
                let issueUpdate = Object.assign({}, data[0]._doc);
                issueUpdate._id = String(issueUpdate._id);
                Object.keys(issueUpdate).map(function (key) {
                    if (key != '_id') {
                        delete issueUpdate[key];
                    };
                });

                let urlUpdateParams = new URLSearchParams(issueUpdate);

                chai
                    .request(server)
                    .put(`/api/issues/${projectId}?${urlUpdateParams}`)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, 'no update field(s) sent');
                        done();
                    });
            });
    });

    test('PUT with invalid id', function (done) {
        let issueUpdate = {
            _id: '61d18f7ff262ce5fffffffff',
            open: false,
            status_text: "Under QA check",
        };

        let urlUpdateParams = new URLSearchParams(issueUpdate);

        chai
            .request(server)
            .put(`/api/issues/${projectId}?${urlUpdateParams}`)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'could not update');
                done();
            });
    });

    test('DELETE an issue', function (done) {
        IssueModel.find(
            {},
            { project_title: 0, __v: 0 })
            .sort({ 'updated_on': 'asc' })
            .limit(1).exec(function (err, data) {
                let issueUpdate = Object.assign({}, data[0]._doc);
                issueUpdate._id = String(issueUpdate._id);
                issueUpdate.open = false;
                let urlUpdateParams = new URLSearchParams(issueUpdate);

                chai
                    .request(server)
                    .delete(`/api/issues/${projectId}?${urlUpdateParams}`)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, 'successfully deleted');
                        assert.equal(res.body._id, issueUpdate._id);
                        done();
                    });
            });
    });

    test('DELETE with invalid id', function (done) {
        IssueModel.find(
            {},
            { project_title: 0, __v: 0 })
            .sort({ 'updated_on': 'asc' })
            .limit(1).exec(function (err, data) {
                let issueUpdate = Object.assign({}, data[0]._doc);
                issueUpdate._id = '61d18f7ff262ce5fffffffff';

                Object.keys(issueUpdate).map(function (key) {
                    if (key != '_id') {
                        delete issueUpdate[key];
                    };
                });

                let urlUpdateParams = new URLSearchParams(issueUpdate);

                chai
                    .request(server)
                    .delete(`/api/issues/${projectId}?${urlUpdateParams}`)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, 'could not delete');
                        assert.equal(res.body._id, issueUpdate._id);
                        done();
                    });
            });
    });

    test('DELETE with missing id', function (done) {
        let issueUpdate = {
            _id: ''
        };

        let urlUpdateParams = new URLSearchParams(issueUpdate);

        chai
            .request(server)
            .delete(`/api/issues/${projectId}?${urlUpdateParams}`)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });

    });
});

after(function (done) {
    IssueModel.deleteMany({}, function (err, data) {
        console.log("Data deleted successfully");
        done();
    });
});
