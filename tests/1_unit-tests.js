const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
  setup(() => {
    solver = new SudokuSolver();
  });

  test('Logic handles a valid puzzle string of 81 characters', () => {
    const validPuzzle = '53..7....6..352..7.7..1.456....7...3.6.4...7.4.2...1....56.7..3.48....2.3..4.61..';
    const result = solver.validate(validPuzzle);
    assert.isTrue(result.valid);
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const invalidPuzzle = '53..7....6..352..7.7..1.456....7...3.6.4...7.4.2...1....56.7..3.48....2.3..4.61@';
    const result = solver.validate(invalidPuzzle);
    assert.isFalse(result.valid);
    assert.equal(result.error, 'Invalid characters in puzzle');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const shortPuzzle = '53..7....6..352..7.7..1.456....7...3.6.4...7.4.2...1....56.7..3.48....2.3..4.6';
    const longPuzzle = '53..7....6..352..7.7..1.456....7...3.6.4...7.4.2...1....56.7..3.48....2.3..4.615';

    const resultShort = solver.validate(shortPuzzle);
    const resultLong = solver.validate(longPuzzle);

    assert.isFalse(resultShort.valid);
    assert.isFalse(resultLong.valid);
    assert.equal(resultShort.error, 'Expected puzzle to be 81 characters long');
    assert.equal(resultLong.error, 'Expected puzzle to be 81 characters long');
  });

  test('Logic handles a valid row placement', () => {
    const validPuzzle = '53..7....6..352..7.7..1.456....7...3.6.4...7.4.2...1....56.7..3.48....2.3..4.61..';
    const result = solver.checkRowPlacement(validPuzzle, 0, 0, '2');
    assert.isTrue(result);
  });

  test('Logic handles an invalid row placement', () => {
    const invalidPuzzle = '53..7....6..352..7.7..1.456....7...3.6.4...7.4.2...1....56.7..3.48....2.3..4.61..';
    const result = solver.checkRowPlacement(invalidPuzzle, 0, 0, '5');
    assert.isFalse(result);
  });

  test('Logic handles a valid column placement', () => {
    const validPuzzle = '53..7....6..352..7.7..1.456....7...3.6.4...7.4.2...1....56.7..3.48....2.3..4.61..';
    const result = solver.checkColPlacement(validPuzzle, 0, 0, '5');
    assert.isTrue(result);
  });

  test('Logic handles an invalid column placement', () => {
    const invalidPuzzle = '53..7....6..352..7.7..1.456....7...3.6.4...7.4.2...1....56.7..3.48....2.3..4.61..';
    const result = solver.checkColPlacement(invalidPuzzle, 0, 0, '3');
    assert.isFalse(result);
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    const validPuzzle = '53..7....6..352..7.7..1.456....7...3.6.4...7.4.2...1....56.7..3.48....2.3..4.61..';
    const result = solver.checkRegionPlacement(validPuzzle, 0, 0, '5');
    assert.isTrue(result);
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const invalidPuzzle = '53..7....6..352..7.7..1.456....7...3.6.4...7.4.2...1....56.7..3.48....2.3..4.61..';
    const result = solver.checkRegionPlacement(invalidPuzzle, 0, 0, '3');
    assert.isFalse(result);
  });

  test('Valid puzzle strings pass the solver', () => {
    const validPuzzle = '53..7....6..352..7.7..1.456....7...3.6.4...7.4.2...1....56.7..3.48....2.3..4.61..';
    const result = solver.solve(validPuzzle);
    assert.property(result, 'solution');
  });

  test('Invalid puzzle strings fail the solver', () => {
    const invalidPuzzle = '53..7....6..352..7.7..1.456....7...3.6.4...7.4.2...1....56.7..3.48....2.3..4.61@';
    const result = solver.solve(invalidPuzzle);
    assert.property(result, 'error');
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const incompletePuzzle = '53..7....6..352..7.7..1.456....7...3.6.4...7.4.2...1....56.7..3.48....2.3..4.61..';
    const solution = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
    const result = solver.solve(incompletePuzzle);
    assert.property(result, 'solution');
    assert.equal(result.solution, solution);
  });
});
