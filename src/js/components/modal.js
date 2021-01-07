import React from 'react';
import propTypes from 'prop-types';
import classes from 'classnames';

import {createFactory, div, button} from '../dom';

class Modal extends React.Component {
  render() {
    const {title, isOpen, children, actions, className} = this.props;

    return div({className: classes('modal', {'is-open': isOpen}, className)},
      div({className: `content ${this.props.size}`},
        title && div({className: 'title'}, title),
        div({className: 'body'}, children),
        actions && div({className: 'footer'},
          actions.map((action, i) => button({
              key: i,
              onClick: action.handler
            },
            action.label
          ))
        )
      )
    );
  }
}

Modal.propTypes = {
  size: propTypes.oneOf(['small', 'small-medium', 'medium-small', 'normal', 'large']).isRequired,
  title: propTypes.any,
  children: propTypes.any,
  isOpen: propTypes.bool,
  className: propTypes.string,
  actions: propTypes.arrayOf(propTypes.shape({
    label: propTypes.string.isRequired,
    handler: propTypes.func.isRequired
  }))
};

Modal.defaultProps = {
  size: 'normal',
  isOpen: false
};

export default createFactory(Modal);
