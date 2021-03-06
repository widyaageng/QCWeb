
* [X] ~~*All puzzle logic can go into /controllers/sudoku-solver.js*~~ [2022-01-09]
    * [X] ~~*The validate function should take a given puzzle string and check it to see if it has 81 valid characters for the input.*~~ [2022-01-09]
    * [X] ~~*The check functions should be validating against the current state of the board.*~~ [2022-01-09]
    * [X] ~~*The solve function should handle solving any given valid puzzle string, not just the test inputs and solutions. You are expected to write out the logic to solve this.*~~ [2022-01-09]
* [X] ~~*All routing logic can go into /routes/api.js*~~ [2022-01-10]
* [X] ~~*See the puzzle-strings.js file in /controllers for some sample puzzles your application should solve*~~ [2022-01-10]
* [X] ~~*To run the challenge tests on this page, set NODE_ENV to test without quotes in the .env file*~~ [2022-01-10]
* [X] ~~*To run the tests in the console, use the command npm run test. To open the Replit console, press Ctrl+Shift+P (Cmd if on a Mac) and type "open shell"*~~ [2022-01-10]


#Write the following tests in tests/1_unit-tests.js:#

* [X] ~~*Logic handles a valid puzzle string of 81 characters*~~ [2022-01-10]
* [X] ~~*Logic handles a puzzle string with invalid characters (not 1-9 or .)*~~ [2022-01-10]
* [X] ~~*Logic handles a puzzle string that is not 81 characters in length*~~ [2022-01-10]
* [X] ~~*Logic handles a valid row placement*~~ [2022-01-10]
* [X] ~~*Logic handles an invalid row placement*~~ [2022-01-10]
* [X] ~~*Logic handles a valid column placement*~~ [2022-01-10]
* [X] ~~*Logic handles an invalid column placement*~~ [2022-01-10]
* [X] ~~*Logic handles a valid region (3x3 grid) placement*~~ [2022-01-10]
* [X] ~~*Logic handles an invalid region (3x3 grid) placement*~~ [2022-01-10]
* [X] ~~*Valid puzzle strings pass the solver*~~ [2022-01-10]
* [X] ~~*Invalid puzzle strings fail the solver*~~ [2022-01-10]
* [X] ~~*Solver returns the expected solution for an incomplete puzzle*~~ [2022-01-10]

#Write the following tests in tests/2_functional-tests.js#

* [X] ~~*Solve a puzzle with valid puzzle string: POST request to /api/solve*~~ [2022-01-10]
* [X] ~~*Solve a puzzle with missing puzzle string: POST request to /api/solve*~~ [2022-01-10]
* [X] ~~*Solve a puzzle with invalid characters: POST request to /api/solve*~~ [2022-01-10]
* [X] ~~*Solve a puzzle with incorrect length: POST request to /api/solve*~~ [2022-01-10]
* [X] ~~*Solve a puzzle that cannot be solved: POST request to /api/solve*~~ [2022-01-10]
* [X] ~~*Check a puzzle placement with all fields: POST request to /api/check*~~ [2022-01-10]
* [X] ~~*Check a puzzle placement with single placement conflict: POST request to /api/check*~~ [2022-01-10]
* [X] ~~*Check a puzzle placement with multiple placement conflicts: POST request to /api/check*~~ [2022-01-10]
* [X] ~~*Check a puzzle placement with all placement conflicts: POST request to /api/check*~~ [2022-01-10]
* [X] ~~*Check a puzzle placement with missing required fields: POST request to /api/check*~~ [2022-01-10]
* [X] ~~*Check a puzzle placement with invalid characters: POST request to /api/check*~~ [2022-01-10]
* [X] ~~*Check a puzzle placement with incorrect length: POST request to /api/check*~~ [2022-01-10]
* [X] ~~*Check a puzzle placement with invalid placement coordinate: POST request to /api/check*~~ [2022-01-10]
* [X] ~~*Check a puzzle placement with invalid placement value: POST request to /api/check*~~ [2022-01-10]