import {controller} from 'crizmas-mvc';

export default controller(function RootController() {
  return {
    onEnter: ({router}) => {
      const path = router.url.searchParams.get('path');

      if (path) {
        router.transitionTo(`${path}${router.url.hash}`);
      }
    }
  };
});
