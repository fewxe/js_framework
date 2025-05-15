import { useRef } from 'react';


const UI2D = ({ functions, onAdd, onUpdate, onRemove }) => {
    const refs = useRef([]);

    const getValue = (index, field) => {
        if (!refs.current[index]) return '';
        return refs.current[index][field]?.value || '';
    };

    return (
        <div>
            <button onClick={onAdd}>+</button>
            {functions.map((f, i) => (
                <div key={i} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
                    <input
                        type="text"
                        placeholder="Введите функцию (например: Math.sin(x))"
                        defaultValue={f.funcStr || ''}
                        ref={el => {
                            refs.current[i] = refs.current[i] || {};
                            refs.current[i].funcStr = el;
                        }}
                        onInput={() => onUpdate(i, { funcStr: getValue(i, 'funcStr'), color: getValue(i, 'color') })}
                    />
                    <input
                        type="color"
                        defaultValue={f.color || '#ff0000'}
                        ref={el => {
                            refs.current[i] = refs.current[i] || {};
                            refs.current[i].color = el;
                        }}
                        onInput={() => onUpdate(i, { funcStr: getValue(i, 'funcStr'), color: getValue(i, 'color') })}
                    />
                    <button onClick={() => onRemove(i)}>Удалить</button>
                    <div>
                        <label>
                            Интеграл (от, до):
                            <input
                                type="number"
                                placeholder="Начало"
                                defaultValue={f.integralRange?.[0] || ''}
                                ref={el => {
                                    refs.current[i] = refs.current[i] || {};
                                    refs.current[i].integralStart = el;
                                }}
                            />
                            <input
                                type="number"
                                placeholder="Конец"
                                defaultValue={f.integralRange?.[1] || ''}
                                ref={el => {
                                    refs.current[i] = refs.current[i] || {};
                                    refs.current[i].integralEnd = el;
                                }}
                            />
                            <button onClick={() => onUpdate(i, {
                                integralRange: [
                                    getValue(i, 'integralStart'),
                                    getValue(i, 'integralEnd')
                                ]
                            })}>Показать интеграл</button>
                        </label>
                    </div>
                    <div>
                        <label>
                            Касательная в x=
                            <input
                                type="number"
                                defaultValue={f.tangentPoint || ''}
                                ref={el => {
                                    refs.current[i] = refs.current[i] || {};
                                    refs.current[i].tangentPoint = el;
                                }}
                            />
                            <button onClick={() => onUpdate(i, {
                                tangentPoint: getValue(i, 'tangentPoint')
                            })}>Показать касательную</button>
                        </label>
                    </div>
                    <div>
                        <label>
                            Нули функции (от, до):
                            <input
                                type="number"
                                placeholder="Начало"
                                defaultValue={f.zeroRange?.[0] || ''}
                                ref={el => {
                                    refs.current[i] = refs.current[i] || {};
                                    refs.current[i].zeroStart = el;
                                }}
                            />
                            <input
                                type="number"
                                placeholder="Конец"
                                defaultValue={f.zeroRange?.[1] || ''}
                                ref={el => {
                                    refs.current[i] = refs.current[i] || {};
                                    refs.current[i].zeroEnd = el;
                                }}
                            />
                            <button onClick={() => onUpdate(i, {
                                zeroRange: [
                                    getValue(i, 'zeroStart'),
                                    getValue(i, 'zeroEnd')
                                ]
                            })}>Показать нули</button>
                        </label>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UI2D;
