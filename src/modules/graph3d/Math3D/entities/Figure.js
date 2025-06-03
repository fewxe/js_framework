import Point from './Point.js';

export default class Figure{
    constructor(origin = new Point(0, 0, 0)) {
        this.points=[];
        this.edges=[];
        this.polygons=[];
        this.origin = origin;
    }
}