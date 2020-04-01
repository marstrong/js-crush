const Board = function(size) {

  let gemId = 0;
  this.score = 0;
  this.boardSize = size;
  this.grid = new Array(this.boardSize);
  for (let i = 0; i <= this.boardSize; i++) {
    this.grid[i] = [];
  }

  this.isValidPosition = function(row, col) {
    return (row >= 0 && col >= 0 &&
            row <= this.boardSize && col <= this.boardSize &&
            row == Math.round(row) && col == Math.round(col));
  }

  this.isEmptyPosition = function(row, col) {
    if (this.getGemAt(row, col)) {
      return false;
    } else {
      return true;
    }
  }

  ////////////////////////////////////////////////
  // Public methods
  
  this.doAutoMove = function() {
    const move = rules.getRandomValidMove();
    const toGem = board.getGemInDirection(move.gem, move.direction);
    this.flipGems(move.gem,toGem);
  }

  this.getSize = function() {
    return this.boardSize;
  }

  this.getGemAt = function(row, col) {
    if (this.isValidPosition(row,col)) {
      return this.grid[row][col];
    }
  }

  this.getLocationOf = function(gem) {
    return {row:gem.row, col:gem.col};
  }

  // list all gems on board (no order)
  this.getAllGems = function() {
    let results = [];
    for (let r in this.grid) {
      for (let c in this.grid[r]) {
        if (this.grid[r][c]) {
         results.push(this.grid[r][c]);
        }
      }
    }
    return results;
  }



  
  // Add a new gem to the board.
  // spawnRow, spawnCol are optional args.
  // They indicate where the gem was "spawned", BEFORE it moved to row, col. 
  // The spawn location may be off the board.
  // Spawn Location is included to the 'add' event.
  // It is used to animate new gems that are coming in from offscreen.
  
  this.add = function(gem, row, col, spawnRow, spawnCol) {
    if (this.isEmptyPosition(row, col)) {
      const details = {
        gem: gem,
        toRow: row,
        toCol: col,
        fromRow: spawnRow,
        fromCol: spawnCol
      };

      gem.row = row;
      gem.col = col;

      this.grid[row][col] = gem;

      $(this).triggerHandler("add", details);
    } else {
      console.log("add already found a gem at " + row + "," + col);
    }
  }

  // move gem from current squre to another square
  this.moveTo = function(gem, toRow, toCol) {
    if (this.isEmptyPosition(toRow,toCol)) {
      const details = {
        gem:gem,
        toRow:toRow,
        toCol:toCol,
        fromRow:gem.row,
        fromCol:gem.col};

      delete this.grid[gem.row][gem.col];
      this.grid[toRow][toCol] = gem;

      gem.row = toRow;
      gem.col = toCol;

      $(this).triggerHandler("move", details);
    }
  }

  // remove specified gem from the board
  this.remove = function(gem) {
    const details = {
      gem: gem,
      fromRow: gem.row,
      fromCol: gem.col
    };
    delete this.grid[gem.row][gem.col];
    gem.row = gem.col = null;
    $(this).triggerHandler("remove", details);
  }

  // remove gem at specified position from the board
  this.removeAt = function(row, col) {
    if (this.isEmptyPosition(row, col)) {
      console.log("removeAt found no gem at " + r + "," + c);
    } else {
      this.remove(this.grid[row][col]);
    }
  }

  // Remove all gems from the board
  this.clear = function() {
    for (let r in this.grid) {
      for (let c in this.grid[r]) {
        if (this.grid[r][c]) {
          this.removeAt(r, c);
        }
      }
    }
  }


  ////////////////////////////////////////////////
  // Utilities
  //

  // Add a gem of specified color at row, col. 
  this.addGem = function(color, row, col, spawnRow, spawnCol) {
    const gem = new Gem(color, gemId++);
    this.add(gem, row, col, spawnRow, spawnCol);
  }


  // Add a gem of random color at row, col
  this.addRandomGem = function(row, col, spawnRow, spawnCol) {
    const random_color = Math.floor(Math.random() * Gem.colors.length);
    const gem = new Gem(Gem.colors[random_color], gemId++);
    this.add(gem, row, col, spawnRow, spawnCol);
  }

  // Returns the gem immediately in the direction specified by direction
  // ['up', 'down', 'left', 'right'] from the gem passed as fromGem
  this.getGemInDirection = function(fromGem, direction) {
    switch(direction) {
      case "up":  {
        return this.getGemAt(fromGem.row-1, fromGem.col);
      }
      case "down": {
        return this.getGemAt(fromGem.row+1, fromGem.col);
      }
      case "left": {
        return this.getGemAt(fromGem.row, fromGem.col-1);
      }
      case "right": {
        return this.getGemAt(fromGem.row, fromGem.col+1);
      }
    }
  }


  // Flip gem1 with gem2 in one step, firing two move events.
  // Does not verify the validity of the flip.
  // Does not crush gems produced by flip.
  this.flipGems = function(gem1, gem2) {
    // Swap the two gems simultaneously.
    const details1 = {
      gem: gem1,
      toRow: gem2.row,
      toCol: gem2.col,
      fromRow: gem1.row,
      fromCol: gem1.col
    };
    const details2 = {
      gem: gem2,
      toRow: gem1.row,
      toCol: gem1.col,
      fromRow: gem2.row,
      fromCol: gem2.col
    };
    
    gem1.row = details1.toRow;
    gem1.col = details1.toCol;
    this.grid[details1.toRow][details1.toCol] = gem1;
    gem2.row = details2.toRow;
    gem2.col = details2.toCol;
    this.grid[details2.toRow][details2.toCol] = gem2;

    // Trigger two move events.
    $(this).triggerHandler("move", details1);
    $(this).triggerHandler("move", details2);
  }

  // reset score
  this.resetScore = function() {
    this.score = 0;
    $(this).triggerHandler("scoreUpdate", [{score: 0}]);
  }

  // update score
  this.incrementScore = function(gem, row, col) {
    this.score += 1;

    $(this).triggerHandler("scoreUpdate", [{
      score: this.score,
      gem: gem,
      row: row,
      col: col
    }]);
  }

  // get current score
  this.getScore = function() {
    return this.score
  }

  // get a string representation of the board as a matrix
  this.toString = function() {
    let result = "";
    for (let r = 0; r < this.boardSize; ++r) {
      for (let c = 0; c < this.boardSize; ++c) {
        const gem = this.grid[r][c];
        if (gem) {
         result += gem.toString().charAt(0) + " ";
        } else {
         result += "_ ";
        }
      }
      result += "<br/>";
    }
    return result.toString();
  }
}
