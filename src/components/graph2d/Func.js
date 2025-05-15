import { useState } from 'react';

const Func = ({ func, index, delFunction, rerender }) => {
    const [formula, setFormulaState] = useState(func.f.toString());

    const setColor = (event) => {
        func.color = event.target.value;
        rerender();
    };
    const setFormula = (event) => {
        try {
            func.f = new Function('x', `return ${event.target.value}`);
            setFormulaState(event.target.value);
            rerender();
        } catch (e) {}
    };
    return (
        <>
            <input value={formula} onChange={e => setFormulaState(e.target.value)} onBlur={setFormula} />
            <input defaultValue={func.color} onBlur={setColor} />
            <button onClick={() => delFunction(index)}>Удалить</button>
        </>
    );
};

export default Func;
