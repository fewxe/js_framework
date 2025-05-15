import Calculator from '../../modules/calculator/calculators/Calculator.js';

const useCalculator = (aRef, bRef, cRef) => {
    const calc = new Calculator();
    return (operand) => {
        const a = calc.getValue(aRef.current.value);
        const b = calc.getValue(bRef.current.value);
        const c = calc[operand](a, b);
        cRef.current.value = c.toString();
    };
};

export default useCalculator;
