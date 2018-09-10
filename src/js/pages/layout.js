import {Component} from 'react';
import propTypes from 'prop-types';
import dom from 'react-dom-factories';

export class Layout extends Component {
  render() {
    return dom.div({
        className: 'layout'
      },
      this.props.children
    );
  }
}

Layout.propTypes = {
  children: propTypes.any.isRequired
};
