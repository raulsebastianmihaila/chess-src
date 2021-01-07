import React from 'react';
import propTypes from 'prop-types';

import boardBuilder from '../../components/board-builder';
import {link, div} from '../../dom';

export default class BoardBuilderPage extends React.Component {
  render() {
    const {boardBuilderController} = this.props.controller;

    return div(null,
      boardBuilder({boardBuilderController}),
      div({className: 'footer'},
        link({to: '/'}, 'main'))
    );
  }
}

BoardBuilderPage.propTypes = {
  controller: propTypes.shape({
    boardBuilderController: propTypes.object.isRequired
  }).isRequired
};
