import React from 'react';
import propTypes from 'prop-types';
import classes from 'classnames';

import {createFactory, div} from '../dom';

class Tabs extends React.Component {
  render() {
    const {tabs, selectedTab, className, onChange} = this.props;
    const selectedTabItem = tabs.find((tab) => tab.id === selectedTab);

    return div({className: classes('tabs', className)},
      div({className: 'tabs-labels'},
        tabs.map((tab, i) => div({
          key: i,
          className: classes({
            'is-active': tab === selectedTabItem,
            'is-disabled': tab.disabled
          }),
          onClick: !tab.disabled && tab !== selectedTabItem ? onChange.bind(null, tab.id) : null
        }, tab.label))
      ),
      div({className: 'tabs-content'}, selectedTabItem.renderContent())
    );
  }
}

Tabs.propTypes = {
  tabs: propTypes.arrayOf(propTypes.shape({
    id: propTypes.any.isRequired,
    label: propTypes.string.isRequired,
    disabled: propTypes.bool,
    renderContent: propTypes.func.isRequired
  })).isRequired,
  selectedTab: propTypes.any.isRequired,
  className: propTypes.string,
  onChange: propTypes.func.isRequired
};

export default createFactory(Tabs);
