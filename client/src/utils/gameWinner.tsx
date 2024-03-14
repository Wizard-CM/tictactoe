export const getGameWinner = ({ gameState, setWinningSquareArray }) => {
  // row winner
  for (let row = 0; row < gameState.length; row++) {
    if (
      gameState[row][0] === gameState[row][1] &&
      gameState[row][1] === gameState[row][2]
    ) {
      setWinningSquareArray([`${row}-${0}`, `${row}-${1}`, `${row}-${2}`]);
      return gameState[row][0];
    }
  }
  // col winner
  for (let col = 0; col < gameState.length; col++) {
    if (
      gameState[0][col] === gameState[1][col] &&
      gameState[1][col] === gameState[2][col]
    ) {
      setWinningSquareArray([`${0}-${col}`, `${1}-${col}`, `${2}-${col}`]);
      return gameState[0][col];
    }
  }
  // diagonal winner
  if (
    gameState[0][0] === gameState[1][1] &&
    gameState[1][1] === gameState[2][2]
  ) {
    setWinningSquareArray([`${0}-${0}`, `${1}-${1}`, `${2}-${2}`]);
    return gameState[0][0];
  }
  if (
    gameState[0][2] === gameState[1][1] &&
    gameState[1][1] === gameState[2][0]
  ) {
    setWinningSquareArray([`${0}-${2}`, `${1}-${1}`, `${2}-${0}`]);
    return gameState[0][2];
  }

  // draw logic
  const isDraw = gameState.flat().every((i) => i === "circle" || i === "cross");
  if (isDraw) return "draw";

  return null;
};
