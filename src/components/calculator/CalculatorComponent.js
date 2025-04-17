import React, { useState } from 'react';
import _Calculator from '../../modules/calculator/calculators/Calculator.js';

const CalculatorComponent = () => {
    const calc = new _Calculator();
    let inputs = { a: '', b: '', c: '' };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        inputs[id] = value;
        render();
    };

    const handleOperation = (operand) => {
        const a = calc.getValue(inputs.a);
        const b = calc.getValue(inputs.b);
        const result = calc[operand](a, b);
        inputs.c = result !== null ? result.toString() : 'Ошибка';
        render();
    };

    const render = () => {
        document.getElementById('a').value = inputs.a;
        document.getElementById('b').value = inputs.b;
        document.getElementById('c').value = inputs.c;
    };

    return (
        <div>
            <div>
                <input
                    id="a"
                    type="text"
                    placeholder="Введите первое значение"
                    defaultValue={inputs.a}
                    onInput={handleInputChange}
                />
                <input
                    id="b"
                    type="text"
                    placeholder="Введите второе значение"
                    defaultValue={inputs.b}
                    onInput={handleInputChange}
                />
                <input
                    id="c"
                    type="text"
                    placeholder="Результат"
                    defaultValue={inputs.c}
                    readOnly
                />
            </div>
            <div>
                <button onClick={() => handleOperation('add')}>+</button>
                <button onClick={() => handleOperation('sub')}>-</button>
                <button onClick={() => handleOperation('mult')}>*</button>
                <button onClick={() => handleOperation('div')}>/</button>
            </div>
        </div>
    );
};

export default CalculatorComponent;
