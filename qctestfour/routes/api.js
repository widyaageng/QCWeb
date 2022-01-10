'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

      const ROWLETTER = {
        'A': 0,
        'B': 1,
        'C': 2,
        'D': 3,
        'E': 4,
        'F': 5,
        'G': 6,
        'H': 7,
        'I': 8
      };

      const VALIDVALUE = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

      let coordinate = req.body.coordinate;
      let value = req.body.value;
      let puzzle = req.body.puzzle;

      let errourResOut = []

      if ([coordinate, value, puzzle].some(item => item == undefined || item == '')) {
        res.json({
          error: 'Required field(s) missing'
        });
      } else {
        // parsing coordinate to row letter and column number
        coordinate = coordinate.split('');
        console.log(coordinate);
        let regPattern = new RegExp(/^[ABCDEFGHI][123456789]$/);

        if (coordinate.length !== 2 || !regPattern.test(req.body.coordinate)) {
          errourResOut.push({ error: 'Invalid coordinate' });
        };

        coordinate = {
          row: ROWLETTER[coordinate[0]],
          column: coordinate[1] - 1
        };

        if (!VALIDVALUE.includes(value)) {
          errourResOut.push({ error: 'Invalid value' });
        };

        let validPuzzle = solver.validate(puzzle);

        if (!validPuzzle.charOK) {
          errourResOut.push({
            error: 'Invalid characters in puzzle'
          });
        };

        if (!validPuzzle.lengthOK) {
          errourResOut.push({
            error: 'Expected puzzle to be 81 characters long'
          });
        };

        let rowOK = solver.checkRowPlacement(
          puzzle,
          coordinate.row,
          coordinate.column,
          value
        );

        let columnOK = solver.checkColPlacement(
          puzzle,
          coordinate.row,
          coordinate.column,
          value
        );

        let regionOK = solver.checkRegionPlacement(
          puzzle,
          coordinate.row,
          coordinate.column,
          value
        );

        let flags = [];

        if (!rowOK) {
          flags.push("row");
        };

        if (!columnOK) {
          flags.push("column");
        };

        if (!regionOK) {
          flags.push("region");
        };

        if (errourResOut.length > 0) {
          res.json(errourResOut[0]); // just throw the first qualifying error
        } else if (flags.length < 1 || puzzle[coordinate.column * 9 + coordinate.row] == value) {
          res.json({
            valid: true,
          });
        } else {
          res.json({
            valid: false,
            conflict: flags
          });
        };
      };
    });

  app.route('/api/solve')
    .post((req, res) => {

      let payloadPuzzle = req.body.puzzle == undefined ? '' : req.body.puzzle;
      let solutionOut = solver.solve(payloadPuzzle);

      if (req.body.puzzle == undefined) {
        res.json({
          error: 'Required field missing'
        })
      } else if (solutionOut === 'contain invalid char') {
        res.json({
          error: 'Invalid characters in puzzle'
        });
      } else if (solutionOut === 'invalid length') {
        res.json({
          error: 'Expected puzzle to be 81 characters long'
        })
      } else if (solutionOut === 'cannot be solved') {
        res.json({
          error: 'Puzzle cannot be solved'
        })
      } else {
        res.json({
          solution: solutionOut
        })
      };
    });
};
