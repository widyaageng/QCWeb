const pz = require('./puzzle-strings');

const plotSudoku = (stringInput) => {
  for (let i = 0; i < 81; i = i + 9) {
    console.log(stringInput.slice(i, i + 9).split('').join('\t'));
    console.log("\n");
  }
}

class SudokuSolver {

  constructor() {
    this.puzzleOptions = {};
    // this.puzzleOptions = () => {
    //   let retStatus = {}
    //   for (let i = 0; i < 81; i++) {
    //     retStatus[i] = [...Array(9).keys()].map(item => item + 1);
    //   }
    //   return retStatus;
    // }
  }

  updateInitOptions(puzzleString) {
    for (let i = 0; i < 81; i++) {
      if (puzzleString[i] !== ".") {
        this.puzzleOptions[i] = [puzzleString[i]];
      } else {
        this.puzzleOptions[i] = [...Array(9).keys()].map(item => item + 1);
      }
    }
  }

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
      .map(([index, item]) => item);

    return !colString.includes(String(value));
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rowRegion = Math.floor(row / 3);
    let colRegion = Math.floor(column / 3);

    let regionIndices = [];

    for (let i = rowRegion * 3; i < (rowRegion + 1) * 3; i++) {
      for (let j = colRegion * 3; j < (colRegion + 1) * 3; j++) {

        regionIndices.push(i * 9 + j);

        // Returning false for coordinate out of sudoku box
        if (i * 9 + j > 80) {
          return false;
        };
      };
    };

    let region = regionIndices.map(item => puzzleString[item]);
    return !region.includes(String(value));
  }

  getrow(index) {
    return Math.floor(index / 9);
  }

  getcolumn(index) {
    return index % 9;
  }

  solve(puzzleString) {

    this.updateInitOptions(puzzleString);

    let puzzle = puzzleString
    let backtrack = false;

    const visited = [...Array(81).keys()].map(item => false);
    const symbols = [...Array(9).keys()].map(item => String(item + 1));

    for (let i = 0; i < puzzle.length; i++) {
      // console.log(puzzle);
      let row = this.getrow(i);
      let column = this.getcolumn(i);

      if (puzzle[i] == '.') {
        if (this.puzzleOptions[i].length < 1) {
          visited[i] = false;
          this.puzzleOptions[i] = [...Array(9).keys()].map(item => item + 1);
          i = puzzle.length - Object.assign([], visited).reverse().indexOf(true) - 2;
          continue;
        }

        for (const [index, item] of Object.entries(this.puzzleOptions[i])) {
          let checkrow = this.checkRowPlacement(puzzle, row, column, item);
          let checkcolumn = this.checkColPlacement(puzzle, row, column, item);
          let checkregion = this.checkRegionPlacement(puzzle, row, column, item);

          if (checkrow && checkcolumn && checkregion) {
            puzzle = puzzle.slice(0, i) + item + puzzle.slice(i + 1);
            this.puzzleOptions[i] = [...this.puzzleOptions[i].slice(parseInt(index) + 1)];
            backtrack = false;
            visited[i] = true;
            break;
          } else {
            if (item == 9) {
              visited[i] = false;
              i = puzzle.length - Object.assign([], visited).reverse().indexOf(true) - 2;
              if (!backtrack) {
                backtrack = true;
              }
            }
          }
        }
      } else {
        if (puzzleString[i] == '.') {

          if (backtrack) {
            puzzle = puzzle.slice(0, i) + '.' + puzzle.slice(i + 1);
          }

          if (this.puzzleOptions[i].length < 1) {
            this.puzzleOptions[i] = [...Array(9).keys()].map(item => item + 1);
            visited[i] = false;
            i -= 2;
            continue;
          }

          for (const [index, item] of Object.entries(this.puzzleOptions[i])) {
            let checkrow = this.checkRowPlacement(puzzle, row, column, item);
            let checkcolumn = this.checkColPlacement(puzzle, row, column, item);
            let checkregion = this.checkRegionPlacement(puzzle, row, column, item);

            if (checkrow && checkcolumn && checkregion) {
              puzzle = puzzle.slice(0, i) + item + puzzle.slice(i + 1);
              this.puzzleOptions[i] = [...this.puzzleOptions[i].slice(parseInt(index) + 1)];
              visited[i] = true;
              backtrack = false;
              break;
            } else {
              if (item == 9) {
                puzzle = puzzle.slice(0, i) + '.' + puzzle.slice(i + 1);
                visited[i] = false;
                this.puzzleOptions[i] = [...Array(9).keys()].map(item => item + 1);
                i = puzzle.length - Object.assign([], visited).reverse().indexOf(true) - 2;
                backtrack = true;
              }
            }
          }
        } else {
          if (backtrack) {
            i = puzzle.length - Object.assign([], visited).reverse().indexOf(true) - 2;
          }
        }
      }
    }

    return puzzle;
  }
}

module.exports = SudokuSolver;

