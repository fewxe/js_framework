export default class UI {
    constructor(controller, container) {
        this.controller = controller;
        this.container = container;
        this.graph = this.controller.graph;
        this.graphContainers = [];
        this.createAddGraphButton();
    }

    createAddGraphButton() {
        let addGraphButton = document.createElement('button');
        addGraphButton.innerText = '+';
        addGraphButton.classList.add('add-graph-button');
        addGraphButton.addEventListener('click', () => this.addGraphContainer());
        this.container.appendChild(addGraphButton);
    }

    addGraphContainer() {
        let graphIndex = this.graphContainers.length;

        let graphContainer = document.createElement('div');
        graphContainer.classList.add('graph-container');
        this.container.insertBefore(graphContainer, this.container.lastChild);

        let functionInput = document.createElement('input');
        functionInput.placeholder = 'Введите функцию (x => Math.sin(x))';
        functionInput.type = 'text';
        functionInput.classList.add('function-input');
        graphContainer.appendChild(functionInput);

        let addFunctionButton = this.createButton('Обновить', () => {
            this.onAddOrUpdateFunction(functionInput.value, graphIndex);
        });
        graphContainer.appendChild(addFunctionButton);

        let colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = '#ff0000';
        colorInput.classList.add('color-input');
        graphContainer.appendChild(colorInput);

        let deleteButton = this.createButton('Удалить график', () => {
            this.deleteGraphContainer(graphIndex, graphContainer);
        });
        graphContainer.appendChild(deleteButton);

        let controlsContainer = document.createElement('div');
        controlsContainer.classList.add('controls-container');
        graphContainer.appendChild(controlsContainer);

        this.graphContainers.push({
            graphContainer,
            functionInput,
            controlsContainer,
            colorInput,
            currentFunc: null,
            integralRange: null,
            tangentPoint: null,
            zeroRange: null
        });
    }

    onAddOrUpdateFunction(funcStr, graphIndex) {
        try {
            let func = new Function('x', `return ${funcStr}`);
            let containerData = this.graphContainers[graphIndex];

            let color = containerData.colorInput.value;

            this.controller.addFunction(
                graphIndex,
                func,
                color,
                containerData.integralRange,
                containerData.tangentPoint,
                containerData.zeroRange
            );

            containerData.currentFunc = func;
            this.createGraphControls(containerData.controlsContainer, graphIndex);
        } catch (error) {
            console.error('Некорректный синтаксис функции:', error);
            alert('Ошибка: Некорректная функция');
        }
    }

    createGraphControls(container, graphIndex) {
        container.innerHTML = '';

        container.appendChild(this.createRangeInput('Интеграл (от, до):', 'Показать интеграл', (a, b) => {
            this.controller.updateFunctionData(graphIndex, { integralRange: [a, b] });
            this.controller.render();
        }));

        container.appendChild(this.createPointInput('Касательная в точке x =', 'Показать касательную', (x) => {
            this.controller.updateFunctionData(graphIndex, { tangentPoint: x });
            this.controller.render();
        }));

        container.appendChild(this.createRangeInput('Нули функции (от, до):', 'Показать нули', (a, b) => {
            this.controller.updateFunctionData(graphIndex, { zeroRange: [a, b] });
            this.controller.render();
        }));
    }

    deleteGraphContainer(graphIndex, graphContainer) {
        this.controller.removeFunction(graphIndex);
        this.graphContainers.splice(graphIndex, 1);
        graphContainer.remove();
    }

    createRangeInput(labelText, buttonText, callback) {
        let rangeInput = document.createElement('div');
        rangeInput.classList.add('range-input');

        let label = document.createElement('label');
        label.innerText = labelText;

        let startInput = document.createElement('input');
        startInput.placeholder = 'Начало';
        startInput.type = 'number';

        let endInput = document.createElement('input');
        endInput.placeholder = 'Конец';
        endInput.type = 'number';

        let button = this.createButton(buttonText, () => {
            let start = parseFloat(startInput.value);
            let end = parseFloat(endInput.value);
            if (!isNaN(start) && !isNaN(end)) callback(start, end);
            else alert('Введите корректные числа');
        });

        rangeInput.appendChild(label);
        rangeInput.appendChild(startInput);
        rangeInput.appendChild(endInput);
        rangeInput.appendChild(button);

        return rangeInput;
    }

    createPointInput(labelText, buttonText, callback) {
        let pointInput = document.createElement('div');
        pointInput.classList.add('point-input');

        let label = document.createElement('label');
        label.innerText = labelText;

        let input = document.createElement('input');
        input.placeholder = 'Точка x';
        input.type = 'number';

        let button = this.createButton(buttonText, () => {
            let x = parseFloat(input.value);
            if (!isNaN(x)) callback(x);
            else alert('Введите корректное число');
        });

        pointInput.appendChild(label);
        pointInput.appendChild(input);
        pointInput.appendChild(button);

        return pointInput;
    }

    createButton(text, onClick) {
        let button = document.createElement('button');
        button.innerText = text;
        button.addEventListener('click', onClick);
        return button;
    }
}

