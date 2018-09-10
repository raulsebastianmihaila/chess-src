import Mvc from 'crizmas-mvc';

import {Layout} from './pages/layout';
import router from './router';

new Mvc({
  domElement: document.querySelector('#app'),
  component: Layout,
  router
});
