import {pieceTypes} from '../enums/game';
import Board from './board';
import {areEqual} from './board-utils';
import History from './history';

const is50MoveRuleApplied = (history) => {
  // 101 because a move means both players moved and the first board has no move
  if (history.boards.length < 101) {
    return false;
  }

  return history.boards.slice(-100).every((board) =>
    !board.lastMove.removedPiece && board.lastMove.mainPiece.type !== pieceTypes.pawn);
};

const is3FoldRepetition = (history) => {
  if (history.boards.length < 3) {
    return false;
  }

  let repetitions = 0;

  return history.boards.slice(0, -1).some((board) => {
    if (areEqual(board, history.last)) {
      repetitions += 1;

      return repetitions === 2;
    }
  });
};

export default function Game(board = new Board()) {
  const history = new History(board);

  const game = {
    board,
    history,

    get isPlayable() {
      return !history.isRewinding && !game.isOver;
    },

    get currentSide() {
      return board.currentSide;
    },

    get isOver() {
      return board.isOver;
    },

    get isPromoting() {
      return board.isPromoting;
    },

    get winnerSide() {
      return board.winnerSide;
    },

    get isCheckMate() {
      return board.isCheckMate;
    },

    get isDraw() {
      return board.isDraw;
    },

    get isStaleMate() {
      return board.isStaleMate;
    }
  };

  game.move = (fromX, fromY, toX, toY) => {
    if (!game.isPlayable) {
      throw new Error('The game is not playable.');
    }

    const piece = board.getPiece(board.currentSide, fromX, fromY);

    if (!board.move(piece, toX, toY)) {
      return;
    }

    if (board.lastMove.isComplete) {
      history.add(board);
    }
  };

  game.promote = (pieceType) => {
    if (!game.isPlayable) {
      throw new Error('The game is not playable.');
    }

    board.promote(pieceType);
    history.add(board);
  };

  game.check50MoveRule = () => {
    if (!game.isPlayable) {
      throw new Error('The game is not playable.');
    }

    if (is50MoveRuleApplied(history)) {
      board.draw();
    }
  };

  game.check3FoldRepetition = () => {
    if (!game.isPlayable) {
      throw new Error('The game is not playable.');
    }

    if (is3FoldRepetition(history)) {
      board.draw();
    }
  };

  return game;
}
