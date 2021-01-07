import React from 'react';
import propTypes from 'prop-types';
import classes from 'classnames';

import pieceEl from './piece';
import tabsEl from './tabs';
import game from './game';
import gameSideIndicator from './game-side-indicator';
import piecesBagEl from './pieces-bag';
import {getMouseSquare, getViewBoard} from './board-utils';
import {addEventListener} from '../utils/dom';
import {createFactory, div, button} from '../dom';

class BoardBuilder extends React.Component {
  render() {
    const {boardBuilderController: {tabs, selectedTab, gameController, onTabChange}} = this.props;

    return tabsEl({
      selectedTab,
      onChange: onTabChange,
      tabs: [
        {
          id: tabs.builder,
          label: 'Build',
          renderContent: () => boardBuilderTab(this.props)
        },
        {
          id: tabs.game,
          label: 'Game',
          renderContent: () => game({gameController})
        }
      ]
    });
  }
}

BoardBuilder.propTypes = {
  boardBuilderController: propTypes.object.isRequired
};

export default createFactory(BoardBuilder);

class BoardBuilderTab extends React.Component {
  constructor() {
    super();

    this.boardElement = null;

    this.onSquareClick = (e) => {
      this.props.boardBuilderController.selectSquare(
        getMouseSquare({x: e.clientX, y: e.clientY}, this.boardElement));
    };

    this.onMouseLeave = () => {
      this.props.boardBuilderController.unselectPiece();
    };

    this.onKeyUp = (e) => {
      if (e.key === 'Delete' && this.props.boardBuilderController.selectedPiece) {
        this.props.boardBuilderController.deletePiece();
      }
    };
  }

  componentDidMount() {
    addEventListener(this.boardElement, 'mouseup', '.square,.piece', this.onSquareClick);
    this.boardElement.addEventListener('mouseleave', this.onMouseLeave);
    window.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.onKeyUp);
  }

  render() {
    const {boardBuilderController, boardBuilderController: {playSide, piecesBag,
      selectedPiece, selectedBagPiece, boardBuilder, boardBuilder: {board}}} = this.props;

    return div({className: 'game'},
      gameSideIndicator({playSide, currentGameSide: playSide}),
      div({className: 'main-content'},
        div({
            className: 'board builder-board',
            ref: (boardElement) => this.boardElement = boardElement
          },
          getViewBoard(board, playSide).map((column, i) => div({
              key: i,
              className: 'column'
            },
            column.map((piece, i) => div({
                key: i,
                className: classes('square', {'is-selected': piece && piece === selectedPiece})
              },
              piece && pieceEl({piece})
            ))
          ))
        ),
        div({className: 'panel'},
          piecesBagEl({
            piecesBag,
            selectedPiece: selectedBagPiece,
            onSelectPiece: boardBuilderController.selectBagPiece
          }),
          button({onClick: boardBuilderController.makeNewBoard}, 'new'),
          button({
            disabled: !boardBuilder.isBoardPlayable(),
            title: boardBuilder.getNonPlayableBoardReason(),
            onClick: boardBuilderController.playPosition
          }, 'play position'),
          button({onClick: boardBuilderController.reverse}, 'reverse'),
          div({className: 'result'}, selectedPiece
            ? 'press delete to remove'
            : boardBuilder.getNonPlayableBoardReason())
        )
      )
    );
  }
}

BoardBuilderTab.propTypes = BoardBuilder.propTypes;

const boardBuilderTab = createFactory(BoardBuilderTab);
