class SudokuSolver {

  validate(puzzleString) {
    let lengthCheck = puzzleString.length === 81;
    let regexCheck = (new RegExp(/^[\d\.]{81}$/).test(puzzleString));

    return lengthCheck && regexCheck;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    return !puzzleString.slice(row * 9, (row + 1) * 9).includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    let colString = Object.entries(puzzleString)
      .filter(([index, _]) => index % 9 == column)
      .map(item => item[1]);

    return !colString.includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {

  }
}

module.exports = SudokuSolver;

