import React from 'react';
import propTypes from 'prop-types';

import gameEl from '../../components/game';
import {link, div} from '../../dom';

export default class PlayPage extends React.Component {
  render() {
    const {gameController} = this.props.controller;

    return div(null,
      gameEl({gameController}),
      div({className: 'footer'},
        link({to: 'board-builder'}, 'custom')));
  }
}

PlayPage.propTypes = {
  controller: propTypes.shape({
    gameController: propTypes.object.isRequired
  }).isRequired
};
