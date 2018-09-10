import React, {Component} from 'react';
import propTypes from 'prop-types';
import classes from 'classnames';
import dom from 'react-dom-factories';

import {pieceTypes} from '../enums/game';
import pieceEl from './piece';
import {addEventListener} from '../utils/dom';
import {getPieceSquare, getMouseSquare, getPiecePosition, getViewBoard}
  from './board-utils';

class Board extends Component {
  constructor() {
    super();

    this.boardElement = null;
    this.selectedPieceElement = null;
    this.isCarrying = false;

    this.onMouseDown = (e) => {
      // the carrying state must be set when we know for sure that the mouse down event occurred,
      // because in componentDidUpdate we don't know if the piece was selected using the mouse
      // or as a result of controller logic
      this.isCarrying = true;
      this.selectedPieceElement = e.target;

      this.selectedPieceElement.classList.add('carried');
      holdPiece(this.selectedPieceElement, this.boardElement, {x: e.clientX, y: e.clientY});
      this.props.gameController.selectPiece(getPieceSquare(this.selectedPieceElement,
        this.boardElement));
    };

    this.onMouseMove = (e) => {
      if (!this.isCarrying) { return; }

      holdPiece(this.selectedPieceElement, this.boardElement, {x: e.clientX, y: e.clientY});
    };

    this.onMouseUp = (e) => {
      // it's possible that even though there is a selected piece, the history for instance is
      // rewinding and so there is no square selected
      if (!this.props.gameController.selectedPiece || !this.selectedPieceElement) { return; }

      this.isCarrying = false;

      this.selectedPieceElement.classList.remove('carried');
      this.props.gameController.dropPiece(getMouseSquare({x: e.clientX, y: e.clientY},
        this.boardElement));
    };

    this.onMouseLeave = () => {
      if (this.props.gameController.selectedPiece) {
        this.props.gameController.unselectPiece();
      }
    };
  }

  componentDidMount() {
    addEventListener(this.boardElement, 'mousedown', '.selectable .piece', this.onMouseDown);
    this.boardElement.addEventListener('mousemove', this.onMouseMove);
    this.boardElement.addEventListener('mouseup', this.onMouseUp);
    this.boardElement.addEventListener('mouseleave', this.onMouseLeave);
    this.boardElement.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  componentDidUpdate() {
    // the selected square could be changed or it can disappear for instance
    // if it's changed from outside or if the history is rewinding
    const selectedPieceSquare = this.boardElement.querySelector('.square.is-selected');
    const selectedPieceElement = selectedPieceSquare && selectedPieceSquare.querySelector('.piece');

    if (selectedPieceElement !== this.selectedPieceElement) {
      if (this.selectedPieceElement) {
        this.selectedPieceElement.classList.remove('carried');
      }

      this.selectedPieceElement = selectedPieceElement;

      if (this.selectedPieceElement && this.isCarrying) {
        this.selectedPieceElement.classList.add('carried');
      } else {
        this.isCarrying = false;
      }
    }
  }

  render() {
    const {gameController: {selectedPiece, game, playSide}} = this.props;
    // the selected piece is always from the game board, not from history
    const board = game.history.isRewinding ? game.history.current : game.board;

    return dom.div({
        className: classes('board', {
          'check-mate': game.isCheckMate,
          'piece-selected': selectedPiece && !game.history.isRewinding
        }),
        ref: (boardElement) => this.boardElement = boardElement
      },
      getViewBoard(board, playSide).map((column, i) => dom.div({
          key: i,
          className: 'column'
        },
        column.map((piece, i) => dom.div({
            key: i,
            className: classes('square', {
              'is-selected': piece && piece === selectedPiece,
              selectable: isSelectable(game, piece),
              checked: piece && piece.isChecked,
              'stale-mated': isStaleMated(board, piece)
            })
          },
          piece && pieceEl({piece})
        ))
      ))
    );
  }
}

Board.propTypes = {
  gameController: propTypes.object.isRequired
};

export default React.createFactory(Board);

const holdPiece = (piece, board, mousePosition) => {
  const piecePosition = getPiecePosition(piece, board, mousePosition);

  piece.style.left = piecePosition.x;
  piece.style.top = piecePosition.y;
};

const isSelectable = (game, piece) => piece && game.isPlayable && piece.side === game.currentSide;

const isStaleMated = (board, piece) => piece && board.isStaleMate
  && piece.type === pieceTypes.king && piece.side !== board.currentSide;
