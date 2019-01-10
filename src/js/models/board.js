import boardMixin, {createBoard, createBoardMixState} from './board-mixin';
import {pieceTypes} from '../enums/game';
import {makePiece} from './piece-utils';
import {getOppositeSide, getMoveNotation} from './board-utils';

export default function Board({board: fromBoard, isClean} = {}) {
  const boardMixState = createBoardMixState();
  let promotingPawn = null;

  const board = createBoard();

  board.isPromoting = false;

  const boardMix = boardMixin({
    context: board,
    state: boardMixState,
    mixMethods: [
      'init',
      'isSafeMove',
      'internalMove',
      'setSideBoardResolution',
      'putPiece'
    ],
    contextMethods: [
      'isSquareAttacked',
      'getPiece',
      'isOccupied',
      'isSideOccupied',
      'isUnmovedRook',
      'draw',
      'pieces',
      'findPiece',
      'somePiece',
      'everyPiece'
    ]
  });

  board.move = (piece, x, y) => {
    // returns true if the move was successful

    if (board.isOver) {
      throw new Error('The game is over.');
    }

    if (board.isPromoting) {
      throw new Error('Cannot move while promoting.');
    }

    if (boardMixState.currentMove) {
      throw new Error('Move already in progress.');
    }

    if (piece.side !== board.currentSide) {
      throw new Error('Wrong side moving.');
    }

    if (!piece.canMove(x, y, {previousMove: board.lastMove}) || !boardMix.isSafeMove(piece, x, y)) {
      return false;
    }

    boardMix.internalMove(piece, x, y);
    markLastMove();

    if (board.isPromoting) {
      promotingPawn = piece;
    } else {
      updateBoardAfterMove();
    }

    return true;
  };

  const markLastMove = () => {
    if (!boardMixState.currentMove) {
      throw new Error('There\'s no current move.');
    }

    const piece = boardMixState.currentMove.mainPiece;

    piece.moved = true;

    if (boardMixState.currentMove.castlingRook) {
      boardMixState.currentMove.castlingRook.moved = true;
    }

    board.isPromoting = piece.type === pieceTypes.pawn && piece.y === 7;
    board.lastMove = boardMixState.currentMove;
    boardMixState.currentMove = null;
  };

  const updateBoardAfterMove = () => {
    setBoardResolution();
    updateLastMoveAfterResolution();
  };

  const setBoardResolution = () => {
    boardMixState.kings[board.currentSide].isChecked = false;

    boardMix.setSideBoardResolution(board.currentSide);

    if (!board.isOver) {
      board.currentSide = getOppositeSide(board.currentSide);
    }
  };

  const updateLastMoveAfterResolution = () => {
    // it's possible that the board's current side didn't change
    const oppositeSide = getOppositeSide(board.lastMove.mainPiece.side);

    board.lastMove.isCheck = boardMixState.kings[oppositeSide].isChecked;
    board.lastMove.isCheckMate = board.isCheckMate;
    board.lastMove.notation = getMoveNotation(board.lastMove);
    board.lastMove.isComplete = true;
  };

  board.promote = (pieceType) => {
    if (!board.isPromoting) {
      throw new Error('There\'s no current promotion');
    }

    const piece = makePiece(pieceType, promotingPawn.x, promotingPawn.y, promotingPawn.side, board);

    piece.moved = true;

    boardMix.putPiece(piece);

    board.isPromoting = false;
    promotingPawn = null;
    board.lastMove.promotionPiece = piece;

    updateBoardAfterMove();
  };

  boardMix.init(fromBoard, isClean);

  return board;
}
