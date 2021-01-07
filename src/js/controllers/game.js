import {controller} from 'crizmas-mvc';
import {RenderClipController} from 'crizmas-components';

import Game from '../models/game';
import {getOppositeSide} from '../models/board-utils';
import {sides} from '../enums/game';
import {getGameSideSquare} from './board-utils';

export default controller(function GameController() {
  const ctrl = {
    game: null,
    playSide: sides.white,
    selectedPiece: null,
    isRuleModalOpen: false,
    isNextMove3FoldCheck: false,
    next3FoldCheckSide: null,
    historyRenderClipController: null
  };

  ctrl.startNewGame = (board, playSide = ctrl.playSide) => {
    ctrl.playSide = playSide;
    ctrl.game = new Game(board);
    ctrl.historyRenderClipController = new RenderClipController({
      itemsCount: 0,
      itemHeight: 17
    });
  };

  ctrl.reverse = () => {
    ctrl.playSide = getOppositeSide(ctrl.playSide);
  };

  ctrl.selectPiece = (square) => {
    square = getGameSideSquare(square, ctrl.playSide, ctrl.game.currentSide);
    ctrl.selectedPiece = ctrl.game.board.getPiece(ctrl.game.currentSide, square.x, square.y);
  };

  ctrl.dropPiece = (square) => {
    square = getGameSideSquare(square, ctrl.playSide, ctrl.game.currentSide);

    if (square.x !== ctrl.selectedPiece.x || square.y !== ctrl.selectedPiece.y) {
      ctrl.game.move(ctrl.selectedPiece.x, ctrl.selectedPiece.y, square.x, square.y);

      ctrl.selectedPiece = null;

      if (!ctrl.game.isPromoting) {
        ctrl.handleAfterMove();
      }
    }
  };

  ctrl.unselectPiece = () => {
    ctrl.selectedPiece = null;
  };

  ctrl.promote = (pieceType) => {
    ctrl.game.promote(pieceType);
    ctrl.handleAfterMove();
  };

  ctrl.handleAfterMove = () => {
    ctrl.checkNext3FoldClaim();
    ctrl.historyRenderClipController.setItemsCount(ctrl.game.history.movesCount);
  };

  ctrl.goFirst = () => {
    ctrl.game.history.goFirst();
  };

  ctrl.goPrevious = () => {
    ctrl.game.history.goPrevious();
  };

  ctrl.goNext = () => {
    ctrl.game.history.goNext();
  };

  ctrl.goLast = () => {
    ctrl.game.history.goLast();
  };

  ctrl.goTo = (index) => {
    ctrl.game.history.goTo(index);
  };

  ctrl.toggleOpenRuleModal = () => {
    ctrl.isRuleModalOpen = !ctrl.isRuleModalOpen;
  };

  ctrl.claim50MoveRule = () => {
    if (!ctrl.game.isPlayable) {
      return;
    }

    ctrl.game.check50MoveRule();

    if (!ctrl.game.isOver) {
      ctrl.toggleOpenRuleModal();
    }
  };

  ctrl.toggleNextMove3FoldCheck = () => {
    ctrl.isNextMove3FoldCheck = !ctrl.isNextMove3FoldCheck;
  };

  ctrl.claim3FoldRepetition = () => {
    if (!ctrl.game.isPlayable) {
      return;
    }

    if (ctrl.isNextMove3FoldCheck && !ctrl.next3FoldCheckSide) {
      ctrl.next3FoldCheckSide = ctrl.game.currentSide;

      return;
    }

    ctrl.isNextMove3FoldCheck = false;
    ctrl.next3FoldCheckSide = null;

    ctrl.game.check3FoldRepetition();

    if (!ctrl.game.isOver) {
      ctrl.toggleOpenRuleModal();
    }
  };

  ctrl.checkNext3FoldClaim = () => {
    if (!ctrl.next3FoldCheckSide) {
      return;
    }

    if (ctrl.game.isOver) {
      ctrl.isNextMove3FoldCheck = false;
      ctrl.next3FoldCheckSide = null;
    } else if (ctrl.game.currentSide !== ctrl.next3FoldCheckSide) {
      ctrl.claim3FoldRepetition();
    }
  };

  return ctrl;
});
