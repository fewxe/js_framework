import Graph from '../../modules/graph2d/Graph.js';
import GraphController from '../../modules/graph2d/GraphController.js';

export default class Graph2DMain {
    constructor(canvasId, containerId) {
        this.canvasId = canvasId;
        this.containerId = containerId;
    }

    run() {
        const container = document.getElementById(this.containerId);
        const canvas = document.getElementById(this.canvasId);

        const graph = new Graph(canvas);
        const controller = new GraphController(graph);

        controller.render();

        return { graph, controller };
    }
}
