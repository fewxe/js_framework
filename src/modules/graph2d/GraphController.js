class GraphController {
    constructor(graph) {
        this.graph = graph;
        this.canvas = this.graph.canvas;
        this.canMove = false;
        this.mousePosition = { x: 0, y: 0 };
        this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.canvas.addEventListener("wheel", this.onWheel.bind(this));
        this.canvas.addEventListener("mouseleave", this.onMouseLeave.bind(this));
        this.zoom = 10;
        this.functions = {};
    }

    onMouseDown(event) {
        this.canMove = true;
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
    }

    onMouseUp(event) {
        this.canMove = false;
    }

    onMouseLeave(event) {
        this.canMove = false;
    }

    onMouseMove(event) {
        if (!this.canMove) return;

        let dx = (event.clientX - this.mousePosition.x);
        let dy = (event.clientY - this.mousePosition.y);

        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;

        this.graph.offsetX += dx / this.graph.scale;
        this.graph.offsetY -= dy / this.graph.scale;

        this.render();
    }

    onWheel(event) {
        let newScale = this.graph.scale + (event.wheelDelta > 0 ? this.zoom : -this.zoom);
        if (newScale < 5) newScale = 5;
        if (newScale > 100) newScale = 100;

        this.graph.scale = newScale;
        this.render();
    }

    render() {
        this.graph.clear();
        Object.values(this.functions).forEach((element) => {
            this.graph.drawFunction(element.func, element.color);

            if (element.integralRange != null) {
                this.graph.drawIntegral(element.func, element.integralRange[0], element.integralRange[1]);
            }

        });

        this.graph.drawGrid();

        Object.values(this.functions).forEach((element) => {
            this.graph.drawFunction(element.func, element.color);

            if (element.tangentPoint != null) {
                this.graph.drawTangentWithDerivative(element.func, element.tangentPoint);
            }

            if (element.zeroRange != null) {
                this.graph.drawZeroPoints(element.func, element.zeroRange[0], element.zeroRange[1]);
            }
        });
    }

    addFunction(graphId, func, color, integralRange, tangentPoint, zeroRange) {
        this.functions[graphId] = { func, color, integralRange, tangentPoint, zeroRange };
        this.render();
    }

    removeFunction(graphId) {
        delete this.functions[graphId];
        this.render();
    }

    updateFunctionData(graphId, newData) {
        const funcData = this.functions[graphId];
        Object.assign(funcData, newData);
        this.render();
    }
}

export default GraphController;
