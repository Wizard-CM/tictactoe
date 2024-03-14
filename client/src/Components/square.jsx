import React, { useEffect, useRef, useState } from "react";

const circleSvg = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>{" "}
    </g>
  </svg>
);
const crossSvg = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M19 5L5 19M5.00001 5L19 19"
        stroke="#fff"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>{" "}
    </g>
  </svg>
);

const Square = ({
  currentPlayer,
  setCurrentPlayer,
  id,
  gameState,
  setGameState,
  gameFinished,
  winningSquareArray,
  socketState,
  playingAs,
}) => {
  const [icon, setIcon] = useState(null);

  socketState?.on("playerMoveFromServer", (data) => {
    // console.log(id)
    const newGameState = data.game;
    setGameState((prev) => [...newGameState]);
    const row = id.split("-")[0];
    const col = id.split("-")[1];
    newGameState[row][col] === "circle" && setIcon(circleSvg);
    newGameState[row][col] === "cross" && setIcon(crossSvg);

    setCurrentPlayer(currentPlayer === "circle" ? "cross" : "circle");
  });

  // Handlers
  const squareClickHandler = () => {
    if (playingAs !== currentPlayer) return;
    var gameStateData = gameState;
    const row = id.split("-")[0];
    const col = id.split("-")[1];
    gameStateData[row][col] = currentPlayer;

    if (gameFinished) return;
    setIcon(currentPlayer === "circle" ? circleSvg : crossSvg);
    setGameState((prev) => {
      const oldGameState = [...prev];
      const row = id.split("-")[0];
      const col = id.split("-")[1];
      oldGameState[row][col] = currentPlayer;
      return oldGameState;
    });
    setCurrentPlayer(currentPlayer === "circle" ? "cross" : "circle");

    // Socket Related Logic
    socketState.emit("playerMoveFromClient", { game: gameStateData });
  };
  return (
    <div
      className={`square ${gameFinished ? "game-finished" : ""} ${
        winningSquareArray.includes(id)
          ? currentPlayer === "circle"
            ? "purple-bg"
            : "pink-bg"
          : ""
      } ${playingAs !== currentPlayer ? "game-finished" : ""}`}
      onClick={squareClickHandler}
    >
      {icon}
    </div>
  );
};

export default Square;
