import React from 'react';
import propTypes from 'prop-types';

import {div} from '../dom';

export class Layout extends React.Component {
  render() {
    return div({
        className: 'layout'
      },
      this.props.children
    );
  }
}

Layout.propTypes = {
  children: propTypes.any.isRequired
};
