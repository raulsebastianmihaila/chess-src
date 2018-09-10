import {sides, pieceTypes} from '../enums/game';
import {clonePiece, getPieceIcon, getPieceSquareColor} from './piece-utils';
import Pawn from './pawn';
import Bishop from './bishop';
import Knight from './knight';
import Rook from './rook';
import Queen from './queen';
import King from './king';

export const createBoard = () => Array.from({length: 8}, () => Array.from({length: 8}));

export const cloneBoard = (board, kings, clonedBoard, isClean) => {
  clonedBoard.forEach((column, x) => {
    column.forEach((piece, y) => {
      if (piece) {
        const clone = clonePiece(piece, board, isClean);

        board[x][y] = clone;

        if (clone.type === pieceTypes.king) {
          kings[clone.side] = clone;
        }
      }
    });
  });

  board.currentSide = clonedBoard.currentSide;
  board.lastMove = isClean
    ? null
    : clonedBoard.lastMove && cloneMove(clonedBoard.lastMove, board);
  board.isOver = clonedBoard.isOver;
  board.isCheckMate = clonedBoard.isCheckMate;
  board.isStaleMate = clonedBoard.isStaleMate;
  board.isDraw = clonedBoard.isDraw;
  board.winnerSide = clonedBoard.winnerSide;
};

export const setupNewBoard = (board, kings, isClean) => {
  board.currentSide = sides.white;

  if (!isClean) {
    makePieces(board);
  }

  kings[sides.white] = board[4][0];
  kings[sides.black] = board[4][7];
};

export function Move(board, piece, x, y) {
  const toSquare = getRealSquare(piece.side, x, y);
  const isMoveEnPassant = isEnPassant(board, piece, x, y);

  const move = {
    mainPiece: piece,
    mainFrom: getRealSquare(piece.side, piece.x, piece.y),
    mainTo: toSquare,
    isJump: isJump(piece, x, y),
    isEnPassant: isMoveEnPassant,
    removedPiece: isMoveEnPassant
      ? board.lastMove.mainPiece
      : board[toSquare.x][toSquare.y],
    castlingRook: null,
    castlingRookFrom: null,
    castlingRookTo: null,
    notation: null,
    isCheck: false,
    isCheckMate: false,
    promotionPiece: null,
    isComplete: false
  };

  if (isCastling(piece, x)) {
    move.castlingRook = board.getPiece(piece.side, x < piece.x ? 0 : 7, 0);
    move.castlingRookFrom = getRealSquare(
      move.castlingRook.side,
      move.castlingRook.x,
      move.castlingRook.y
    );
    move.castlingRookTo = getRealSquare(
      move.castlingRook.side,
      x < piece.x ? piece.x - 1 : piece.x + 1,
      move.castlingRook.y
    );
  }

  return move;
}

// return the same position for white or the reverse position for black
const getSquare = (side, x, y) => side === sides.white
  ? {x, y}
  : getReverseSquare(x, y);

// the real position is the same as the white position and the reverse of black's position
export const getRealSquare = getSquare;

// the white's position is the same as the real position and black's position is reverse
export const getSideSquare = getSquare;

const isEnPassant = (board, piece, x, y) => {
  if (piece.type !== pieceTypes.pawn || !board.lastMove || !board.lastMove.isJump) {
    return false;
  }

  const lastPosition = getSideSquare(board.lastMove.mainPiece.side, board.lastMove.mainTo.x,
    board.lastMove.mainTo.y);

  return x === getReverseSquareIndex(lastPosition.x) && y === 5;
};

const isJump = (piece, x, y) => piece.type === pieceTypes.pawn && y - piece.y === 2;

export const isCastling = (piece, x) =>
  piece.type === pieceTypes.king && Math.abs(x - piece.x) === 2;

export const makePieces = (board) => {
  board[0][0] = new Rook(0, 0, sides.white, board);
  board[1][0] = new Knight(1, 0, sides.white, board);
  board[2][0] = new Bishop(2, 0, sides.white, board);
  board[3][0] = new Queen(3, 0, sides.white, board);
  board[4][0] = new King(4, 0, sides.white, board);
  board[5][0] = new Bishop(5, 0, sides.white, board);
  board[6][0] = new Knight(6, 0, sides.white, board);
  board[7][0] = new Rook(7, 0, sides.white, board);

  for (let i = 0; i < 8; i += 1) {
    board[i][1] = new Pawn(i, 1, sides.white, board);
  }

  board[0][7] = new Rook(7, 0, sides.black, board);
  board[1][7] = new Knight(6, 0, sides.black, board);
  board[2][7] = new Bishop(5, 0, sides.black, board);
  board[3][7] = new Queen(4, 0, sides.black, board);
  board[4][7] = new King(3, 0, sides.black, board);
  board[5][7] = new Bishop(2, 0, sides.black, board);
  board[6][7] = new Knight(1, 0, sides.black, board);
  board[7][7] = new Rook(0, 0, sides.black, board);

  for (let i = 0; i < 8; i += 1) {
    board[i][6] = new Pawn(7 - i, 1, sides.black, board);
  }
};

