import Mvc from 'crizmas-mvc';

export default Mvc.controller(function RootController() {
  return {
    onEnter: ({router}) => {
      const path = router.url.searchParams.get('path');

      if (path) {
        router.transitionTo(`${path}${router.url.hash}`);
      }
    }
  };
});
