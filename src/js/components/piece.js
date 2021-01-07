import React from 'react';
import propTypes from 'prop-types';

import {getPieceIcon} from '../models/piece-utils';
import {symbolToString} from '../utils/symbol';
import {createFactory, div, span} from '../dom';

class Piece extends React.Component {
  render() {
    const {piece} = this.props;

    return div({className: `piece piece-${symbolToString(piece.side)}`},
      span(null, getPieceIcon(piece))
    );
  }
}

Piece.propTypes = {
  piece: propTypes.object.isRequired
};

export default createFactory(Piece);
