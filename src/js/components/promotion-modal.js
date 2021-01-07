import React from 'react';
import propTypes from 'prop-types';

import modal from './modal';
import piece from './piece';
import {makePiece} from '../models/piece-utils';
import {pieceTypes} from '../enums/game';
import {createFactory, div} from '../dom';

class PromotionModal extends React.Component {
  onClick(pieceType) {
    this.props.onPromote(pieceType);
  }

  getTypeSquare(type) {
    return div({onClick: this.onClick.bind(this, type)},
      piece({piece: makePiece(type, null, null, this.props.side)})
    );
  }

  render() {
    return modal({
        size: 'small',
        isOpen: this.props.isOpen,
        className: 'promotion-modal'
      },
      this.props.isOpen && div({className: 'promotion-pieces'},
        this.getTypeSquare(pieceTypes.queen),
        this.getTypeSquare(pieceTypes.rook),
        this.getTypeSquare(pieceTypes.bishop),
        this.getTypeSquare(pieceTypes.knight)
      )
    );
  }
}

PromotionModal.propTypes = {
  side: propTypes.symbol.isRequired,
  onPromote: propTypes.func.isRequired,
  isOpen: propTypes.bool
};

export default createFactory(PromotionModal);
