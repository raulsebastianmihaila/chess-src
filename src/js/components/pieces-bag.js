import React, {Component} from 'react';
import propTypes from 'prop-types';
import dom from 'react-dom-factories';
import classes from 'classnames';

import {sides} from '../enums/game';
import pieceEl from './piece';

class PiecesBag extends Component {
  render() {
    const {piecesBag, selectedPiece, onSelectPiece} = this.props;

    return dom.div({className: 'pieces-bag'},
      dom.div(null, piecesBag[sides.white].map((piece, i) =>
        dom.div({
            key: i,
            className: classes('square', {'is-selected': piece === selectedPiece}),
            onClick: onSelectPiece.bind(null, piece)
          },
          pieceEl({piece})
        ))),
      dom.div(null, piecesBag[sides.black].map((piece, i) =>
        dom.div({
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

export default React.createFactory(PiecesBag);
