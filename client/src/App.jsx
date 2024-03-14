import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import Users from "./Components/users";
import Square from "./Components/square";
import { getGameWinner } from "./utils/gameWinner";
import { getName } from "./utils/getName";

const game = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

function App() {
  const [gameState, setGameState] = useState(game);
  const [gameFinished, setGameFinished] = useState(null);
  const [winningSquareArray, setWinningSquareArray] = useState([]);
  const [socketState, setSocketState] = useState(null);

  const [currentPlayer, setCurrentPlayer] = useState("circle");
  const [currentPlayerName, setCurrentPlayerName] = useState("");

  const [opponent, setOpponent] = useState(null);
  const [playingAs, setPlayingAs] = useState(null);

  // Socket Events
  socketState?.on("opponentNotFound", () => {
    setOpponent("");
  });
  socketState?.on("opponentFound", (data) => {
    setOpponent(data.opponentName);
    setPlayingAs(data.IplayingAs);
  });
  socketState?.on("opponentLeftTheMatch", () => {
    alert("Opponent Left The Match");
  });

  // handlers //
  const playOnlineHandler = async () => {
    const result = await getName();
    if (!result.isConfirmed) return;
    const name = result.value;
    setCurrentPlayerName(result.value);

    // Initializing Socket
    const socket = io("http://localhost:3000", { autoConnect: true });
    setSocketState(socket);

    // Emitting the playOnline Socket Event
    socket?.emit("playOnline", { playerName: name });
  };

  // UseEffects //
  useEffect(() => {
    const winner = getGameWinner({ gameState, setWinningSquareArray });
    // if winner === draw

    if (winner) {
      setGameFinished(winner);
    }
  }, [gameState]);

  useEffect(() => {
    socketState?.on("connect", () => {
      // console.log("Socket Connected Frontend")
    });
  }, [socketState]);

  // Coditional JSX
  if (!currentPlayerName) {
    return (
      <div className="full">
        <button onClick={playOnlineHandler}>Play Online</button>
      </div>
    );
  }
  if (currentPlayerName && !opponent) {
    return (
      <div className="full">
        <p>Waiting For Opponent....</p>
      </div>
    );
  }

  if (currentPlayerName && opponent) {
    socketState.emit("userPlaying", { username: currentPlayerName });
  }

  return (
    <main>
      <div className="game-container">
        <Users
          currentPlayerName={currentPlayerName}
          currentPlayer={currentPlayer}
          opponent={opponent}
          playingAs={playingAs}
        />
        <h2>Tic Tac Toe</h2>
        <div className="square-container">
          {gameState.map((arr, rowInd) =>
            arr.map((i, colInd) => (
              <Square
                key={colInd}
                currentPlayer={currentPlayer}
                setCurrentPlayer={setCurrentPlayer}
                id={`${rowInd}-${colInd}`}
                gameState={gameState}
                setGameState={setGameState}
                gameFinished={gameFinished}
                winningSquareArray={winningSquareArray}
                socketState={socketState}
                playingAs={playingAs}
              />
            ))
          )}
        </div>
      </div>
      {gameFinished && gameFinished === "draw" && (
        <p>
          <span>Draw</span>
        </p>
      )}
      {gameFinished && gameFinished !== "draw" && (
        <p>
          <span>{gameFinished === playingAs ? "you" : `${opponent}`}</span> Won
          The Game
        </p>
      )}
    </main>
  );
}

export default App;
