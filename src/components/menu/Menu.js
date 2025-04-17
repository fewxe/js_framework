import React from 'react';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeContent: null };
  }

  render() {
    return (
      <div>
        {this.props.menu.map(item => (
          <button key={item.name} onClick={() =>  this.setState({ activeContent: item.component })}>
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
