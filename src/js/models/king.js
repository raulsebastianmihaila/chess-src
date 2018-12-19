import {pieceTypes, sides} from '../enums/game';
import {isValidSquareIndex} from './board-utils';

export default function King(x, y, side, board) {
  const king = {
    x,
    y,
    side,
    type: pieceTypes.king,
    value: 1000,
    moved: false,
    isChecked: false
  };

  king.canMove = (x, y) => isValidSquareIndex(x) && isValidSquareIndex(y)
    && (canMoveNormal(x, y) || canCastle(x, y));

  const canMoveNormal = (x, y) => !board.isSideOccupied(side, x, y)
    && Math.abs(x - king.x) <= 1 && Math.abs(y - king.y) <= 1;

  const canCastle = (x, y) => {
    if (king.y
      || (side === sides.black && (x !== 1 && x !== 5 || king.x !== 3))
      || (side === sides.white && (x !== 2 && x !== 6 || king.x !== 4))) {
      return false;
    }

    if (king.moved) {
      return false;
    }

    if (y !== king.y) {
      return false;
    }

    if (!board.isUnmovedRook(side, x < king.x ? 0 : 7, 0)) {
      return false;
    }

    const step = x < king.x ? -1 : 1;

    if (board.isSquareAttacked(side, king.x, king.y)
      || isSquarePreventingCastling(king.x + step * 1, 0)
      || isSquarePreventingCastling(king.x + step * 2, 0)) {
      return false;
    }

    return true;
  };

  const isSquarePreventingCastling = (x, y) =>
    board.isOccupied(side, x, y) || board.isSquareAttacked(side, x, y);

  king.canAttack = (x, y) => isValidSquareIndex(x) && isValidSquareIndex(y) && canMoveNormal(x, y);

  king.getPossibleMoves = () => {
    const moves = [];

    const addMove = (x, y) => {
      if (king.canMove(x, y)) {
        moves.push({x, y});
      }
    };

    addMove(king.x - 1, king.y);
    addMove(king.x - 1, king.y + 1);
    addMove(king.x, king.y + 1);
    addMove(king.x + 1, king.y + 1);
    addMove(king.x + 1, king.y);
    addMove(king.x + 1, king.y - 1);
    addMove(king.x, king.y - 1);
    addMove(king.x - 1, king.y - 1);
    addMove(king.x - 2, king.y);
    addMove(king.x + 2, king.y);

    return moves;
  };

  return king;
}
