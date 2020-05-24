import {RenderClip} from 'crizmas-components';
import React, {Component} from 'react';
import propTypes from 'prop-types';
import classes from 'classnames';
import dom from 'react-dom-factories';

import {safe} from '../utils/dom';
import {sides} from '../enums/game';

class GameHistory extends Component {
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

    return dom.div(
      {className: 'game-history'},
      dom.div(
        {className: 'moves', style: {height: history.movesCount * 17}},
        React.createElement(
          RenderClip,
          {
            controller: this.props.gameController.historyRenderClipController,
            renderItem: ({index}) => {
              const whiteMove = whiteMoves[index];
              const blackMove = blackMoves[index];
              const whiteHistoryIndex = index * 2 + 1 + startIndex;
              const blackHistoryIndex = index * 2 + 2 + startIndex;

              return dom.div({className: 'move', key: index},
                dom.div(null, index + 1),
                dom.div(null,
                  whiteMove && dom.span({
                      onClick: this.goTo.bind(null, whiteHistoryIndex),
                      className: classes({current: history.currentIndex === whiteHistoryIndex})
                    },
                    whiteMove
                  )
                ),
                dom.div(null,
                  blackMove && dom.span({
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
