const Screen = require("./screen");
const Cursor = require("./cursor");

class TTT {

  constructor() {

    this.playerTurn = "O";

    this.grid = [[' ',' ',' '],
                 [' ',' ',' '],
                 [' ',' ',' ']]

    this.cursor = new Cursor(3, 3);

    // Initialize a 3x3 tic-tac-toe grid
    Screen.initialize(3, 3);
    Screen.setGridlines(true);

    // Replace this with real commands
    Screen.addCommand('t', 'test command (remove)', TTT.testCommand);

    Screen.render();
  }


  static checkWin(grid) {
    // check for horizontal wins
    for (let row = 0; row < 3; row++) {
      if (grid[row][0] !== ' ' && grid[row][0] === grid[row][1] && grid[row][1] === grid[row][2]) {
        return grid[row][0];
      }
    }
    // Vertical Check
    for (let col = 0; col < 3; col++) {
      if (grid[0][col] !== ' ' && grid[0][col] === grid[1][col] && grid[1][col] === grid[2][col]) {
        return grid[0][col];
      }
    }
    // Diangonal Check
    if(grid[0][0] !== ' ' && grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2] || grid[0][2] !== ' ' && grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
      return grid[1][1];
    }

    if(grid.every(row => row.every(cell => cell !== ' '))) {
      return 'T';
    }
    
    return false;
  }

  
  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = TTT;
