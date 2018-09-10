import {sides} from '../enums/game';
import Board from './board';

export default function History(board) {
  let current = new Board({board});
  const boards = [current];
  let currentIndex = 0;
  const shortMoves = {
    [sides.white]: [],
    [sides.black]: []
  };

  const history = {
    shortMoves,
    boards,

    get isEmpty() {
      return !shortMoves[sides.white].length;
    },

    get current() {
      return current;
    },

    get currentIndex() {
      return currentIndex;
    },

    get first() {
      return boards[0];
    },

    get last() {
      return boards[boards.length - 1];
    },

    get isRewinding() {
      return current !== history.last;
    }
  };

  const init = () => {
    // it's possible for the history to not start from the beginning of the game
    // if the game starts with an existing board configuration
    if (board.currentSide === sides.black) {
      shortMoves[sides.white].push(undefined);
    }
  };

  history.add = (board) => {
    if (history.isRewinding) {
      throw new Error('Cannot add while rewinding.');
    }

    currentIndex += 1;
    boards[currentIndex] = current = new Board({board});
    shortMoves[board.lastMove.mainPiece.side].push(board.lastMove.notation);
  };

  history.goPrevious = () => {
    currentIndex -= 1;

    if (currentIndex < 0) {
      throw new Error('History exceeded.');
    }

    current = boards[currentIndex];
  };

  history.goNext = () => {
    currentIndex += 1;

    if (currentIndex >= boards.length) {
      throw new Error('History exceeded.');
    }

    current = boards[currentIndex];
  };

  history.goFirst = () => {
    currentIndex = 0;
    current = boards[currentIndex];
  };

  history.goLast = () => {
    currentIndex = boards.length - 1;
    current = boards[currentIndex];
  };

  history.goTo = (index) => {
    if (index < 0 || index >= boards.length) {
      throw new Error('History exceeded.');
    }

    currentIndex = index;
    current = boards[currentIndex];
  };

  init();

  return history;
}
