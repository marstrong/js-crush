class Board {
  constructor(gridSize) {
    this.size = gridSize;
    this.nextGemId = 0;
    this.grid = new Array(this.size);
    for (let row = 0; row < this.size; row++) {
      this.grid[row] = new Array(this.size);
      for (let col = 0; col < this.size; col++) {
        this.grid[row][col] = null;
      }
    }
  }

  getCol(gemId) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.grid[row][col] && this.grid[row][col].id === gemId) {
          return col;
        }
      }
    }
    return null;
  }

  getRow(gemId) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.grid[row][col] && this.grid[row][col].id === gemId) {
          return row;
        }
      }
    }
    return null;
  }

  gem(col, row) {
    if (col >= 0 && col < this.size && row >= 0 && row < this.size) {
      return this.grid[row][col];
    } else {
      return undefined;
    }
  }

  addNewGem(col, row) {
    const id = this.nextGemId++;
    const getCol = this.getCol.bind(this);
    const getRow = this.getRow.bind(this);
    const newGem = new Gem(id, getCol, getRow);
    this.grid[row][col] = newGem;
  }

  updateGem(gem, newCol, newRow) {
    this.grid[newRow][newCol] = gem;
  }

  swapGems(gem1, gem2) {
    const gem1Col = this.getCol(gem1.id);
    const gem1Row = this.getRow(gem1.id);
    const gem2Col = this.getCol(gem2.id);
    const gem2Row = this.getRow(gem2.id);
    this.grid[gem1Row][gem1Col] = gem2;
    this.grid[gem2Row][gem2Col] = gem1;
  }

  relativePosition(gem1, gem2) {
    const dx = gem2.col() - gem1.col();
    const dy = gem2.row() - gem1.row();
    let direction;
    if (dx === 1 && dy === 0) direction = "right";
    if (dx === 0 && dy === 1) direction = "down";
    if (dx === -1 && dy === 0) direction = "left";
    if (dx === 0 && dy === -1) direction = "up";
    return direction;
  }

  removeGem(gem) {
    const col = this.getCol(gem.id);
    const row = this.getRow(gem.id);
    this.grid[row][col] = null;
  }

  removeGems(gems) {
    for (let i = 0; i < gems.length; i++) {
      this.removeGem(gems[i]);
    }
  }

  adjacent(gem) {
    const gems = [];
    const col = this.getCol(gem.id);
    const row = this.getRow(gem.id);
    let right, down, left, up;
    // check if square is on the board (passing -1 as a row value causes errors)
    if (col + 1 < this.size) right = this.gem(col + 1, row);
    if (row + 1 < this.size) down = this.gem(col, row + 1);
    if (col - 1 >= 0) left = this.gem(col - 1, row);
    if (row - 1 >= 0) up = this.gem(col, row - 1);
    // check if square contains a gem
    if (right) gems.push(right);
    if (down) gems.push(down);
    if (left) gems.push(left);
    if (up) gems.push(up);
    // return adjacent gems
    return gems;
  }

  randomize() {
    // flatten the grid into a single array of gems
    const array = [].concat.apply([], this.grid);

    // shuffle array (https://github.com/coolaj86/knuth-shuffle)
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // ...pick one of the remaining elements...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // ...and swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    // iterate through grid squares and place a gem at each
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const gem = array.pop();
        this.updateGem(gem, col, row);
      }
    }
  }
}