export const getOppositeSide = (side) => side === sides.white ? sides.black : sides.white;

export const isValidSquareIndex = (value) => value >= 0 && value <= 7;

export const getReverseSquareIndex = (value) => 7 - value;

export const getReverseSquare = (x, y) => ({
  x: getReverseSquareIndex(x),
  y: getReverseSquareIndex(y)
});

const getFileNotation = (index) => String.fromCharCode(97 + index);

const getSquareNotation = (square) => `${getFileNotation(square.x)}${square.y + 1}`;

export const getMoveNotation = (move) => {
  let notation;

  if (move.castlingRook) {
    if (Math.abs(move.castlingRookFrom.x - move.mainFrom.x) === 4) {
      notation = 'O-O-O';
    } else {
      notation = 'O-O';
    }
  } else {
    notation = `${getPieceIcon(move.mainPiece)}${getSquareNotation(move.mainFrom)}`
      + `${move.removedPiece ? 'x' : '-'}${getSquareNotation(move.mainTo)}`
      + `${move.promotionPiece ? getPieceIcon(move.promotionPiece) : ''}`;
  }

  if (move.isCheckMate) {
    notation += '#';
  } else if (move.isCheck) {
    notation += '+';
  }

  return notation;
};

export const cloneMove = (move, board) => {
  return {
    mainPiece: move.mainPiece && board[move.mainTo.x][move.mainTo.y],
    mainFrom: move.mainFrom && {x: move.mainFrom.x, y: move.mainFrom.y},
    mainTo: move.mainTo && {x: move.mainTo.x, y: move.mainTo.y},
    isJump: move.isJump,
    isEnPassant: move.isEnPassant,
    // the removed piece can be recreated since it's not on the board anymore
    removedPiece: move.removedPiece && clonePiece(move.removedPiece, board),
    castlingRook: move.castlingRook && board[move.castlingRookTo.x][move.castlingRookTo.y],
    castlingRookFrom: move.castlingRookFrom && {
      x: move.castlingRookFrom.x,
      y: move.castlingRookFrom.y
    },
    castlingRookTo: move.castlingRookTo && {x: move.castlingRookTo.x, y: move.castlingRookTo.y},
    notation: move.notation,
    isCheck: move.isCheck,
    isCheckMate: move.isCheckMate,
    // the promotion piece is used only for its icon
    promotionPiece: move.promotionPiece && clonePiece(move.promotionPiece, board),
    isComplete: move.isComplete
  };
};

export const areEqual = (board1, board2) => {
  return board1.every((column, x) => {
    return column.every((piece1, y) => {
      const piece2 = board2[x][y];

      if (!piece1 !== !piece2) {
        return false;
      }

      if (piece1) {
        return piece1.type === piece2.type && piece1.side === piece2.side;
      }

      return true;
    });
  });
};

const isKingDrawPosition = (board) => board.everyPiece((piece) => piece.type === pieceTypes.king);

const isKnightDrawPosition = (board) => {
  let foundKnight = false;

  for (const piece of board.pieces()) {
    if (piece.type !== pieceTypes.king) {
      if (foundKnight) {
        return false;
      }

      if (piece.type === pieceTypes.knight) {
        foundKnight = true;
      } else {
        return false;
      }
    }
  }

  return foundKnight;
};

const isBishopDrawPosition = (board) => {
  let bishopSquareColor = null;

  for (const piece of board.pieces()) {
    if (piece.type !== pieceTypes.king) {
      if (piece.type === pieceTypes.bishop) {
        if (bishopSquareColor) {
          if (getPieceSquareColor(piece) !== bishopSquareColor) {
            return false;
          }
        } else {
          bishopSquareColor = getPieceSquareColor(piece);
        }
      } else {
        return false;
      }
    }
  }

  return !!bishopSquareColor;
};

export const isDrawPosition = (board) =>
  isKingDrawPosition(board) || isKnightDrawPosition(board) || isBishopDrawPosition(board);
