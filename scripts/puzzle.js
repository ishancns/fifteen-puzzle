(function() {
  var ABOVE, BELOW, CELL_SIZE, Grid, INIT_GRID, LEFT, PuzzleCellView, PuzzleGridView, RIGHT, directionToDelta;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  CELL_SIZE = 100;
  ABOVE = 0;
  RIGHT = 1;
  LEFT = 2;
  BELOW = 3;
  directionToDelta = function(direction) {
    switch (direction) {
      case ABOVE:
        return [-1, 0];
      case RIGHT:
        return [0, 1];
      case BELOW:
        return [1, 0];
      case LEFT:
        return [0, -1];
    }
  };
  INIT_GRID = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
  PuzzleCellView = (function() {
    function PuzzleCellView(num) {
      var origColNum, origRowNum;
      this.node = $("<div/>", {
        text: num,
        css: {
          width: "" + (CELL_SIZE - 2) + "px",
          height: "" + (CELL_SIZE - 2) + "px",
          textAlign: "center",
          lineHeight: "" + CELL_SIZE + "px",
          fontSize: "30px",
          border: "1px solid black",
          position: "absolute"
        }
      });
      origRowNum = parseInt((num - 1) / 4, 10);
      origColNum = parseInt((num - 1) % 4, 10);
      if ((origRowNum + origColNum) % 2 === 0) {
        this.node.css({
          backgroundColor: 'black',
          color: 'white'
        });
      } else {
        this.node.css({
          backgroundColor: 'white',
          color: 'black'
        });
      }
    }
    PuzzleCellView.prototype.setPosition = function(rowNum, colNum, duration, cb) {
      if (duration == null) {
        duration = 0;
      }
      if (cb == null) {
        cb = $.noop;
      }
      return this.node.animate({
        top: "" + (rowNum * CELL_SIZE) + "px",
        left: "" + (colNum * CELL_SIZE) + "px"
      }, duration, cb);
    };
    return PuzzleCellView;
  })();
  PuzzleGridView = (function() {
    function PuzzleGridView($el, grid) {
      var cell, colNum, num, rowNum;
      $el.css({
        position: "relative",
        width: "" + (4 * CELL_SIZE) + "px",
        height: "" + (4 * CELL_SIZE) + "px"
      });
      this.moveQueue = [];
      this.cellViews = [];
      for (rowNum in grid) {
        rowNum = parseInt(rowNum, 10);
        this.cellViews[rowNum] = [];
        for (colNum in grid[rowNum]) {
          colNum = parseInt(colNum, 10);
          num = grid[rowNum][colNum];
          if (num === 0) {
            cell = null;
            this.emptyPos = [rowNum, colNum];
          }
          if (num !== 0) {
            cell = new PuzzleCellView(num);
            cell.setPosition(rowNum, colNum);
            $el.append(cell.node);
          }
          this.cellViews[rowNum].push(cell);
        }
      }
    }
    PuzzleGridView.prototype.queueMoves = function(moves) {
      return this.moveQueue = this.moveQueue.concat(moves);
    };
    PuzzleGridView.prototype.runQueue = function(duration) {
      if (this.moveQueue.length !== 0) {
        return this.moveFrom(this.moveQueue.shift(), duration, __bind(function() {
          return this.runQueue(duration);
        }, this));
      }
    };
    PuzzleGridView.prototype.moveFrom = function(sourceDirection, duration, cb) {
      var cellView, deltaCol, deltaRow, sourceCol, sourceRow, targetCol, targetRow, _ref, _ref2, _ref3;
      _ref = this.emptyPos, targetRow = _ref[0], targetCol = _ref[1];
      _ref2 = directionToDelta(sourceDirection), deltaRow = _ref2[0], deltaCol = _ref2[1];
      this.emptyPos = (_ref3 = [targetRow + deltaRow, targetCol + deltaCol], sourceRow = _ref3[0], sourceCol = _ref3[1], _ref3);
      cellView = this.cellViews[sourceRow][sourceCol];
      this.cellViews[targetRow][targetCol] = cellView;
      this.cellViews[sourceRow][sourceCol] = null;
      return cellView.setPosition(targetRow, targetCol, duration, cb);
    };
    return PuzzleGridView;
  })();
  Grid = (function() {
    function Grid(grid, emptyPos) {
      var row, _i, _len;
      this.emptyPos = _.clone(emptyPos);
      this.grid = [];
      for (_i = 0, _len = grid.length; _i < _len; _i++) {
        row = grid[_i];
        this.grid.push(_.clone(row));
      }
    }
    return Grid;
  })();
  this.Puzzle = (function() {
    function Puzzle($el) {
      this.grid = new Grid(INIT_GRID, [3, 3]);
      this.gridView = new PuzzleGridView($el, INIT_GRID);
      this.gridView.queueMoves([ABOVE, LEFT, ABOVE, LEFT]);
      this.gridView.runQueue(150);
    }
    return Puzzle;
  })();
}).call(this);
