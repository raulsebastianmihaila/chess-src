import React, {Component} from 'react';
import propTypes from 'prop-types';
import classes from 'classnames';
import dom from 'react-dom-factories';

class Modal extends Component {
  render() {
    const {title, isOpen, children, actions, className} = this.props;

    return dom.div({className: classes('modal', {'is-open': isOpen}, className)},
      dom.div({className: `content ${this.props.size}`},
        title && dom.div({className: 'title'}, title),
        dom.div({className: 'body'}, children),
        actions && dom.div({className: 'footer'},
          actions.map((action, i) => dom.button({
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

export default React.createFactory(Modal);
