import React, {Component} from 'react';
import propTypes from 'prop-types';
import classes from 'classnames';
import dom from 'react-dom-factories';

class Tabs extends Component {
  render() {
    const {tabs, selectedTab, className, onChange} = this.props;
    const selectedTabItem = tabs.find((tab) => tab.id === selectedTab);

    return dom.div({className: classes('tabs', className)},
      dom.div({className: 'tabs-labels'},
        tabs.map((tab, i) => dom.div({
          key: i,
          className: classes({
            'is-active': tab === selectedTabItem,
            'is-disabled': tab.disabled
          }),
          onClick: !tab.disabled && tab !== selectedTabItem ? onChange.bind(null, tab.id) : null
        }, tab.label))
      ),
      dom.div({className: 'tabs-content'}, selectedTabItem.renderContent())
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

export default React.createFactory(Tabs);
