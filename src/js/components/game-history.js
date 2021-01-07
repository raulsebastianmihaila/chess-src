import React from 'react';
import propTypes from 'prop-types';
import classes from 'classnames';

import {safe} from '../utils/dom';
import {sides} from '../enums/game';
import {createFactory, renderClip, div, span, button} from '../dom';

class GameHistory extends React.Component {
  constructor() {
    super();

    this.oldHistoryMoveIndex = null;

    this.scrollToCurrentMove = () => {
      const {currentMoveIndex} = this.props.history;

      if (currentMoveIndex !== this.oldHistoryMoveIndex) {
        this.oldHistoryMoveIndex = currentMoveIndex;

        if (this.props.history.movesCount) {
          this.props.gameController.historyRenderClipController.scrollIntoView(
            // if null, pass 0
            currentMoveIndex || 0,
            {fit: true});
        }
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
    const startIndex = history.isBlackStarting ? -1 : 0;

    return div(
      {className: 'game-history'},
      div(
        {className: 'moves', style: {height: history.movesCount * 17}},
        renderClip(
          {
            controller: this.props.gameController.historyRenderClipController,
            renderItem: ({index}) => {
              const whiteMove = whiteMoves[index];
              const blackMove = blackMoves[index];
              const whiteHistoryIndex = index * 2 + 1 + startIndex;
              const blackHistoryIndex = index * 2 + 2 + startIndex;

              return div({className: 'move', key: index},
                div(null, index + 1),
                div(null,
                  whiteMove && span({
                      onClick: this.goTo.bind(null, whiteHistoryIndex),
                      className: classes({current: history.currentIndex === whiteHistoryIndex})
                    },
                    whiteMove
                  )
                ),
                div(null,
                  blackMove && span({
                      onClick: this.goTo.bind(null, blackHistoryIndex),
                      className: classes({current: history.currentIndex === blackHistoryIndex})
                    },
                    blackMove
                  )
                )
              );
            }
          })
      ),
      div({className: 'buttons'},
        button({
            disabled: history.first === history.current,
            onClick: this.goFirst
          },
          span(safe('&laquo;'))
        ),
        button({
            disabled: history.first === history.current,
            onClick: this.goPrevious
          },
          span(safe('&lsaquo;'))
        ),
        button({
            disabled: history.last === history.current,
            onClick: this.goNext
          },
          span(safe('&rsaquo;'))
        ),
        button({
            disabled: history.last === history.current,
            onClick: this.goLast
          },
          span(safe('&raquo;'))
        )
      )
    );
  }
}

GameHistory.propTypes = {
  gameController: propTypes.object.isRequired,
  history: propTypes.object.isRequired
};

export default createFactory(GameHistory);
