import React from 'react';
import _Calculator from '../../modules/calculator/calculators/Calculator.js';

export default class CalculatorComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            a: '',
            b: '',
            c: '',
        };
        this.calc = new _Calculator();
    }

    handleOperation = (operation) => {
        let result = this.calc[operation](this.state.a, this.state.b);
        this.setState({ c: result });
    };

    render() {
        return (
            <div>
                <div>
                    <input
                        type="text"
                        value={this.state.a}
                        onChange={(e) => {this.setState({a: this.calc.getValue(e.target.value)})}}
                    />
                    <input
                        type="int"
                        value={this.state.b}
                        onChange={(e) => {this.setState({b: this.calc.getValue(e.target.value)})}}
                    />
                    <input
                        type="int"
                        readOnly
                        value={this.state.c}
                    />
                </div>
                <div>
                    <button onClick={() => this.handleOperation('add')}>+</button>
                    <button onClick={() => this.handleOperation('sub')}>-</button>
                    <button onClick={() => this.handleOperation('mult')}>*</button>
                    <button onClick={() => this.handleOperation('div')}>/</button>
                </div>
            </div>
        );
    }
}
