import React from 'react';
import propTypes from 'prop-types';
import classes from 'classnames';

import {sides} from '../enums/game';
import pieceEl from './piece';
import {createFactory, div} from '../dom';

class PiecesBag extends React.Component {
  render() {
    const {piecesBag, selectedPiece, onSelectPiece} = this.props;

    return div({className: 'pieces-bag'},
      div(null, piecesBag[sides.white].map((piece, i) =>
        div({
            key: i,
            className: classes('square', {'is-selected': piece === selectedPiece}),
            onClick: onSelectPiece.bind(null, piece)
          },
          pieceEl({piece})
        ))),
      div(null, piecesBag[sides.black].map((piece, i) =>
        div({
            key: i,
            className: classes('square', {'is-selected': piece === selectedPiece}),
            onClick: onSelectPiece.bind(null, piece)
          },
          pieceEl({piece})
        )))
    );
  }
}

PiecesBag.propTypes = {
  piecesBag: propTypes.object.isRequired,
  selectedPiece: propTypes.object,
  onSelectPiece: propTypes.func.isRequired
};

export default createFactory(PiecesBag);
