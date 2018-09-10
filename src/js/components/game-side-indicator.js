import React, {Component} from 'react';
import propTypes from 'prop-types';
import dom from 'react-dom-factories';
import classes from 'classnames';

import {getOppositeSide} from '../models/board-utils';
import {symbolToString} from '../utils/symbol';
import {safe} from '../utils/dom';

class GameSideIndicator extends Component {
  render() {
    const {playSide, currentGameSide} = this.props;

    return dom.div({className: 'game-side-indicator'},
      dom.span({className: classes(
        'play-side side-top',
        `play-side-${symbolToString(getOppositeSide(playSide))}`)}),
      dom.span({className: `play-side side-bottom play-side-${symbolToString(playSide)}`}),
      !!currentGameSide && dom.span({
          className: classes('current-game-side', {
            'side-top': playSide !== currentGameSide,
            'side-bottom': playSide === currentGameSide
          })
        },
        dom.span(safe('\u27a1'))
      )
    );
  }
}

GameSideIndicator.propTypes = {
  playSide: propTypes.symbol.isRequired,
  currentGameSide: propTypes.symbol
};

export default React.createFactory(GameSideIndicator);
