'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
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
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {

    });
};
