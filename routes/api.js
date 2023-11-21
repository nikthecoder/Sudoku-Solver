'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (!/^[A-Ia-i][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const row = coordinate[0].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
      const col = parseInt(coordinate[1]) - 1;

      const validRow = solver.checkRowPlacement(puzzle, row, col, value);
      const validCol = solver.checkColPlacement(puzzle, row, col, value);
      const validRegion = solver.checkRegionPlacement(puzzle, row, col, value);

      if (validRow && validCol && validRegion) {
        return res.json({ valid: true });
      } else {
        return res.json({
          valid: false,
          conflict: [
            validRow ? '' : 'row',
            validCol ? '' : 'column',
            validRegion ? '' : 'region',
          ].filter((conflict) => conflict !== ''),
        });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validationResult = solver.validate(puzzle);
      if (!validationResult.valid) {
        return res.json(validationResult);
      }

      const solutionResult = solver.solve(puzzle);
      return res.json(solutionResult);
    });
};
