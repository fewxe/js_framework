import RealCalculator from './RealCalculator.js';
import Vector from '../types/Vector.js'; // Исправлен путь

class VectorCalculator {

    constructor(calc = new RealCalculator) {
        this.calc = calc;
    }

    div(a, b) { return null; }

    add(a, b) {
        return new Vector(a.values.map((elem, i) => this.calc.add(elem, b.values[i])));
    }

    sub(a, b) {
        return new Vector(a.values.map((elem, i) => this.calc.sub(elem, b.values[i])));
    }

    
    mult(a, b) {
        return new Vector([
            this.calc.sub(this.calc.mult(a.values[1], b.values[2]), this.calc.mult(a.values[2], b.values[1])),
            this.calc.sub(this.calc.mult(a.values[2], b.values[0]), this.calc.mult(a.values[0], b.values[2])),
            this.calc.sub(this.calc.mult(a.values[0], b.values[1]), this.calc.mult(a.values[1], b.values[0]))
        ]);
    }

    pow(a, n) {
        return new Vector(a.values.map(elem => this.calc.pow(elem, n)));
    }

    prod(a, p) {
        return new Vector(a.values.map(elem => this.calc.prod(elem, p)));
    }  

    one(length) {
        const values = [];
        for (let i = 0; i < length; i++) {
            values.push(i === 0 ?
                this.calc.one(length) :
                this.calc.zero(length)
            );
        }
        return new Vector(values);
    }

    zero(length) {
        const values = [];
        for (let i = 0; i < length; i++) {
            values.push(this.calc.zero(length));
        }
        return new Vector(values);
    }
}

export default VectorCalculator;