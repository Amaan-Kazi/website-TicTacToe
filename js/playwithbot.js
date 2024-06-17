var turn1 = true;
var startTurn1 = false;
var turns = 0;
var winner = 0; // 0 = No One, 1 = X, 2 = O
var isGameOver = false;

var player1Symbol = 'X';
var player2Symbol = 'O';

// Declare grid
var grid = [ [], [], [] ];
var gridState = [ [0,0,0], [0,0,0], [0,0,0] ];

// Statistics
var player1Wins = 0;
var player2Wins = 0;
var draws = 0;

var maxSearchDepth = 9;
var searchedMoves = 0;

// Initialize grid
for (let i = 0; i <= 2; i++)
{
    for (let j = 0; j <= 2; j++)
    {
        grid[i][j] = document.getElementById("" + i + j);
    }
}

function UpdateGrid()
{
    for (let i = 0; i <= 2; i++)
    {
        for (let j = 0; j <= 2; j++)
        {
            if (gridState[i][j] == 0)
            {
                grid[i][j].textContent = "\u00a0";
            }
            else if (gridState[i][j] == 1)
            {
                grid[i][j].textContent = player1Symbol;
            }
            else if (gridState[i][j] == 2)
            {
                grid[i][j].textContent = player2Symbol;
            }
        }
    }

    CheckWin();
}

function gridInput(x, y)
{
    if (turn1 == false)
    {
        if ((gridState[x][y] == 0) && (isGameOver == false))
        {
            grid[x][y].style.transition = "color 1s";
            gridMouseOut(x, y);
            gridState[x][y] = 2;
            grid[x][y].style.color = "#008CBA";

            turn1 = true;
            turns++;

            UpdateGrid();

            if (isGameOver == false)
            {
                BotMove();
            }
        }
    }
}

function gridMouseOver(x, y)
{
    if (turn1 == false)
    {
        if ((gridState[x][y] == 0) && (isGameOver == false))
        {
            grid[x][y].style.fontSize = "5vmax";
            grid[x][y].style.color = "#7f7f7f";

            grid[x][y].textContent = "O";
            
        }
    }
}

function gridMouseOut(x, y)
{
    if (turn1 == false)
    {
        if (gridState[x][y] == 0)
        {
            grid[x][y].style.fontSize = "6vmax";
            grid[x][y].textContent = "\u00a0"
        }
    }
}

function CheckWin()
{
    // Diagonal 1
    if ((gridState[0][0] == gridState[1][1]) && (gridState[1][1] == gridState[2][2]) && (gridState[1][1] != 0))
    {
        winner = gridState[1][1];

        for (let i = 0; i < 3; i++)
        {
            grid[i][i].style.transition = "color 1s background-color 1s";
            grid[i][i].style.backgroundColor = grid[i][i].style.color;
            grid[i][i].style.color = "white";
        }
    }

    // Check rows and columns for win condition
    for (let i = 0; i < 3; i++)
    {
        if ((gridState[i][0] == gridState[i][1]) && (gridState[i][1] == gridState[i][2]) && (gridState[i][0] != 0))
        {
            winner = gridState[i][0];
            for (let j = 0; j < 3; j++)
            {
                if (grid[i][j].style.color != "white")
                {
                    grid[i][j].style.transition = "color 1s background-color 1s";
                    grid[i][j].style.backgroundColor = grid[i][j].style.color;
                    grid[i][j].style.color = "white";
                }
            }
        }
        
        if ((gridState[0][i] == gridState[1][i]) && (gridState[1][i]  == gridState[2][i]) && (gridState[0][i] != 0))
        {
            winner = gridState[0][i];
            for (let j = 0; j < 3; j++)
            {
                if (grid[j][i].style.color != "white")
                {
                    grid[j][i].style.transition = "color 1s background-color 1s";
                    grid[j][i].style.backgroundColor = grid[j][i].style.color;
                    grid[j][i].style.color = "white";
                }
            }
        }
    }
    
    // Diagonal 2
    if ((gridState[0][2] == gridState[1][1])  && (gridState[1][1] == gridState[2][0]) && (gridState[1][1] != 0))
    {
        winner = gridState[1][1];
        // add all 3
        grid[0][2].style.transition = "color 1s background-color 1s";
        grid[0][2].style.backgroundColor = grid[0][2].style.color;
        grid[0][2].style.color = "white";

        if ((grid[1][1].style.color != "white"))
        {
            grid[1][1].style.transition = "color 1s background-color 1s";
            grid[1][1].style.backgroundColor = grid[1][1].style.color;
            grid[1][1].style.color = "white";
        }

        grid[2][0].style.transition = "color 1s background-color 1s";
        grid[2][0].style.backgroundColor = grid[2][0].style.color;
        grid[2][0].style.color = "white";
    }

    if ((winner == 0) && (turns >= 9))
    {
        isGameOver = true;
        setTimeout(function() {
            alert("It is a draw");
            draws++;
            GridReset();
        }, 1000)
    }
    else if (winner == 1)
    {
        isGameOver = true;
        setTimeout(function() {
            alert("The winner is X");
            player1Wins++;
            GridReset();
        }, 1000)
    }
    else if (winner == 2)
    {
        isGameOver = true;
        setTimeout(function() {
            alert("The winner is O");
            player2Wins++;
            GridReset();
        }, 1000)
    }
}

