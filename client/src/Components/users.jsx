import React from "react";

const Users = ({currentPlayer,opponent,currentPlayerName,playingAs}) => {
  return (
    <div className="users">
      <div className={`user-lt ${currentPlayer === playingAs ? "pink-bg":""}`}>{currentPlayerName}</div>
      <div className={`user-rt ${currentPlayer !== playingAs ? "purple-bg":""}`}>{opponent}</div>
    </div>
  );
};

export default Users;
