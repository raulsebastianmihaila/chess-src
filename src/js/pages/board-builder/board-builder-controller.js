import Mvc from 'crizmas-mvc';

import BoardBuilder from '../../controllers/board-builder';

export default Mvc.controller(function BoardBuilderController() {
  const ctrl = {
    boardBuilderController: new BoardBuilder()
  };

  return ctrl;
});
