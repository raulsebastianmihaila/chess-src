import {controller} from 'crizmas-mvc';
import GameController from '../../controllers/game';

export default controller(function PlayController() {
  const ctrl = {
    gameController: new GameController()
  };

  ctrl.gameController.startNewGame();

  return ctrl;
});
