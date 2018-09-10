import {pieceTypes, colors} from '../enums/game';
import {isValidSquareIndex} from './board-utils';
import Pawn from './pawn';
import Bishop from './bishop';
import Knight from './knight';
import Rook from './rook';
import Queen from './queen';
import King from './king';

export const canLineMove = (piece, x, y, board) => {
  if (!isValidSquareIndex(x) || !isValidSquareIndex(y)) {
    return false;
  }

  if (board.isSideOccupied(piece.side, x, y)) {
    return false;
  }

  const xDif = Math.abs(x - piece.x);
  const yDif = Math.abs(y - piece.y);

  if (xDif && yDif) {
    return false;
  }

  const key = xDif ? 'x' : 'y';
  const destination = key === 'x' ? x : y;
  const keyStep = destination < piece[key] ? -1 : 1;
  // the other key must be set and remain constant
  const square = {
    x,
    y
  };

  for (let step = 1, stepLimit = Math.abs(destination - piece[key]); step < stepLimit; step += 1) {
    square[key] = piece[key] + step * keyStep;

    if (board.isOccupied(piece.side, square.x, square.y)) {
      return false;
    }
  }

  return true;
};

function* getLineMoves(piece, key, pairKey, keyStep, board) {
  const square = {
    x: piece.x,
    y: piece.y
  };

  for (let step = 1; ; step += 1) {
    square[key] = piece[key] + step * keyStep;

    if (!isValidSquareIndex(square[key])) {
      return;
    }

    const destinationPiece = board.getPiece(piece.side, square.x, square.y);

    if (destinationPiece && destinationPiece.side === piece.side) { return; }

    yield {x: square.x, y: square.y};

    if (destinationPiece) { return; }
  }
}

export const getLinePossibleMoves = (piece, board) => [
  ...getLineMoves(piece, 'x', 'y', 1, board),
  ...getLineMoves(piece, 'x', 'y', -1, board),
  ...getLineMoves(piece, 'y', 'x', 1, board),
  ...getLineMoves(piece, 'y', 'x', -1, board)
];

export const canDiagMove = (piece, x, y, board) => {
  if (!isValidSquareIndex(x) || !isValidSquareIndex(y)) {
    return false;
  }

  if (board.isSideOccupied(piece.side, x, y)) {
    return false;
  }

  if (Math.abs(x - piece.x) !== Math.abs(y - piece.y)) {
    return false;
  }

  const xStep = x > piece.x ? 1 : -1;
  const yStep = y > piece.y ? 1 : -1;

  for (let step = 1, stepLimit = Math.abs(x - piece.x); step < stepLimit; step += 1) {
    const xSquare = piece.x + step * xStep;
    const ySquare = piece.y + step * yStep;

    if (board.isOccupied(piece.side, xSquare, ySquare)) {
      return false;
    }
  }

  return true;
};

function* getDiagMoves(piece, xStep, yStep, board) {
  for (let step = 1; ; step += 1) {
    const x = piece.x + step * xStep;
    const y = piece.y + step * yStep;

    if (!isValidSquareIndex(x) || !isValidSquareIndex(y)) {
      return;
    }

    const destinationPiece = board.getPiece(piece.side, x, y);

    if (destinationPiece && destinationPiece.side === piece.side) { return; }

    yield {x, y};

    if (destinationPiece) { return; }
  }
}

export const getDiagPossibleMoves = (piece, board) => [
  ...getDiagMoves(piece, -1, -1, board),
  ...getDiagMoves(piece, -1, 1, board),
  ...getDiagMoves(piece, 1, 1, board),
  ...getDiagMoves(piece, 1, -1, board)
];

export const makePiece = (type, ...args) => {
  switch (type) {
    case pieceTypes.pawn:
      return new Pawn(...args);
    case pieceTypes.bishop:
      return new Bishop(...args);
    case pieceTypes.knight:
      return new Knight(...args);
    case pieceTypes.rook:
      return new Rook(...args);
    case pieceTypes.queen:
      return new Queen(...args);
    case pieceTypes.king:
      return new King(...args);
  }

  throw new Error('Unmakable type');
};

export const clonePiece = (piece, board, isClean) => {
  const newPiece = makePiece(piece.type, piece.x, piece.y, piece.side, board);

  if (!isClean) {
    newPiece.moved = piece.moved;
  }

  if (newPiece.type === pieceTypes.king) {
    newPiece.isChecked = piece.isChecked;
  }

  return newPiece;
};

export const getPieceIcon = (piece) => {
  switch (piece.type) {
    case pieceTypes.pawn:
      return '\u265f';
    case pieceTypes.bishop:
      return '\u265d';
    case pieceTypes.knight:
      return '\u265e';
    case pieceTypes.rook:
      return '\u265c';
    case pieceTypes.queen:
      return '\u265b';
    case pieceTypes.king:
      return '\u265a';
    default:
      throw new Error('Icon not found');
  }
};

export const getPieceSquareColor = (piece) => {
  return piece.x % 2 === piece.y % 2
    ? colors.black
    : colors.white;
};
