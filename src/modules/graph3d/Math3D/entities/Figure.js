import Point from './Point.js';

export default class Figure{
    constructor(origin = {x: 0, y: 0, z: 0}){
        this.localPoints=[];
        this.edges=[];
        this.polygons=[];
        this.origin = origin;
    }

    get points() {
        const { x: ox, y: oy, z: oz } = this.origin || { x: 0, y: 0, z: 0 };
        return (this.localPoints || []).map(
            p => new Point(p.x + ox, p.y + oy, p.z + oz)
        );
    }
}