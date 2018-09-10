import BuildingBoard from './building-board';

export default function BoardBuilder() {
  const boardBuilder = {
    board: null
  };

  boardBuilder.hasSideKing = (...args) => boardBuilder.board.hasSideKing(...args);
  boardBuilder.getNonPlayableBoardReason = () => boardBuilder.board.getNonPlayableBoardReason();
  boardBuilder.isBoardPlayable = () => boardBuilder.board.isBoardPlayable();
  boardBuilder.addPiece = (...args) => boardBuilder.board.addPiece(...args);
  boardBuilder.movePiece = (...args) => boardBuilder.board.movePiece(...args);
  boardBuilder.deletePiece = (...args) => boardBuilder.board.deletePiece(...args);
  boardBuilder.reverse = () => boardBuilder.board.reverse();

  boardBuilder.reset = () => {
    boardBuilder.board = new BuildingBoard({isClean: true});
  };

  boardBuilder.makeBoardFromGame = (game) => {
    boardBuilder.board = new BuildingBoard({board: game.history.current, isClean: true});
  };

  boardBuilder.reset();

  return boardBuilder;
}
