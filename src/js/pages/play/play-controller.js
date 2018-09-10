import Mvc from 'crizmas-mvc';
import GameController from '../../controllers/game';

export default Mvc.controller(function PlayController() {
  const ctrl = {
    gameController: new GameController()
  };

  ctrl.gameController.startNewGame();

  return ctrl;
});
