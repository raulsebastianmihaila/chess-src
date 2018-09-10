import React, {Component} from 'react';
import propTypes from 'prop-types';
import dom from 'react-dom-factories';

import modal from './modal';
import piece from './piece';
import {makePiece} from '../models/piece-utils';
import {pieceTypes} from '../enums/game';

class PromotionModal extends Component {
  onClick(pieceType) {
    this.props.onPromote(pieceType);
  }

  getTypeSquare(type) {
    return dom.div({onClick: this.onClick.bind(this, type)},
      piece({piece: makePiece(type, null, null, this.props.side)})
    );
  }

  render() {
    return modal({
        size: 'small',
        isOpen: this.props.isOpen,
        className: 'promotion-modal'
      },
      this.props.isOpen && dom.div({className: 'promotion-pieces'},
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

export default React.createFactory(PromotionModal);
