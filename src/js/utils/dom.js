export const addEventListener = (element, event, selector, func) => {
  const listener = (e) => {
    if (e.target.matches(selector)) {
      func(e);
    }
  };

  element.addEventListener(event, listener);

  return () => {
    element.removeEventListener(event, listener);
  };
};

export const safe = (string) => ({dangerouslySetInnerHTML: {__html: string}});
