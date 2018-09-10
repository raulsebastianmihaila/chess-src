import {pieceTypes} from '../enums/game';
import {isValidSquareIndex, getSideSquare} from './board-utils';

export default function Pawn(x, y, side, board) {
  const pawn = {
    x,
    y,
    side,
    type: pieceTypes.pawn,
    value: 1,
    moved: false
  };

  pawn.canMove = (x, y, {previousMove}) => {
    if (!isValidSquareIndex(x) || !isValidSquareIndex(y)) {
      return false;
    }

    if (board.isSideOccupied(side, x, y)) {
      return false;
    }

    // moving straight
    if (x === pawn.x) {
      // moving 1 square
      if (y === pawn.y + 1) {
        return canMoveStraight();
      }

      if (y === pawn.y + 2) {
        return canJumpStraight();
      }
    }

    return canDiagMove(x, y, previousMove);
  };

  const canMoveStraight = () => !board.isOccupied(side, pawn.x, pawn.y + 1);

  const canJumpStraight = () =>
    pawn.y === 1 && canMoveStraight() && !board.isOccupied(side, pawn.x, 3);

  const canDiagMove = (x, y, previousMove) => {
    if (y !== pawn.y + 1 || Math.abs(x - pawn.x) !== 1) {
      return false;
    }

    if (board.isSideOccupied(side, x, y)) {
      return false;
    }

    if (board.isOccupied(side, x, y)) {
      return true;
    }

    // there are cases where the previous move is irrelevant and it's not passed
    if (!previousMove) {
      return false;
    }

    const previousMoveTo = getSideSquare(side, previousMove.mainTo.x, previousMove.mainTo.y);

    return previousMove.isJump && previousMoveTo.x === x && previousMoveTo.y === y - 1;
  };

  pawn.canAttack = (x, y) =>
    isValidSquareIndex(x) && isValidSquareIndex(y) && canDiagMove(x, y, false);

  pawn.getPossibleMoves = ({previousMove}) => {
    const moves = [];

    if (canMoveStraight()) {
      moves.push({x: pawn.x, y: pawn.y + 1});

      if (canJumpStraight()) {
        moves.push({x: pawn.x, y: 3});
      }
    }

    if (canMoveLeftDiag(previousMove)) {
      moves.push({x: pawn.x - 1, y: pawn.y + 1});
    }

    if (canMoveRightDiag(previousMove)) {
      moves.push({x: pawn.x + 1, y: pawn.y + 1});
    }

    return moves;
  };

  const canMoveLeftDiag = (previousMove) =>
    pawn.x > 0 && canDiagMove(pawn.x - 1, pawn.y + 1, previousMove);

  const canMoveRightDiag = (previousMove) =>
    pawn.x < 7 && canDiagMove(pawn.x + 1, pawn.y + 1, previousMove);

  return pawn;
}
