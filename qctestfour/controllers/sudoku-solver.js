const pz = require('./puzzle-strings');

class SudokuSolver {

  validate(puzzleString) {
    let lengthCheck = puzzleString.length === 81;
    let regexCheck = (new RegExp(/^[\d\.]{81}$/).test(puzzleString));

    return lengthCheck && regexCheck;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    return !puzzleString.slice(row * 9, (row + 1) * 9).includes(String(value));
  }

  checkColPlacement(puzzleString, row, column, value) {
    let colString = Object.entries(puzzleString)
      .filter(([index, _]) => index % 9 == column)
      .map(item => item[0]);

    return !colString.includes(String(value));
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rowRegion = Math.floor(row/3);
    let colRegion = Math.floor(column/3);

    let regionIndices = [];
    
    for (let i = rowRegion*3; i < (rowRegion+1)*3; i++) {
      for (let j = colRegion*3; j < (colRegion + 1)*3; j++) {

        regionIndices.push(i*9 + j);

        // Returning false for coordinate out of sudoku box
        if (i*9 + j > 80) {
          return false;
        };
      };
    };

    let region = regionIndices.map(item => puzzleString[item]);
    return !region.includes(String(value));
  }

  getrow(index) {
    return Math.floor(index/9);
  }

  getcolumn(index) {
    return index % 9;
  }

  solve(puzzleString) {

    let puzzle = puzzleString
    let backtrack = false;

    const symbols = [...Array(9).keys()].map(item => String(item + 1));

    for (let index = 0; index < puzzle.length; index++) {
      console.log(puzzle);
      console.log(pz.puzzlesAndSolutions[4][0]);
      console.log(pz.puzzlesAndSolutions[4][1]);
      console.log('--------------------------------------------------------');
      let row = this.getrow(index);
      let column = this.getcolumn(index);

      if (puzzle[index] == '.') {
        for (let i = 0; i < 9; i++) {
          let checkrow = this.checkRowPlacement(puzzle, row, column, symbols[i]);
          let checkcolumn = this.checkColPlacement(puzzle, row, column, symbols[i]);
          let checkregion = this.checkRegionPlacement(puzzle, row, column, symbols[i]);

          if (checkrow && checkcolumn && checkregion) {
            puzzle = puzzle.slice(0, index) + symbols[i] + puzzle.slice(index + 1);
            backtrack = false;
            break;
          } else {
            if (i == 8) {
              index = index - 2;
              backtrack = true;
            }
          }
        }
      } else {
        if (puzzleString[index] == '.') {

          for (let i = parseInt(puzzle[index]) - 1 ; i < 9 ; i++) {
            let checkrow = this.checkRowPlacement(puzzle, row, column, symbols[i]);
            let checkcolumn = this.checkColPlacement(puzzle, row, column, symbols[i]);
            let checkregion = this.checkRegionPlacement(puzzle, row, column, symbols[i]);
  
            if (checkrow && checkcolumn && checkregion) {
              puzzle = puzzle.slice(0, index) + symbols[i] + puzzle.slice(index + 1);
              backtrack = false;
              break;
            } else {
              if (i == 8) {
                puzzle = puzzle.slice(0, index) + '.' + puzzle.slice(index + 1);
                index = index - 2;
                backtrack = true;
              }
            }
          }
        } else {
          if (backtrack) {
            index = index - 2;
            backtrack = false;
          }
        }
      }
    }

    return puzzleString;
  }
}

let newSudoku = new SudokuSolver();
newSudoku.solve(pz.puzzlesAndSolutions[4][0]);

module.exports = SudokuSolver;

