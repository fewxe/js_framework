export default class Point{
    constructor(x=0,y=0,z=0){
        this.x=x;
        this.y=y;
        this.z=z;
    }
    add(point) {
        return new Point(this.x + point.x, this.y + point.y, this.z + point.z);
    }
}