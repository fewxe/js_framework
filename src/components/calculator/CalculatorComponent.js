import { useRef } from 'react';
import useCalculator from './useCalculator.js';

const CalculatorComponent = () => {
    const aRef = useRef();
    const bRef = useRef();
    const cRef = useRef();
    const calc = useCalculator(aRef, bRef, cRef);

    return (
        <div>
            <div>
                <textarea ref={aRef} />
                <textarea ref={bRef} />
                <textarea ref={cRef} readOnly />
            </div>
            <div>
                <button onClick={() => calc('add')}>+</button>
                <button onClick={() => calc('sub')}>-</button>
                <button onClick={() => calc('mult')}>*</button>
                <button onClick={() => calc('div')}>/</button>
            </div>
        </div>
    );
};

export default CalculatorComponent;
