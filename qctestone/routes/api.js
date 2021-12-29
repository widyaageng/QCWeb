'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {

  let convertHandler = new ConvertHandler();

  app.get('/api/convert', function (req, res) {
    let separatorIdx = req.query.input.match(/[a-zA-Z]/).index;

    let outResult = convertHandler.getString(
      req.query.input.slice(0, separatorIdx),
      req.query.input.slice(separatorIdx),
      res
    );

    res.json(outResult);
  });
};
