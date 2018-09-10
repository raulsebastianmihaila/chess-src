import React, {Component} from 'react';
import propTypes from 'prop-types';
import dom from 'react-dom-factories';
import {Link} from 'crizmas-router';

import gameEl from '../../components/game';

export default class PlayPage extends Component {
  render() {
    const {gameController} = this.props.controller;

    return dom.div(null,
      gameEl({gameController}),
      dom.div({className: 'footer'},
        React.createElement(Link, {to: 'board-builder'}, 'custom')));
  }
}

PlayPage.propTypes = {
  controller: propTypes.shape({
    gameController: propTypes.object.isRequired
  }).isRequired
};
