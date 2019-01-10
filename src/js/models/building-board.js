import boardMixin, {createBoard, createBoardMixState} from './board-mixin';
import {getRealSquare, getSideSquare, getOppositeSide} from './board-utils';
import {clonePiece} from './piece-utils';
import {pieceTypes, sides} from '../enums/game';

export default function BuildingBoard({board: fromBoard, isClean}) {
  const boardMixState = createBoardMixState();
  const board = createBoard();
  const boardMix = boardMixin({
    context: board,
    state: boardMixState,
    mixMethods: [
      'init',
      'movePiece',
      'setSideBoardResolution'
    ],
    contextMethods: [
      'isSquareAttacked',
      'getPiece',
      'isOccupied',
      'isSideOccupied',
      'isUnmovedRook',
      'pieces',
      'findPiece',
      'somePiece',
      'everyPiece'
    ]
  });

  board.hasSideKing = (side) => !!boardMixState.kings[side];

  board.getNonPlayableBoardReason = () => {
    if (board.isCheckMate) { return 'checkmate'; }

    if (board.isStaleMate) { return 'stalemate'; }

    if (board.isDraw) { return 'draw'; }

    const whiteKing = boardMixState.kings[sides.white];
    const blackKing = boardMixState.kings[sides.black];

    if (!whiteKing || !blackKing) { return 'king is missing'; }

    const oppositeSide = getOppositeSide(board.currentSide);

    // if it's the current side's turn it means that the opposite side can not be in check.
    // this also implies that not both the sides are in check.
    if (boardMixState.kings[oppositeSide].isChecked) { return 'the other side is already checked'; }

    if (board.every((piece) => piece.type === pieceTypes.king)) {
      return 'pieces other than kings needed';
    }
  };

  board.isBoardPlayable = () => {
    return !board.getNonPlayableBoardReason();
  };

  board.addPiece = (playSide, piece, x, y) => {
    const square = getRealSquare(playSide, x, y);

    if (isInvalidNewKing(piece, square)) { return; }

    const sideSquare = getSideSquare(piece.side, square.x, square.y);

    if (isInvalidPawn(piece, sideSquare)) { return; }

    piece = clonePiece(piece, board);
    piece.x = sideSquare.x;
    piece.y = sideSquare.y;
    board[square.x][square.y] = piece;

    if (piece.type === pieceTypes.king) {
      boardMixState.kings[piece.side] = piece;
    }

    setBoardResolution();
  };

  const isInvalidNewKing = (piece, square) => {
    if (piece.type === pieceTypes.king) {
      if (boardMixState.kings[piece.side]) { return true; }

      return isInvalidKing(piece, square);
    }

    return false;
  };

  const isInvalidKing = (piece, square) => {
    if (piece.type === pieceTypes.king) {
      const oppositeSide = getOppositeSide(piece.side);
      const oppositeKing = boardMixState.kings[oppositeSide];

      if (oppositeKing) {
        const oppositeKingSquare = getRealSquare(oppositeSide, oppositeKing.x, oppositeKing.y);

        return Math.abs(oppositeKingSquare.x - square.x) < 2
          && Math.abs(oppositeKingSquare.y - square.y) < 2;
      }
    }

    return false;
  };

  const isInvalidPawn = (piece, sideSquare) => {
    return piece.type === pieceTypes.pawn && (sideSquare.y === 0 || sideSquare.y === 7);
  };

  const setBoardResolution = () => {
    if (!boardMixState.kings[sides.white] || !boardMixState.kings[sides.black]) { return; }

    board.isOver = false;
    board.isCheckMate = false;
    board.isStaleMate = false;
    board.isDraw = false;
    board.winnerSide = null;

    boardMix.setSideBoardResolution(sides.white);
    boardMix.setSideBoardResolution(sides.black);
  };

  board.movePiece = (playSide, piece, x, y) => {
    const currentSquare = getRealSquare(piece.side, piece.x, piece.y);
    const toSquare = getRealSquare(playSide, x, y);

    if (isInvalidKing(piece, toSquare)) { return; }

    const toSideSquare = getSideSquare(piece.side, toSquare.x, toSquare.y);

    if (isInvalidPawn(piece, toSideSquare)) { return; }

    board[toSquare.x][toSquare.y] = piece;
    piece.x = toSideSquare.x;
    piece.y = toSideSquare.y;
    board[currentSquare.x][currentSquare.y] = null;

    setBoardResolution();
  };

  board.deletePiece = (piece) => {
    const square = getRealSquare(piece.side, piece.x, piece.y);

    board[square.x][square.y] = null;

    if (piece.type === pieceTypes.king) {
      boardMixState.kings[piece.side] = null;
    }

    setBoardResolution();
  };

  board.reverse = () => {
    board.currentSide = getOppositeSide(board.currentSide);
  };

  boardMix.init(fromBoard, isClean);

  return board;
}
