'use strict';

const DB = require('../database/db');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;

    })

    .post(function (req, res) {
      console.log(req);
      let project = req.params.project;

      const requiredFields = ['issue_title', 'issue_text', 'created_by'];
      // const optionalFields = ['assigned_to', 'status_text'];

      let requiredFieldCheck = requiredFields.every(item => Object.keys(req.body));
      if (!requiredFieldCheck) {
        res.json({
          error: 'required field(s) missing'
        });
      } else {

        let newEntry = {
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_on: (new Date()).toISOString(),
          updated_on: (new Date()).toISOString(),
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to == undefined ?  req.body.created_by: req.body.assigned_to,
          open: true,
          status_text: req.body.status_text == undefined ? "Under QA Check": req.body.status_text
        };

        console.log(newEntry);

        DB.createIssue(newEntry, function (err, issue) {
          if (err) return res.send(err);
          res.json(issue);
        });
      };
    })

    .put(function (req, res) {
      let project = req.params.project;

    })

    .delete(function (req, res) {
      let project = req.params.project;

    });

};