function GridReset()
{
    winner = 0;
    turns = 0;

    turn1 = startTurn1;
    startTurn1 = !startTurn1; // Switch the player who goes first

    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
        {
            gridState[i][j] = 0;
            grid[i][j].style.backgroundColor = "#212121";
            grid[i][j].textContent = "\u00a0";
            grid[i][j].style.fontSize = "6vmax";
            grid[i][j].style.color = "#7f7f7f";
        }
    }

    isGameOver = false;
    UpdateStats();

    console.clear();
    console.log("Scores assume optimal human player \n0: Tie \n10 - depth: X Win \ndepth - 10: O Win");

    if (turn1 == true)
    {
        BotMove();
    }
}

function UpdateStats()
{

}

function Reset()
{
    draws = 0;
    player1Wins = 0;
    player2Wins = 0;

    startTurn1 = true;
    GridReset();
}


// Minimax
function minimax(board, depth, maxDepth, isMaximizingPlayer, alpha, beta)
{
    // Check  if game has ended
    let result = Evaluate(board, depth); // returns +1 for X win, -1 for O win, 0 for draw and null for ongoing game

    // If game is over then return the result for minimax function
    if ((result != null) || (depth >= maxDepth))
    {
        return result;
    }

    searchedMoves++;

    // If turn of maximizing player (bot)
    if (isMaximizingPlayer == true)
    {
        // Maximizing player starts with -Infinity to get a higher score
        let bestScore = -Infinity;

        // Loop through each square in the grid
        for (let i = 0; i < 3; i++)
        {
            for (let j = 0; j < 3; j++)
            {
                // Proceed only if the square is empty
                if (board[i][j] == 0)
                {
                    // Try placing 'X' on that location
                    board[i][j] = 1;

                    // Recursively call minimax to check resultant moves from the new grid
                    let score = minimax(board, depth+1, maxDepth, false, alpha, beta);

                    // Undo the move
                    board[i][j] = 0;

                    //alpha = Math.max(alpha, score);
                    //// Prune if beta <= alpha
                    //if (beta <= alpha)
                    //{
                    //    break;
                    //}

                    // Update the score
                    bestScore = Math.max(bestScore, score);
                }
            }
        }

        return bestScore;
    }
    else // If turn of minimizing player (player)
    {
        // Minimizing player starts with +Infinity to get a lower score
        let bestScore = Infinity;

        // Loop through each square in the grid
        for (let i = 0; i < 3; i++)
        {
            for (let j = 0; j < 3; j++)
            {
                // Proceed only if the square is empty
                if (board[i][j] == 0)
                {
                    // Try placing 'O' on that location
                    board[i][j] = 2;

                    // Recursively call minimax to check resultant moves from the new grid
                    let score = minimax(board, depth+1, maxDepth, true, alpha, beta);

                    // Undo the move
                    board[i][j] = 0;

                    //beta = Math.min(beta, score);
                    //// Prune if beta <= alpha
                    //if (beta <= alpha)
                    //{
                    //    break;
                    //}

                    // Update the score
                    bestScore = Math.min(bestScore, score);
                }
            }
        }

        return bestScore;
    }
}

