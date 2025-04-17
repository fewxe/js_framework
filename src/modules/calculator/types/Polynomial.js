import _Calculator from '../calculators/Calculator.js';

class Polynomial {
    constructor(poly = []) {
        this.poly = poly;
        this.poly.sort((a, b) => b.power - a.power);
    }

    getValue(x) {
        const calc = new _Calculator();
        return this.poly.reduce((s, elem) =>
            calc.add(
                s,
                calc.prod(calc.pow(x, elem.power), elem.value)
            ),
            calc.zero(null, x)
        );
    }

    toString() {
        let str = this.poly[0].toString();
        for (let i = 1; i < this.poly.length; i++) {
            str += (this.poly[i].value > 0) ? '+' + this.poly[i].toString() : this.poly[i].toString();
        }
        return str;
    }
}

export default Polynomial;