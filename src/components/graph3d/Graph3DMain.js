import Graph3D from '../../modules/graph3d/Graph3D.js';

export default class Graph3DMain {
    constructor(canvasId) {
        this.canvasId = canvasId;
    }

    run() {
        const canvas = document.getElementById(this.canvasId);
        const graph3D = new Graph3D(canvas);

        graph3D.renderFrame();

        return graph3D;
    }
}
