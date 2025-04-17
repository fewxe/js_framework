import React from 'react';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeContent: null,
      selectedButton: null
     };
  }

  render() {
    return (
      <div>
      {this.props.menu
        .filter(item => item.name !== this.state.selectedButton)
        .map(item => (
        <button
          key={item.name}
          onClick={() => this.setState({ activeContent: item.component, selectedButton: item.name })}
        >
          {item.name}
        </button>
        ))}
      <div>
        {this.state.activeContent}
      </div>
      </div>
    );
  }
}
