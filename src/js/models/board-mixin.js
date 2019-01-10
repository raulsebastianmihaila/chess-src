import mixin from 'smart-mix';

import {sides, pieceTypes} from '../enums/game';
import {Move, cloneBoard, setupNewBoard, getRealSquare, getSideSquare, isCastling, getReverseSquare,
  getOppositeSide, isDrawPosition} from './board-utils';

export const createBoard = () => {
  const board = Array.from({length: 8}, () => Array.from({length: 8}));

  board.currentSide = null;
  // every board has a last move because of en passant, even if the board doesn't use
  board.lastMove = null;
  board.isOver = false;
  board.isCheckMate = false;
  board.isStaleMate = false;
  board.isDraw = false;
  board.winnerSide = null;

  return board;
};

export const createBoardMixState = () => ({
  kings: {},
  currentMove: null
});

const boardMixin = mixin((board, mixState) => {
  const boardMix = {};

  boardMix.init = (fromBoard, isClean) => {
    // an isClean board is an empty board with initial current side
    // or an existing board configuration where the pieces aren't marked as moved

    mixState.kings[sides.white] = null;
    mixState.kings[sides.black] = null;

    if (fromBoard) {
      cloneBoard(board, mixState.kings, fromBoard, isClean);
    } else {
      setupNewBoard(board, mixState.kings, isClean);
    }

    return board;
  };

  boardMix.isSafeMove = (piece, x, y) => {
    boardMix.internalMove(piece, x, y);

    const isSafe = !boardMix.isInCheck(piece.side);

    boardMix.cancelCurrentMove();

    return isSafe;
  };

  boardMix.internalMove = (piece, x, y) => {
    mixState.currentMove = new Move(board, piece, x, y);

    if (isCastling(piece, x)) {
      boardMix.movePiece(
        mixState.currentMove.castlingRook,
        mixState.currentMove.castlingRookTo.x,
        mixState.currentMove.castlingRookTo.y);
    }

    boardMix.movePiece(piece, mixState.currentMove.mainTo.x, mixState.currentMove.mainTo.y);

    if (mixState.currentMove.isEnPassant) {
      boardMix.clearSquare(board.lastMove.mainTo.x, board.lastMove.mainTo.y);
    }
  };

  boardMix.movePiece = (piece, x, y) => {
    const currentSquare = getRealSquare(piece.side, piece.x, piece.y);
    const newSideSquare = getSideSquare(piece.side, x, y);

    boardMix.clearSquare(currentSquare.x, currentSquare.y);

    board[x][y] = piece;
    piece.x = newSideSquare.x;
    piece.y = newSideSquare.y;
  };

  boardMix.clearSquare = (x, y) => {
    board[x][y] = null;
  };

  boardMix.setSideBoardResolution = (side) => {
    const oppositeSide = getOppositeSide(side);
    const isOpponentChecked = boardMix.isInCheck(oppositeSide);

    mixState.kings[oppositeSide].isChecked = isOpponentChecked;

    if (!boardMix.hasSidePossibleSafeMoves(oppositeSide)) {
      board.isOver = true;

      if (isOpponentChecked) {
        board.isCheckMate = true;
        board.winnerSide = side;
      } else {
        board.isStaleMate = true;
        board.isDraw = true;
      }
    } else if (isDrawPosition(board)) {
      boardMix.draw();
    }
  };

  boardMix.isInCheck = (side) => {
    const king = mixState.kings[side];

    return boardMix.isSquareAttacked(side, king.x, king.y);
  };

  boardMix.isSquareAttacked = (side, x, y) => {
    const square = getReverseSquare(x, y);

    return boardMix.somePiece((piece) =>
      piece.side !== side && piece.canAttack(square.x, square.y));
  };

  boardMix.cancelCurrentMove = () => {
    if (!mixState.currentMove) {
      throw new Error('There\'s no current move.');
    }

    boardMix.movePiece(
      mixState.currentMove.mainPiece,
      mixState.currentMove.mainFrom.x,
      mixState.currentMove.mainFrom.y);

    if (mixState.currentMove.removedPiece) {
      boardMix.putPiece(mixState.currentMove.removedPiece);
    } else if (mixState.currentMove.castlingRook) {
      boardMix.movePiece(
        mixState.currentMove.castlingRook,
        mixState.currentMove.castlingRookFrom.x,
        mixState.currentMove.castlingRookFrom.y);
    }

    mixState.currentMove = null;
  };

  boardMix.putPiece = (piece) => {
    const square = getRealSquare(piece.side, piece.x, piece.y);

    board[square.x][square.y] = piece;
  };

  boardMix.hasSidePossibleSafeMoves = (side) =>
    boardMix.getSidePossibleMoves(side).some(({piece, x, y}) => boardMix.isSafeMove(piece, x, y));

  boardMix.getSidePossibleMoves = (side) => {
    const moves = [];

    for (const piece of boardMix.pieces()) {
      if (piece.side === side) {
        moves.push(...boardMix.getPieceMoves(piece));
      }
    }

    return moves;
  };

  boardMix.getPieceMoves = (piece) =>
    piece.getPossibleMoves({previousMove: board.lastMove})
      .map((move) => Object.assign({piece}, move));

  boardMix.draw = () => {
    board.isDraw = true;
    board.isOver = true;
  };

  boardMix.getPiece = (side, x, y) => {
    ({x, y} = getRealSquare(side, x, y));

    return board[x][y];
  };

  boardMix.isOccupied = (side, x, y) => !!boardMix.getPiece(side, x, y);

  boardMix.isSideOccupied = (side, x, y) => {
    const destinationPiece = boardMix.getPiece(side, x, y);

    return !!destinationPiece && destinationPiece.side === side;
  };

  boardMix.isUnmovedRook = (side, x, y) => {
    const piece = boardMix.getPiece(side, x, y);

    return !!piece && piece.side === side && piece.type === pieceTypes.rook && !piece.moved;
  };

  boardMix.pieces = function* () {
    for (const column of board) {
      for (const piece of column) {
        if (piece) { yield piece; }
      }
    }
  };

  boardMix.findPiece = (predicate) => {
    for (const piece of boardMix.pieces()) {
      if (predicate(piece)) {
        return piece;
      }
    }
  };

  boardMix.somePiece = (predicate) => !!boardMix.findPiece(predicate);

  boardMix.everyPiece = (predicate) => !boardMix.somePiece((piece) => !predicate(piece));

  return boardMix;
});

export default boardMixin;
