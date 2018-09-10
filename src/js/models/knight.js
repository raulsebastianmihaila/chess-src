import {pieceTypes} from '../enums/game';
import {isValidSquareIndex} from './board-utils';

export default function Knight(x, y, side, board) {
  const knight = {
    x,
    y,
    side,
    type: pieceTypes.knight,
    value: 3,
    moved: false
  };

  knight.canMove = (x, y) => {
    if (!isValidSquareIndex(x) || !isValidSquareIndex(y)) {
      return false;
    }

    const xDif = Math.abs(knight.x - x);
    const yDif = Math.abs(knight.y - y);

    return !board.isSideOccupied(side, x, y) && (xDif && yDif && xDif + yDif === 3);
  };

  knight.canAttack = (x, y) => knight.canMove(x, y);

  knight.getPossibleMoves = () => {
    const moves = [];

    const addMove = (x, y) => {
      if (knight.canMove(x, y)) {
        moves.push({x, y});
      }
    };

    addMove(knight.x - 2, knight.y + 1);
    addMove(knight.x - 1, knight.y + 2);
    addMove(knight.x + 1, knight.y + 2);
    addMove(knight.x + 2, knight.y + 1);
    addMove(knight.x + 2, knight.y - 1);
    addMove(knight.x + 1, knight.y - 2);
    addMove(knight.x - 1, knight.y - 2);
    addMove(knight.x - 2, knight.y - 1);

    return moves;
  };

  return knight;
}
