import { CompactPicker } from 'react-color';
import React from 'react';

import Canvas from './Canvas';

export default class App extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      color: {
        r: 34,
        g: 166,
        b: 153,
      },
    };

    this.handleChangeComplete = this.handleChangeComplete.bind(this);
  }

  handleChangeComplete({ rgb: {r, g, b} }) {
    this.setState({
      color: { r, g, b },
    });
  }

  render() {
    return (
      <div>
        <Canvas color={this.state.color} />
        <div style={{ width: '245px' }}>
          <CompactPicker
            color={this.state.color}
            onChangeComplete={ this.handleChangeComplete }
          />
        </div>
      </div>
    )
  }
}
