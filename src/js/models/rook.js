import {pieceTypes} from '../enums/game';
import {canLineMove, getLinePossibleMoves} from './piece-utils';

export default function Rook(x, y, side, board) {
  const rook = {
    x,
    y,
    side,
    type: pieceTypes.rook,
    value: 5,
    moved: false
  };

  rook.canMove = (x, y) => canLineMove(rook, x, y, board);

  rook.canAttack = (x, y) => rook.canMove(x, y);

  rook.getPossibleMoves = () => getLinePossibleMoves(rook, board);

  return rook;
}
