# Tic Tac Toe
This project features:
1. Player Vs Player (Local)
2. Player Vs Bot (MiniMax Algorithm)
3. Player Vs Player (Online)

## Player Vs Player (Local)

Round 1: X starts

Round 2: O starts

Starting player is alternated this way

## Player Vs Bot (MiniMax Algorithm)

Bot is always X and starts first in round 1, then starting player is alternated

The bot is made using [Minimax Algorithm](https://en.wikipedia.org/wiki/Minimax) and always plays the perfect move resulting in a win or draw on the highest difficulty, It evaluates every possible move and chooses the the move with the highest score, assuming the opponent will play optimally

## Player Vs Player (Online)

To avoid using a backend server, the data is sent throug [PubNub](https://www.pubnub.com/) channels (Rooms)

Each player has a unique username and can choose to create or join a room with a randomly generated 5 Letter (Upper and Lower Case) room code

The player who creates the room is always X and is the starting player in the first round
