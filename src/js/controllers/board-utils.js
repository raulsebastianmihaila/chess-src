import {getReverseSquareIndex} from '../models/board-utils';

export const getGameSideSquare = ({x, y}, playSide, gameCurrentSide) =>
  playSide === gameCurrentSide
    ? {x, y: getReverseSquareIndex(y)}
    : {x: getReverseSquareIndex(x), y};
