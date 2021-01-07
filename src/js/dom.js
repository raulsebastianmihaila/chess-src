import React from 'react';
import {RenderClip} from 'crizmas-components';
import {Link} from 'crizmas-router';

export const createFactory = (componentOrTag) =>
  (...args) => React.createElement(componentOrTag, ...args);
export const fragment = createFactory(React.Fragment);
export const renderClip = createFactory(RenderClip);
export const link = createFactory(Link);
export const div = createFactory('div');
export const span = createFactory('span');
export const button = createFactory('button');
export const input = createFactory('input');

