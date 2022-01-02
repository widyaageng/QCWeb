'use strict';

const DB = require('../database/db');

module.exports = function (app) {

  app.route('/api/issues/:project')
    .get(function (req, res) {
      let project = req.params.project;
      let queryFilter = Object.assign({}, req.query);

      queryFilter.project_title = project;

      let filteredQuery = Object.keys(queryFilter)
        .filter(item => queryFilter[item].length > 1)
        .reduce((newFilter, key) => {
          newFilter[key] = queryFilter[key];
          return newFilter;
        }, {});

      DB.listFilteredProjectIssue(filteredQuery, function (err, issueList) {
        if (err) return res.send(err);
        console.log(issueList);
        res.json(issueList);
      });
    })
    .post(function (req, res) {
      let project = req.params.project;
      // console.log(req.query);
      // console.log(req.body);
      // console.log('---------------------------------------------------------------------------');
      
      const requiredFields = ['issue_title', 'issue_text', 'created_by'];
      // const optionalFields = ['assigned_to', 'status_text'];

      let requiredFieldCheck = requiredFields.every(item => Object.keys(req.body).includes(item));
      if (!requiredFieldCheck) {
        res.json({
          error: 'required field(s) missing'
        });
      } else {

        let newEntry = {
          project_title: project,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_on: (() => {
            try {
              return (new Date(req.body.created_on)).toISOString();
            } catch (error) {
              return (new Date()).toISOString();
            }
          })(),
          updated_on: (() => {
            try {
              return (new Date(req.body.updated_on)).toISOString();
            } catch (error) {
              return (new Date()).toISOString();
            }
          })(),
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to == undefined ? '' : req.body.assigned_to,
          open: req.body.open == undefined ? true : req.body.open,
          status_text: req.body.status_text == undefined ? '' : req.body.status_text
        };

        DB.createIssue(newEntry, function (err, issue) {
          if (err) return res.send(err);
          let simplerBouncedEntry = {
            issue_title: issue.issue_title,
            issue_text: issue.issue_text,
            created_on: issue.created_on,
            updated_on: issue.updated_on,
            created_by: issue.created_by,
            assigned_to: issue.assigned_to,
            open: issue.open,
            status_text: issue.status_text,
            _id: issue.id,
          };
          res.json(simplerBouncedEntry);
        });
      };
    })
    .put(function (req, res) {
      let project = req.params.project;
      let projectProps = Object.keys(req.body);
      let schemaProps = Object.keys(DB.IssueModel.schema.paths);

      if (!projectProps.includes('_id')) {
        res.json({
          error: 'missing _id'
        });
      } else if (req.body._id == '') {
        res.json({
          error: 'missing _id'
        });
      } else if (projectProps.length == 1) {
        res.json({
          error: 'no update field(s) sent',
          '_id': req.body._id
        });
      } else if (projectProps.every(item => schemaProps.includes(item))) {

        let projectId = req.body._id;
        let issueUpdates = Object.assign({}, req.body);
        issueUpdates.project_title = project;

        if (issueUpdates.created_on == undefined || issueUpdates.created_on == '') {

        } else {
          issueUpdates.created_on = (new Date(issueUpdates.created_on)).toISOString();
        }

        issueUpdates.updated_on = (new Date()).toISOString();
        delete issueUpdates._id;

        DB.updateProjectIssue(projectId, issueUpdates, function (err, issue) {
          if (err) return res.send(err);
          console.log(issue ? ("Record update :\n", issue): "null record updated");
          if (issue) {
            res.json({ result: 'successfully updated', '_id': projectId });
          } else {
            res.json({ error: 'could not update', '_id': req.body._id });
          }
        });
      } else {
        res.json({
          error: 'could not update', '_id': req.body._id
        });
      };
    })
    .delete(function (req, res) {
      let projectId = req.body._id;

      if (!projectId) {
        res.json({ error: 'missing _id' });
      } else if (projectId) {
        DB.deleteProjectIssue(projectId, function (err, issue) {
          if (err) return res.json({ error: 'could not delete', '_id': projectId });
          console.log("Deleted document:\n", issue);
          if (issue.deletedCount > 0) {
            res.json({ result: 'successfully deleted', '_id': projectId });
          } else {
            res.json({ error: 'could not delete', '_id': projectId });
          };
        });
      } else {
        res.json({
        });
      };
    });
};
