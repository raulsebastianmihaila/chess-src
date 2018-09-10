import React, {Component} from 'react';
import propTypes from 'prop-types';
import classes from 'classnames';
import dom from 'react-dom-factories';

import {safe} from '../utils/dom';
import {sides} from '../enums/game';

class GameHistory extends Component {
  constructor() {
    super();

    this.gameHistoryElement = null;
    this.oldMoveElement = null;

    this.scrollToCurrentMove = () => {
      const currentMoveSpan = this.gameHistoryElement.querySelector('.current');

      if (currentMoveSpan && currentMoveSpan !== this.oldMoveElement) {
        currentMoveSpan.scrollIntoView();

        this.oldMoveElement = currentMoveSpan;
      }
    };

    this.goFirst = () => {
      this.props.gameController.goFirst();
    };

    this.goPrevious = () => {
      this.props.gameController.goPrevious();
    };

    this.goNext = () => {
      this.props.gameController.goNext();
    };

    this.goLast = () => {
      this.props.gameController.goLast();
    };

    this.goTo = (index) => {
      this.props.gameController.goTo(index);
    };
  }

  componentDidMount() {
    this.scrollToCurrentMove();
  }

  componentDidUpdate() {
    this.scrollToCurrentMove();
  }

  render() {
    const {history} = this.props;
    const {[sides.white]: whiteMoves, [sides.black]: blackMoves} = history.shortMoves;
    const startIndex = whiteMoves[0] ? 0 : -1;

    return dom.div({
        className: 'game-history',
        ref: (gameHistoryElement) => this.gameHistoryElement = gameHistoryElement
      },
      dom.div({className: 'moves'},
        whiteMoves.map((move, i) => dom.div({className: 'move', key: i},
          dom.div(null, i + 1),
          dom.div(null,
            move && dom.span({
                onClick: this.goTo.bind(this, i * 2 + 1 + startIndex),
                className: classes({current: history.currentIndex === i * 2 + 1 + startIndex})
              },
              move
            )
          ),
          dom.div(null,
            blackMoves[i] && dom.span({
                onClick: this.goTo.bind(this, i * 2 + 2 + startIndex),
                className: classes({current: history.currentIndex === i * 2 + 2 + startIndex})
              },
              blackMoves[i]
            )
          )
        ))
      ),
      dom.div({className: 'buttons'},
        dom.button({
            disabled: history.first === history.current,
            onClick: this.goFirst
          },
          dom.span(safe('&laquo;'))
        ),
        dom.button({
            disabled: history.first === history.current,
            onClick: this.goPrevious
          },
          dom.span(safe('&lsaquo;'))
        ),
        dom.button({
            disabled: history.last === history.current,
            onClick: this.goNext
          },
          dom.span(safe('&rsaquo;'))
        ),
        dom.button({
            disabled: history.last === history.current,
            onClick: this.goLast
          },
          dom.span(safe('&raquo;'))
        )
      )
    );
  }
}

GameHistory.propTypes = {
  gameController: propTypes.object.isRequired,
  history: propTypes.object.isRequired
};

export default React.createFactory(GameHistory);
