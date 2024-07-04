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

const ticTacToeTable = document.getElementById("TicTacToeTable");

const loginForm = document.getElementById("Login");
var user_name;

const messageForm = document.getElementById("SendMessage");
var msg;

const channelForm = document.getElementById("ChannelForm");

var pubnub;
var channelId;

var xUser;
var isUserTurn;

const socket = io("https://chess-amaankazi.onrender.com:3000")

function generateRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}


socket.on('chat-message', data => {
    console.log(`${data.name}: ${data.message}`)
})
  
socket.on('user-connected', name => {
    console.log(`${name} connected`)
})
  
socket.on('user-disconnected', name => {
    console.log(`${name} disconnected`)
})

messageForm.addEventListener("submit", function (event) {
    event.preventDefault();
    msg = messageForm.message.value;
    
    socket.emit("send-chat-message", msg)
    messageForm.reset();
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default reloading on form submit
    user_name = loginForm.username.value;

    
    socket.emit("new-user", user_name)
    console.log("You joined")
});

/*
const subscribePubNub = () => {
    // subscribe to a channel
    // create a local channel entity
    const channel = pubnub.channel(channelId);
    // create a subscription on the channel
    const subscription = channel.subscription();
    
    // add listener
    // add a status listener on the pubnub client
    pubnub.addListener({
        status: (s) => {
            console.log('Status: ', s.category);
        },
    });

    // add an onMessage listener to the channel subscription
    subscription.onMessage = (messageEvent) => {
        // replace with msg display function
        if (messageEvent.message.category == "chat")
        {
            console.log(messageEvent.message.messagingUser + ": " + messageEvent.message.chatMessage);
        }
        else if (messageEvent.message.category == "move")
        {
            if (messageEvent.message.messagingUser != user_name)
            {
                OpponentGridInput(messageEvent.message.moveX, messageEvent.message.moveY);
                isUserTurn = true;
            }
        }
    };

    // subscribe to the channel
    subscription.subscribe();

    console.log("Channel: " + channelId);
}

/*
// PUBNUB
const setupPubNub = () => {
    // Update this block with your publish/subscribe keys
    pubnub = new PubNub({
        publishKey: "pub-c-1f4fb052-a488-4089-9b6a-f2ba042193f7", // Publish Key on pubnub admin panel
        subscribeKey: "sub-c-7d29bc1b-a111-4ff0-99e0-4c64c593df5b", // Subscribe Key on pubnub admin panel
        userId: user_name // Unique user name for each user
    });
};

const publishData = async (type, message, xMove, yMove) => {
    let publishPayload;
    
    if (type == "chat")
    {
        publishPayload = {
            channel : channelId,
            message: {
                messagingUser: user_name,
                category: "chat",
                chatMessage: message,
                moveX: null,
                moveY: null
            }
        };
    }
    else if (type == "move")
    {
        publishPayload = {
            channel: channelId,
            message: {
                messagingUser: user_name,
                category: "move",
                chatMessage: null,
                moveX: xMove,
                moveY: yMove
            }
        }
    }
    
    await pubnub.publish(publishPayload);
}


function createChannel()
{
    channelId = generateRandomString(5);
    channelForm.style.display = "none";

    xUser = user_name;
    isUserTurn = true;
    console.log("X: " + xUser);

    subscribePubNub();
    ticTacToeTable.style.display = "table";
    messageForm.style.display = "block";
}

// FORMS


async function validateChannel(id)
{
    let result;

    try {
        result = await pubnub.hereNow({
            channels: [id],
            //channelGroups: ["cg1"],
            includeUUIDs: true,
            includeState: true
        });

        // due to structure of result
        let objectArray = Object.values(result);
        let objectArray2 = Object.values(objectArray[2]);
        
        if (result.totalOccupancy == 1)
        {
            channelForm.style.display = "none";
            subscribePubNub();

            xUser = objectArray2[0].occupants[0].uuid;
            isUserTurn = false;

            console.log("Opponent: " + xUser);

            ticTacToeTable.style.display = "table";
            messageForm.style.display = "block";
        }
        else
        {
            console.log("Invalid Channel");
        }
    }
    catch (status) {
        console.log(status);
    }
}

channelForm.addEventListener("submit", function (event) {
    event.preventDefault();
    channelId = channelForm.channel.value;

    if ((channelId.length != 0) && (channelId.charAt(0) != " "))
    {
        validateChannel(channelId);
    }
    else
    {
        console.log("Invalid Channel");
    }
});




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
    // If user is X
    if ((xUser == user_name) && (isUserTurn == true))
    {
        if ((gridState[x][y] == 0) && (isGameOver == false))
        {
            grid[x][y].style.transition = "color 1s";
            gridMouseOut(x, y);

            gridState[x][y] = 1;
            grid[x][y].style.color = "#f44336";
            
            isUserTurn = false;

            turns++;

            UpdateGrid();
            publishData("move", null, x, y);
        }
    }
    else if ((xUser != user_name) && (isUserTurn == true))
    {
        if ((gridState[x][y] == 0) && (isGameOver == false))
        {
            grid[x][y].style.transition = "color 1s";
            gridMouseOut(x, y);

            gridState[x][y] = 2;
            grid[x][y].style.color = "#008CBA";

            isUserTurn = false;

            turns++;

            UpdateGrid();
            publishData("move", null, x, y);
        }
    }
}

function OpponentGridInput(x, y)
{
    // If user is X
    if (xUser == user_name)
    {
        if ((gridState[x][y] == 0) && (isGameOver == false))
        {
            grid[x][y].style.transition = "color 1s";
            gridMouseOut(x, y);

            gridState[x][y] = 2;
            grid[x][y].style.color = "#008CBA";

            turns++;

            UpdateGrid();
        }
    }
    else
    {
        if ((gridState[x][y] == 0) && (isGameOver == false))
        {
            grid[x][y].style.transition = "color 1s";
            gridMouseOut(x, y);

            gridState[x][y] = 1;
            grid[x][y].style.color = "#f44336";

            turns++;

            UpdateGrid();
        }
    }
}

function gridMouseOver(x, y)
{
    // If you are X then show X on hover, else show O on hover
    if (xUser == user_name)
    {
        if ((gridState[x][y] == 0) && (isGameOver == false))
        {
            grid[x][y].style.fontSize = "5vmax";
            grid[x][y].style.color = "#7f7f7f";

            grid[x][y].textContent = "X";
        }
    }
    else
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

UpdateGrid();


// Socket.io

/*const express = require("express");
const app = express();

const path = require("path");
const http = require("http");

const {Server} = require("socket.io");
const server = http.createServer(app);

const io = new Server(server);
app.use(express.static(path.resolve("")));



app.get("/", (req, res) => {
    return res.sendFile(__dirname + "/playonline.html");
})

io.on("connection", (socket) => {
    // Socket.io code here
    console.log("User " + socket.id + " connected");
})

server.listen(80, () => {
    console.log("port connected to 80");
})*/
