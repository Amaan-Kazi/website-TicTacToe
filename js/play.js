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
    if ((gridState[x][y] == 0) && (isGameOver == false))
    {
        grid[x][y].style.transition = "color 1s";
        gridMouseOut(x, y);

        if (turn1 == true)
        {
            gridState[x][y] = 1;
            grid[x][y].style.color = "#f44336";
        }
        else if (turn1 == false)
        {
            gridState[x][y] = 2;
            grid[x][y].style.color = "#008CBA";
        }

        turn1 = !turn1;
        turns++;

        UpdateGrid();
    }
}

function gridMouseOver(x, y)
{
    if ((gridState[x][y] == 0) && (isGameOver == false))
    {
        grid[x][y].style.fontSize = "5vmax";
        grid[x][y].style.color = "#7f7f7f";

        if (turn1 == true)
        {
            grid[x][y].textContent = "X";
        }
        else if (turn1 == false)
        {
            grid[x][y].textContent = "O";
        }
    }
}

function gridMouseOut(x, y)
{
    if (gridState[x][y] == 0)
    {
        grid[x][y].style.fontSize = "6vmax";
        grid[x][y].textContent = "\u00a0"
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

    // Check rows for win condition
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

UpdateGrid();