import Polynomial from '../types/Polynomial.js';
import Member from '../types/Member.js';
import _Calculator from './Calculator.js';

class PolynomialCalculator {
    polynomial(members) {
        return new Polynomial(members);
    }

    getPolynomial(str) {
        const arr = [];
        let start = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i + 1] === '+' || str[i + 1] === '-') {
                arr.push(str.substr(start, i + 1 - start));
                start = i + 1;
            }
        }
        arr.push(str.substr(start, str.length - start));
        const members = [];
        arr.forEach(elem => members.push(this.getMember(elem)));
        return this.polynomial(members);
    }

    getMember(str) {
        const arr = str.split('x');
        if (arr.length === 1) {
            return new Member(arr[0] - 0);
        }
        arr[0] = arr[0].replace('*', '');
        arr[1] = arr[1].replace('^', '');
        if (arr[0] == '') arr[0] = 1;
        return arr[1] ? new Member(arr[0] - 0, arr[1] - 0) : new Member(arr[0] - 0, 1);
    }

    getValue(str) {
        if (str.includes('x')) return this.getPolynomial(str);
        return str - 0;
    }

    add(a, b) {
        const calc = new _Calculator();
        const members = [];
        a.poly.forEach(elemA => {
            const member = b.poly.find(elemB => elemB.power === elemA.power);
            if (member) {
                members.push(new Member(calc.add(elemA.value, member.value), elemA.power));
            } else {
                members.push(new Member(elemA.value, elemA.power));
            }
        });
        b.poly.forEach(elemB => {
            if (!members.find(elem => elem.power === elemB.power)) {
                members.push(new Member(elemB.value, elemB.power));
            }
        });
        return this.polynomial(members);
    }

    sub(a, b) {
        const calc = new _Calculator();
        const members = [];
        a.poly.forEach(elemA => {
            const member = b.poly.find(elemB => elemB.power === elemA.power);
            if (member) {
                members.push(new Member(calc.sub(elemA.value, member.value), elemA.power));
            } else {
                members.push(new Member(elemA.value, elemA.power));
            }
        });
        b.poly.forEach(elemB => {
            if (!members.find(elem => elem.power === elemB.power)) {
                members.push(new Member(-elemB.value, elemB.power));
            }
        });
        return this.polynomial(members);
    }

    mult(a, b) {
        const calc = new _Calculator();
        let polynomial = this.polynomial();
        a.poly.forEach(elemA => {
            const members = [];
            b.poly.forEach(elemB => {
                members.push(new Member(calc.mult(elemA.value, elemB.value), elemA.power + elemB.power));
            });
            polynomial = this.add(polynomial, this.polynomial(members));
        });
        return polynomial;
    }

    div() {
        return null;
    }

    prod(a, p) {
        const calc = new _Calculator();
        const members = [];
        a.poly.forEach(elemA => {
            members.push(new Member(calc.mult(elemA.value, p), elemA.power));
        });
        return this.polynomial(members);
    }

    pow(a, n) {
        let result = this.one();
        for (let i = 0; i < n; i++) {
            result = this.mult(result, a);
        }
        return result;
    }

    // 0 -> 0*x^0
    zero() {
        return new Polynomial([new Member]);
    }

    // 1 -> 1*x^0
    one() {
        return new Polynomial([new Member(1)]);
    }
}

export default PolynomialCalculator;