import React from 'react';
import propTypes from 'prop-types';
import classes from 'classnames';

import {getOppositeSide} from '../models/board-utils';
import {symbolToString} from '../utils/symbol';
import {safe} from '../utils/dom';
import {createFactory, div, span} from '../dom';

class GameSideIndicator extends React.Component {
  render() {
    const {playSide, currentGameSide} = this.props;

    return div({className: 'game-side-indicator'},
      span({className: classes(
        'play-side side-top',
        `play-side-${symbolToString(getOppositeSide(playSide))}`)}),
      span({className: `play-side side-bottom play-side-${symbolToString(playSide)}`}),
      !!currentGameSide && span({
          className: classes('current-game-side', {
            'side-top': playSide !== currentGameSide,
            'side-bottom': playSide === currentGameSide
          })
        },
        span(safe('\u27a1'))
      )
    );
  }
}

GameSideIndicator.propTypes = {
  playSide: propTypes.symbol.isRequired,
  currentGameSide: propTypes.symbol
};

export default createFactory(GameSideIndicator);
