import React, {Component} from 'react';
import propTypes from 'prop-types';
import dom from 'react-dom-factories';

import board from './board';
import modal from './modal';
import promotionModal from './promotion-modal';
import gameHistory from './game-history';
import gameSideIndicator from './game-side-indicator';
import {symbolToString} from '../utils/symbol';

class Game extends Component {
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

    return dom.div({className: 'game'},
      gameSideIndicator({playSide: gameController.playSide, currentGameSide: game.currentSide}),
      dom.div({className: 'main-content'},
        board(this.props),
        dom.div({className: 'panel'},
          dom.button({onClick: this.new}, 'new game'),
          dom.button({onClick: this.reverse}, 'reverse'),
          !game.history.isEmpty && gameHistory({
            gameController: this.props.gameController,
            history: game.history
          }),
          dom.div({className: 'three-fold-row'},
            dom.button({onClick: this.claim3FoldRepetition},
              '3 fold repetition'),
            dom.div(null,
              dom.span(null, 'next move'),
              dom.input({
                type: 'checkbox',
                checked: gameController.isNextMove3FoldCheck,
                onChange: this.toggleNextMove3FoldCheck
              })
            )
          ),
          dom.button({onClick: this.claim50MoveRule}, '50 move rule'),
          game.winnerSide && dom.div({className: 'result winner'},
            `winner: ${symbolToString(game.winnerSide)}`
          ),
          game.isDraw && dom.div({className: 'result draw'}, 'draw')
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
        dom.div(null, 'The rule does not apply.')
      )
    );
  }
}

Game.propTypes = {
  gameController: propTypes.object.isRequired
};

export default React.createFactory(Game);
