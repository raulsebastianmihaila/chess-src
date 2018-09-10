import Router from 'crizmas-router';

import RootRouteController from './pages/root-controller';
import PlayPage from './pages/play/play-page';
import PlayRouteController from './pages/play/play-controller';
import BoardBuilderPage from './pages/board-builder/board-builder-page';
import BoardBuilderController from './pages/board-builder/board-builder-controller';
import NotFound from './pages/not-found';

export default new Router({
  basePath: process.env.basePath,
  routes: [
    {
      controller: RootRouteController,
      children: [
        {
          component: PlayPage,
          controller: PlayRouteController
        }
      ]
    },
    {
      path: 'board-builder',
      component: BoardBuilderPage,
      controller: BoardBuilderController
    },
    {
      path: '*',
      component: NotFound
    }
  ]
});
