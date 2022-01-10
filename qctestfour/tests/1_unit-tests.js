const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const SudokuLib = require('../controllers/puzzle-strings.js');
let solver;

suite('UnitTests', () => {
    solver = new Solver();
    test("81 valid char", function () {
        let puzzleString = SudokuLib.puzzlesAndSolutions;

        let tempDump;
        for (const item of puzzleString) {
            tempDump = solver.validate(item[0])
            assert.property(tempDump, 'lengthOK');
            assert.property(tempDump, 'charOK');
            assert.isTrue(tempDump.lengthOK && tempDump.charOK);
        };
    });

    test("invalid char handler", function () {
        let tempDump = solver.validate('k' + SudokuLib.puzzlesAndSolutions[4][0].slice(1));
        assert.isTrue(tempDump.lengthOK);
        assert.isFalse(tempDump.charOK);
    });

    test("81 incorrect length handler", function () {
        let tempDump = solver.validate(SudokuLib.puzzlesAndSolutions[4][0].slice(1));
        assert.isFalse(tempDump.lengthOK);
        assert.isTrue(tempDump.charOK);
    });

    test("valid row", function () {
        let tempDump = solver.checkRowPlacement(SudokuLib.puzzlesAndSolutions[4][0], 0, 2, '1');
        assert.isBoolean(tempDump);
        assert.isTrue(tempDump);
    });

    test("invalid row handler", function () {
        let tempDump = solver.checkRowPlacement(SudokuLib.puzzlesAndSolutions[4][0], 0, 2, '8');
        assert.isBoolean(tempDump);
        assert.isFalse(tempDump);
    });

    test("valid column", function () {
        let tempDump = solver.checkColPlacement(SudokuLib.puzzlesAndSolutions[4][0], 0, 2, '8');
        assert.isBoolean(tempDump);
        assert.isTrue(tempDump);
    });

    test("invalid column handler", function () {
        let tempDump = solver.checkColPlacement(SudokuLib.puzzlesAndSolutions[4][0], 0, 2, '9');
        assert.isBoolean(tempDump);
        assert.isFalse(tempDump);
    });

    test("valid region", function () {
        let tempDump = solver.checkRegionPlacement(SudokuLib.puzzlesAndSolutions[4][0], 5, 4, '6');
        assert.isBoolean(tempDump);
        assert.isTrue(tempDump);
    });

    test("invalid region handler", function () {
        let tempDump = solver.checkRegionPlacement(SudokuLib.puzzlesAndSolutions[4][0], 5, 4, '7');
        assert.isBoolean(tempDump);
        assert.isFalse(tempDump);
    });

    test("valid puzzle string to solver", function () {
        let tempDump = solver.solve(SudokuLib.puzzlesAndSolutions[4][0]);
        assert.isString(tempDump);
        assert.equal(tempDump, SudokuLib.puzzlesAndSolutions[4][1]);
    });

    test("invalid puzzle string to solver", function () {
        let tempDump = solver.solve('k' + SudokuLib.puzzlesAndSolutions[4][0].slice(1));
        assert.isString(tempDump);
        assert.equal(tempDump, 'contain invalid char');
    });

    test("solver return the correct solution", function () {
        let tempDump;
        for (const item of SudokuLib.puzzlesAndSolutions) {
            tempDump = solver.solve(item[0]);
            assert.isString(tempDump);
            assert.equal(tempDump, item[1]);
        };
    });
});
