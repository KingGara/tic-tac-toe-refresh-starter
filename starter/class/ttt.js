const Screen = require("./screen");
const Cursor = require("./cursor");
const ComputerPlayer = require('./computer-player');

class TTT {

  constructor() {

    this.playerTurn = "O";
    this.computerTurn = "X";
    ComputerPlayer.symbol = "X";

    this.grid = [[' ',' ',' '],
                 [' ',' ',' '],
                 [' ',' ',' ']]

    this.cursor = new Cursor(3, 3);

    // Initialize a 3x3 tic-tac-toe grid
    Screen.initialize(3, 3);
    Screen.setGridlines(true);

    // Replace this with real commands
    Screen.addCommand('up', 'moves the cursor up', this.cursor.up);
    Screen.addCommand('down', 'moves cursor down', this.cursor.down);
    Screen.addCommand('left', 'moves cursor left', this.cursor.left);
    Screen.addCommand('right', 'moves cursor right', this.cursor.right);
    Screen.addCommand('return', "places a move in the cursor's position", this.placeMove)
    Screen.render();
  }

  static checkWin(grid) {

    let total = 0;
    // takes values.X & values.O to see if there has been a winner
    const declareWinner = function (X, O) {
      if (X === 3) {
        return "X";
      } else if (O === 3) {
        return "O";
      } else {
        return false;
      }
    }

    // takes array, index and checks to see if X || O has grid[array][index] (Keeps Score)
    const countMoves = function (array, index, values = {
      X: 0,
      O: 0
    }) {
      if (grid[array][index] === "X") {
        values.X++;
      } else if (grid[array][index] === "O") {
        values.O++;
      }

      return values
    }
    
    // Horiztonal Check
    for (let row = 0; row < 3; row++) {
      if(grid[row][0] !== ' ' && grid[row][0] === grid[row][1] && grid[row][1] === grid[row][2]) {
        return grid[row][0];
    }
  }
    // Vertical Check
    for (let col = 0; col < 3; col++) {
      if (grid[0][col] !== ' ' && grid[0][col] === grid[1][col] && grid[1][col] === grid[2][col]) {
        return grid[0][col]
      }
    }
    // Diagonal Check 
    if(grid[0][0] !== ' ' && grid[0][0] === grid[1][1] && grid[1][1] == grid[2][2] || grid[0][2] !== ' ' && grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
      return grid[1][1]
    }
    // Tie Check
    if (grid.every(row => row.every(cell => cell !== ' '))) {
      return 'T'
    }
    return false
  }

  // Command that places a move at cursors current position
  // 1.) Check if current position is empty
  // 2.) Set the char at current to given char
  // 3.) Update display Grid
  // 4.) Check to see if we have a winner, if so we invoke endGame().
  // 5.) 
  placeMove = () => {
    // Check to see if current position is empty (boolean)
    if (Screen.grid[this.cursor.row][this.cursor.col] === " ") {
      // Sets text color at currnet position to given color
      Screen.setTextColor(this.cursor.row, this.cursor.col, "white");
      // Sets the char at current to the given char.
      Screen.setGrid(this.cursor.row, this.cursor.col, this.playerTurn);
      // Updates Display grid
      Screen.render();
    
      if (TTT.checkWin(Screen.grid)) {
        TTT.endGame(TTT.checkWin(Screen.grid));
      } else {
        this.placeCpuMove();
      }
    }
  }

  // 1.) 
  cpuMove = () => {
    let move = ComputerPlayer.getSmartMove(Screen.grid, this.computerTurn);
    return move;
  }

  placeCpuMove = () => {
    const move = this.cpuMove();
    Screen.setTextColor(move.row, move.col, 'white');
    Screen.setGrid(move.row, move.col, this.computerTurn);
    Screen.render();
    if (TTT.checkWin(Screen.grid)) {
      TTT.endGame(TTT.checkWin(Screen.grid));
    }
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
    console.log(grid)
  }

}

module.exports = TTT;
