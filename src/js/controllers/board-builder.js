import Mvc from 'crizmas-mvc';

import Board from '../models/board';
import Pawn from '../models/pawn';
import Bishop from '../models/bishop';
import Knight from '../models/knight';
import Rook from '../models/rook';
import Queen from '../models/queen';
import King from '../models/king';
import BoardBuilder from '../models/board-builder';
import {sides, pieceTypes} from '../enums/game';
import GameController from './game';
import {getGameSideSquare} from './board-utils';

const tabs = {
  builder: Symbol('builder'),
  game: Symbol('game')
};

const piecesBag = {
  [sides.white]: [
    new Pawn(0, 0, sides.white),
    new Knight(0, 0, sides.white),
    new Bishop(0, 0, sides.white),
    new Rook(0, 0, sides.white),
    new Queen(0, 0, sides.white),
    new King(0, 0, sides.white)
  ],
  [sides.black]: [
    new Pawn(0, 0, sides.black),
    new Knight(0, 0, sides.black),
    new Bishop(0, 0, sides.black),
    new Rook(0, 0, sides.black),
    new Queen(0, 0, sides.black),
    new King(0, 0, sides.black)
  ]
};

export default Mvc.controller(function BoardBuilderController() {
  const ctrl = {
    boardBuilder: new BoardBuilder(),
    tabs,
    selectedTab: tabs.builder,
    piecesBag,
    selectedPiece: null,
    selectedBagPiece: null,
    gameController: new GameController(),

    get playSide() {
      return ctrl.boardBuilder.board.currentSide;
    }
  };

  ctrl.makeNewBoard = () => {
    ctrl.boardBuilder.reset();

    ctrl.selectedBagPiece = null;
    ctrl.selectedPiece = null;
  };

  ctrl.onTabChange = (tab) => {
    ctrl.selectedTab = tab;

    if (tab === tabs.builder) {
      ctrl.boardBuilder.makeBoardFromGame(ctrl.gameController.game);

      ctrl.selectedBagPiece = null;
      ctrl.selectedPiece = null;
    }
  };

  ctrl.selectSquare = (square) => {
    const gameSideSquare = getGameSideSquare(square, ctrl.playSide, ctrl.playSide);
    const piece = ctrl.boardBuilder.board.getPiece(ctrl.playSide,
      gameSideSquare.x, gameSideSquare.y);

    if (piece) {
      ctrl.selectedPiece = piece;
      ctrl.selectedBagPiece = null;
    } else {
      if (ctrl.selectedBagPiece) {
        ctrl.addPiece(ctrl.selectedBagPiece, gameSideSquare.x, gameSideSquare.y);
      } else if (ctrl.selectedPiece) {
        ctrl.boardBuilder.movePiece(ctrl.playSide, ctrl.selectedPiece,
          gameSideSquare.x, gameSideSquare.y);
      }
    }
  };

  ctrl.addPiece = (piece, x, y) => {
    ctrl.boardBuilder.addPiece(ctrl.playSide, piece, x, y);

    if (piece.type === pieceTypes.king) {
      ctrl.selectedBagPiece = null;
    }
  };

  ctrl.deletePiece = () => {
    ctrl.boardBuilder.deletePiece(ctrl.selectedPiece);

    ctrl.selectedPiece = null;
  };

  ctrl.unselectPiece = () => {
    ctrl.selectedPiece = null;
  };

  ctrl.selectBagPiece = (piece) => {
    ctrl.selectedBagPiece = piece;
    ctrl.selectedPiece = null;
  };

  ctrl.playPosition = () => {
    if (!ctrl.boardBuilder.isBoardPlayable()) {
      throw new Error('The board is not in a playable state');
    }

    ctrl.gameController.startNewGame(
      new Board({board: ctrl.boardBuilder.board, isClean: true}),
      ctrl.playSide);

    ctrl.selectedTab = tabs.game;
  };

  ctrl.reverse = () => {
    ctrl.boardBuilder.reverse();
  };

  ctrl.gameController.startNewGame();

  return ctrl;
});
