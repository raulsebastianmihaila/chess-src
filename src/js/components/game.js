import React from 'react';
import propTypes from 'prop-types';

import board from './board';
import modal from './modal';
import promotionModal from './promotion-modal';
import gameHistory from './game-history';
import gameSideIndicator from './game-side-indicator';
import {symbolToString} from '../utils/symbol';
import {createFactory, div, span, button, input} from '../dom';

class Game extends React.Component {
  constructor() {
    super();

    this.new = () => {
      this.props.gameController.startNewGame();
    };

    this.reverse = () => {
      this.props.gameController.reverse();
    };

    this.promote = (pieceType) => {
      this.props.gameController.promote(pieceType);
    };

    this.closeRuleModal = () => {
      this.props.gameController.toggleOpenRuleModal();
    };

    this.claim50MoveRule = () => {
      this.props.gameController.claim50MoveRule();
    };

    this.claim3FoldRepetition = () => {
      this.props.gameController.claim3FoldRepetition();
    };

    this.toggleNextMove3FoldCheck = () => {
      this.props.gameController.toggleNextMove3FoldCheck();
    };
  }

  render() {
    const {gameController, gameController: {game}} = this.props;

    return div({className: 'game'},
      gameSideIndicator({playSide: gameController.playSide, currentGameSide: game.currentSide}),
      div({className: 'main-content'},
        board(this.props),
        div({className: 'panel'},
          button({onClick: this.new}, 'new game'),
          button({onClick: this.reverse}, 'reverse'),
          !game.history.isEmpty && gameHistory({
            gameController: this.props.gameController,
            history: game.history
          }),
          div({className: 'three-fold-row'},
            button({onClick: this.claim3FoldRepetition},
              '3 fold repetition'),
            div(null,
              span(null, 'next move'),
              input({
                type: 'checkbox',
                checked: gameController.isNextMove3FoldCheck,
                onChange: this.toggleNextMove3FoldCheck
              })
            )
          ),
          button({onClick: this.claim50MoveRule}, '50 move rule'),
          game.winnerSide && div({className: 'result winner'},
            `winner: ${symbolToString(game.winnerSide)}`
          ),
          game.isDraw && div({className: 'result draw'}, 'draw')
        )
      ),
      promotionModal({
        side: game.currentSide,
        isOpen: game.isPromoting,
        onPromote: this.promote
      }),
      modal({
          isOpen: gameController.isRuleModalOpen,
          size: 'small-medium',
          className: 'rule-modal',
          actions: [
            {
              label: 'close',
              handler: this.closeRuleModal
            }
          ]
        },
        div(null, 'The rule does not apply.')
      )
    );
  }
}

Game.propTypes = {
  gameController: propTypes.object.isRequired
};

export default createFactory(Game);
