import React, {Component} from 'react';
import propTypes from 'prop-types';
import dom from 'react-dom-factories';
import {Link} from 'crizmas-router';

import boardBuilder from '../../components/board-builder';

export default class BoardBuilderPage extends Component {
  render() {
    const {boardBuilderController} = this.props.controller;

    return dom.div(null,
      boardBuilder({boardBuilderController}),
      dom.div({className: 'footer'},
        React.createElement(Link, {to: '/'}, 'main'))
    );
  }
}

BoardBuilderPage.propTypes = {
  controller: propTypes.shape({
    boardBuilderController: propTypes.object.isRequired
  }).isRequired
};
