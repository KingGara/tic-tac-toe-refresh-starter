const Screen = require("./screen");
// const TTT = require("./ttt");

class ComputerPlayer {
    static nextMove;
    // Static method that checks all possible ways to win (X or O has reached 3)
    static checkWin(grid) {
        let total = 0;
        // Score comparison to declare a winner
        const declareWinner = function(X, O) {
            if (X === 3) {
                return "X";
            } else if (O === 3) {
                return "O";
            } else {
                return false;
            }
        }
        // Score counter
        const countMoves = function(i, j, values = {
            X: 0,
            O: 0
        }) {
            if (grid[i][j] === "X") {
                values.X++;
            } else if (grid[i][j] === "O") {
                values.O++
            }
            return values;
        }

        // Horizontal Checking
        for (let i = 0; i < grid.length; i++) {
            let values = {
                X: 0,
                O: 0
            }
            for (let j = 0; j < grid[i].length; j++) {
                values = countMoves(i, j, values);
            }
            if (declareWinner(values.X, values.O)) {
                return declareWinner(values.X, values.O);
            }
        }

        // Vertical Check
        for (let j = 0; j < grid[0].length; j++) {
            let values = {
                X: 0,
                O: 0
            }
            for (let i = 0; i < grid.length; i++) {
                values = countMoves(i, j, values)
            }
            if (declareWinner(values.X, values.O)) {
                return declareWinner(values.X, values.O);
            }
        }

        // Diagonal Check
        let values = {
            X: 0,
            O: 0
        }
        let j = grid[0].length - 1;

        for (let i = 0; i < grid.length; i++) {
            values = countMoves(i, i, values);
        }

        if (declareWinner(values.X, values.O)) {
            return declareWinner(values.X, values.O);
        }

        values.X = 0;
        values.O = 0;

        for (let i = 0; i < grid.length; i++) {
            values = countMoves(i, j, values);

            j--;
        }

        if (declareWinner(values.X, values.O)) {
            return declareWinner(values.X, values.O);
        }

        // Check Tie
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === "X" || grid[i][j] === "O") {
                    total++;
                }
            }
        }

        if (total === grid.length * grid[0].length) {
            return "T"
        }
        return false;
    }
    
    // Static method that pushes all empty cells into a valid moves array
    static getValidMoves(grid) {
        
        const moves = [];

        for (let i = 0; i < grid.length; i++) {
            const row = i;
            for (let j = 0; j < grid[i].length; j++) {
                const col = j;
                if (grid[row][col] === " ") {
                    moves.push({row, col});
                }
            }
        }
        return moves;
    }
    // Static method that sets move array to variable & returns a random move
    static randomMove(grid) {
        const moves = ComputerPlayer.getValidMoves(grid);
        // Random number within the range
        const randomNum = Math.floor(Math.random() * moves.length);

        return moves[randomNum];
    }
    // 
    static minimax(grid, symbol, depth = 0) {
        // Var set using ternary operator [condition ? expressionIfTrue : expressionIfFalse]
        let opponent = symbol === "X" ? "O" : "X";
        // Sets Winner to result of ComputerPlayer.checkWin(grid);
        const winner = ComputerPlayer.checkWin(grid);
        
        // Conditional Check if there is no winner (No winner falsey)
        if (!winner) {
            // Make a deep copy of the grid to simulate each potential move
            let newGrid = [];
            const score = [];
            for (let row = 0; row < grid.length; row++) {
                newGrid.push(grid[row].slice());
            }
            
            // Get empty cells from grid using getValidMoves
            const validMoves = ComputerPlayer.getValidMoves(grid);
            
            // Recursive Search and Evaluation
            // Iterate over each valid moves
            for (let i = 0; i < validMoves.length; i++) {
                const move = validMoves[i];
                // Updating new grid with Symbol
                newGrid[move.row][move.col] = symbol;

                if (symbol === ComputerPlayer.symbol) {
                    depth++;
                    score.push(ComputerPlayer.minimax(newGrid, opponent, depth));
                    depth--;
                } else {
                    score.push(ComputerPlayer.minimax(newGrid, opponent, depth));
                }
                newGrid[move.row][move.col] = " ";
            }

            // Move Selection
            if (symbol === ComputerPlayer.symbol) {
                const min = ComputerPlayer.findMinIndex(score);
                ComputerPlayer.nextMove = validMoves[min];
                return score[min];
            } else {
                const max = ComputerPlayer.findMaxIndex(score)
                ComputerPlayer.nextMove = validMoves[max];
                return score[max];
            }
        
        } else {
            if (winner === "T") {
                return 0;
            } else if ( winner === ComputerPlayer.symbol) {
                return -10 + depth;
            } else {
                return 10 - depth
            }
        }
    }

    static findMinIndex(array) {
        let min = Infinity;
        let index = 0;

        for (let i = 0; i < array.length; i++) {
            if (array[i] <= min) {
                min = array[i];
                index = i;
            }
        }
        return index;
    }

    static findMaxIndex(array) {
        let max = -Infinity;
        let index = 0;

        for (let i = 0; i < array.length; i++) {
            if (array[i] >= max) {
                max = array[i];
                index = i;
            }
        }
        return index;
    }

    static getSmartMove(grid, symbol) {
        ComputerPlayer.minimax(grid, symbol);
        return ComputerPlayer.nextMove;
    }

    // static getWinningMoves(grid, symbol) {

    //     const countSymbol = function(symbol, count, i, j) {
    //         if (grid[i][j] === symbol) {
    //             count++;
    //         }
    //         return count
    //     }

    //     let remaining = {};

    //     const findRemainig = function(i, j) {
    //         if (grid[i][j] === " ") {
    //             remaining.row = i;
    //             remaining.col = j;
    //         }
    //     }
    //     // Sets valid com moves to validMoves
    //     const validMoves = ComputerPlayer.getValidMoves(grid);

    //     // Horizontal Check
    //     for (let i = 0; i < grid.length; i++) {
    //         let count = 0;
    //         for (let j = 0; j < grid[i].length; j++) {
    //             count = countSymbol(symbol, count, i, j);
    //         }

    //         if (count === 2) {
    //             const move = validMoves.reduce((accum, element) => {
    //                 if (element.row === i) {
    //                     return element;
    //                 }
    //                 return accum;
    //             }, null);
                
    //             if (move) return move;
    //         }
    //     }

    //     // Vertical Check
    //     for (let j = 0; j < grid[0].length; j++) {
    //         let count = 0;

    //         for (let i = 0; i < grid.length; i++) {
    //             count = countSymbol(symbol, count, i, j);
    //         }

    //         if (count === 2) {
    //             const move = validMoves.reduce((accum, element) => {
    //                 if (element.col === j) {
    //                     return element;
    //                 }
    //                 return accum;
    //             }, null);
                
    //             if (move) return move;
    //         }
    //     }

    //     // Diagonal Check
    //     let j = 0;
    //     let count = 0;

    //     for (let i = 0; i < grid.length; i++) {
    //         count = countSymbol(symbol, count, i, j);
    //         findRemainig(i, j);

    //         j++;
    //     }

    //     if (count === 2) {
    //         return remaining
    //     }

    //     j = grid[0].length - 1;
    //     count = 0;

    //     for (let i = 0; i < grid.length; i++) {
    //         count = countSymbol(symbol, count, i, j);
    //         findRemainig(i, j);

    //         j--;
    //     }
        
    //     if (count === 2) {
    //         return remaining;
    //     }
    // }
}

module.exports = ComputerPlayer;