function Evaluate(board, depth) {
    // Return +1 for X win, -1 for O win, 0 for draw, and null for ongoing game
    
    // Diagonals
    if (((board[0][0] == board[1][1]) && (board[1][1] == board[2][2])) || ((board[0][2] == board[1][1]) && (board[1][1] == board[2][0])))
    {
        if (board[1][1] == 1)
        {
            return 10 - depth;
        }
        else if (board[1][1] == 2)
        {
            return ((10 - depth) * -1); // same as depth - 10
        }
    }

    // Rows
    for (let i = 0; i < 3; i++)
    {
        if ((board[i][0] == board[i][1]) && (board[i][1] == board[i][2]))
        {
            if (board[i][0] == 1)
            {
                return 10 - depth;
            }
            else if (board[i][0] == 2)
            {
                return ((10 - depth) * -1); // same as depth - 10
            }
        }
    }

    // Columns
    for (let i = 0; i < 3; i++)
    {
        if ((board[0][i] == board[1][i]) && (board[1][i] == board[2][i]))
        {
            if (board[0][i] == 1)
            {
                return 10 - depth;
            }
            else if (board[0][i] == 2)
            {
                return ((10 - depth) * -1); // same as depth - 10
            }
        }
    }

    // Draw
    let isDraw = true;
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
        {
            if (board[i][j] == 0)
            {
                isDraw = false;
            }
        }
    }

    if (isDraw == true)
    {
        return 0;
    }

    // return null if no one has won and its not a draw
    return null;
}

function BotMove()
{
    // Maximizing player starts with -Infinity to get a higher score
    let bestScore = -Infinity;

    // Best move to make
    let moveI;
    let moveJ;

    // Stats
    searchedMoves = 0;
    let score;
    let scores = [ ['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-'] ];

    if (maxSearchDepth > 0)
    {
        // Loop through all squares
        for (let i = 0; i < 3; i++)
        {
            for (let j = 0; j < 3; j++)
            {
                // Proceed only if square is empty
                if (gridState[i][j] == 0)
                {
                    // Try placing 'X' on that location
                    gridState[i][j] = 1;

                    score = minimax(gridState, 0, maxSearchDepth, false, -Infinity, Infinity);
                    //console.log("score: " + score + " \nLine 1 \nLine 2");

                    scores[i][j] = score;

                    // Undo the move
                    gridState[i][j] = 0;

                    // Update move location if score is better than on previous squares
                    if (score > bestScore)
                    {
                        bestScore = score;
                        moveI = i;
                        moveJ = j;
                    }
                }
                else if (gridState[i][j] == 1)
                {
                    scores[i][j] = 'X';
                }
                else
                {
                    scores[i][j] = 'O';
                }
            }
        }
    }
    else
    {
        moveI = RandomInt(3);
        moveJ = RandomInt(3);

        while (gridState[moveI][moveJ] != 0)
        {
            moveI = RandomInt(3);
            moveJ = RandomInt(3);
        }
    }

    // Make the best move for X
    grid[moveI][moveJ].style.transition = "color 1s";
    grid[moveI][moveJ].style.fontSize = "6vmax";
    grid[moveI][moveJ].style.color = "#f44336";

    gridState[moveI][moveJ] = 1;

    scores[moveI][moveJ] = ("*" + scores[moveI][moveJ]);

    console.log("Moves Scanned: " + searchedMoves + ", Scores: \n" +
        "|\t" + scores[0][0] + "\t|\t" + scores[0][1] + "\t|\t" + scores[0][2] + "\t| \n" +
        "|\t" + scores[1][0] + "\t|\t" + scores[1][1] + "\t|\t" + scores[1][2] + "\t| \n" +
        "|\t" + scores[2][0] + "\t|\t" + scores[2][1] + "\t|\t" + scores[2][2] + "\t|"
    );

    turn1 = false;
    turns++;
    UpdateGrid();
}

function RandomInt(max)
{
    return Math.floor(Math.random() * max);
}

UpdateGrid();

console.log("Scores assume optimal human player \n0: Tie \n10 - depth: X Win \ndepth - 10: O Win");

BotMove();
