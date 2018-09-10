import React, {Component} from 'react';
import propTypes from 'prop-types';
import dom from 'react-dom-factories';

import {getPieceIcon} from '../models/piece-utils';
import {symbolToString} from '../utils/symbol';

class Piece extends Component {
  render() {
    const {piece} = this.props;

    return dom.div({className: `piece piece-${symbolToString(piece.side)}`},
      dom.span(null, getPieceIcon(piece))
    );
  }
}

Piece.propTypes = {
  piece: propTypes.object.isRequired
};

export default React.createFactory(Piece);
