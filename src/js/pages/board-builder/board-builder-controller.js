import {controller} from 'crizmas-mvc';

import BoardBuilder from '../../controllers/board-builder';

export default controller(function BoardBuilderController() {
  const ctrl = {
    boardBuilderController: new BoardBuilder()
  };

  return ctrl;
});
