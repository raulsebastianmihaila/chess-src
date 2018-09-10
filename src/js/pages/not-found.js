import React from 'react';
import dom from 'react-dom-factories';
import {Link} from 'crizmas-router';

const NotFound = () => dom.div(
  {className: 'message'},
  'Are you lost? Play a ',
  React.createElement(Link, {to: '/'}, 'chess game'),
  '.');

export default NotFound;
