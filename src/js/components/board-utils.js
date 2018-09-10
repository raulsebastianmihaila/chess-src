import {sides} from '../enums/game';

export const getPieceSquare = (piece, board) =>
  getSquare(
    toRelativeBoardPosition(board, pieceToPosition(piece)),
    board);

const getSquare = (position, board) => {
  const boardRect = board.getBoundingClientRect();
  const squareSize = boardRect.width / 8;

  return {x: Math.floor(position.x / squareSize), y: Math.floor(position.y / squareSize)};
};

const pieceToPosition = (piece) => {
  const pieceRect = piece.getBoundingClientRect();

  return {
    x: pieceRect.left + pieceRect.width / 2,
    y: pieceRect.top + pieceRect.height / 2
  };
};

const toRelativeBoardPosition = (board, position) => {
  const boardRect = board.getBoundingClientRect();
  const boardPosition = keepInsidePosition(board, position);

  return {x: boardPosition.x - boardRect.left, y: boardPosition.y - boardRect.top};
};

const keepInsidePosition = (board, position) => {
  const boardRect = board.getBoundingClientRect();
  let {x, y} = position;

  if (x < boardRect.left) {
    x = boardRect.left;
  } else if (x > boardRect.right) {
    x = boardRect.right;
  }

  if (y < boardRect.top) {
    y = boardRect.top;
  } else if (y > boardRect.bottom) {
    y = boardRect.bottom;
  }

  return {x, y};
};

export const getPiecePosition = (piece, board, mousePosition) => {
  const pieceRect = piece.getBoundingClientRect();

  mousePosition = keepInsidePosition(board, mousePosition);

  return {
    x: mousePosition.x - pieceRect.width / 2,
    y: mousePosition.y - pieceRect.height / 2
  };
};

export const getMouseSquare = (mousePosition, board) =>
  getSquare(
    toRelativeBoardPosition(board, mousePosition),
    board);

export const getViewBoard = (board, playSide) => playSide === sides.white
  ? board.map((column) => column.slice().reverse())
  : board.slice().reverse();
