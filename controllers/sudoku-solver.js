class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    if (!/^[1-9.]+$/.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowStart = row * 9;
    const rowEnd = rowStart + 9;
    const rowValues = puzzleString.slice(rowStart, rowEnd).replace('.', '');
    return !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colValues = [];
    for (let i = 0; i < 9; i++) {
      const index = i * 9 + column;
      if (puzzleString[index] !== '.') {
        colValues.push(puzzleString[index]);
      }
    }
    return !colValues.includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRowStart = Math.floor(row / 3) * 3;
    const regionColStart = Math.floor(column / 3) * 3;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const index = (regionRowStart + r) * 9 + (regionColStart + c);
        if (puzzleString[index] === value) {
          return false;
        }
      }
    }

    return true;
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString).valid) {
      return { error: 'Invalid puzzle' };
    }

    const solvePuzzle = (puzzle) => {
      const emptyCell = puzzle.indexOf('.');
      if (emptyCell === -1) {
        return puzzle; // Puzzle is solved.
      }

      const row = Math.floor(emptyCell / 9);
      const col = emptyCell % 9;

      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        if (
          this.checkRowPlacement(puzzle, row, col, value) &&
          this.checkColPlacement(puzzle, row, col, value) &&
          this.checkRegionPlacement(puzzle, row, col, value)
        ) {
          const newPuzzle = puzzle.slice(0, emptyCell) + value + puzzle.slice(emptyCell + 1);
          const result = solvePuzzle(newPuzzle);
          if (result !== null) {
            return result;
          }
        }
      }
      return null; // No valid solution found.
    };

    const solvedPuzzle = solvePuzzle(puzzleString);
    return { solution: solvedPuzzle };
  }
}

module.exports = SudokuSolver;
