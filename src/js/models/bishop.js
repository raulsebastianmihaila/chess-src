import {pieceTypes} from '../enums/game';
import {canDiagMove, getDiagPossibleMoves} from './piece-utils';

export default function Bishop(x, y, side, board) {
  const bishop = {
    x,
    y,
    side,
    type: pieceTypes.bishop,
    value: 3,
    moved: false
  };

  bishop.canMove = (x, y) => canDiagMove(bishop, x, y, board);

  bishop.canAttack = (x, y) => bishop.canMove(x, y);

  bishop.getPossibleMoves = () => getDiagPossibleMoves(bishop, board);

  return bishop;
}
