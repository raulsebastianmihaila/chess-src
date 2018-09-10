import {pieceTypes} from '../enums/game';
import {canLineMove, canDiagMove, getLinePossibleMoves,
  getDiagPossibleMoves} from './piece-utils';

export default function Queen(x, y, side, board) {
  const queen = {
    x,
    y,
    side,
    type: pieceTypes.queen,
    value: 7,
    moved: false
  };

  queen.canMove = (x, y) => canLineMove(queen, x, y, board) || canDiagMove(queen, x, y, board);

  queen.canAttack = (x, y) => queen.canMove(x, y);

  queen.getPossibleMoves = () => [
    ...getLinePossibleMoves(queen, board),
    ...getDiagPossibleMoves(queen, board)
  ];

  return queen;
}
