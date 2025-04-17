import Complex from '../types/Complex.js';
import Vector from '../types/Vector.js';
import Matrix from '../types/Matrix.js';
import Polynomial from '../types/Polynomial.js';
import Member from '../types/Member.js';
import PolynomialCalculator from './PolynomialCalculator.js';
import MatrixCalculator from './MatrixCalculator.js';
import VectorCalculator from './VectorCalculator.js';
import ComplexCalculator from './ComplexCalculator.js';
import RealCalculator from './RealCalculator.js';

class _Calculator {

    complex(re, im) { return new Complex(re, im); }
    vector(values) { return new Vector(values); }
    matrix(values) { return new Matrix(values); }
    polynomial(members) { return new Polynomial(members); }


    getValue(str) {
        if (str.includes('x')) { return this.getPolynomial(str); }
        if (str.includes('[')) { return this.getMatrix(str) };
        if (str.includes('(')) { return this.getVector(str) };
        if (str.includes('i')) { return this.getComplex(str); };
        return str - 0;
    }

   
    getPolynomial(str) {
        str = str.replace(/\s/g, '');
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
        str = str.replace(/\s/g, '');
        const arr = str.split('x');
        if (arr.length === 1) {
            return new Member(arr[0] - 0);
        }
        arr[0] = arr[0].replace('*', '');
        arr[1] = arr[1].replace('^', '');
        if (arr[0] == '') arr[0] = 1;
        return arr[1] ? new Member(arr[0] - 0, arr[1] - 0) : new Member(arr[0] - 0, 1);
    }
    

    getEntity(str) {
        str = str.replace(/\s/g, '');  
        if (str.includes('[')) return this.getMatrix(str);
        if (str.includes('(')) return this.getVector(str);
        return this.getComplex(str); 
    }

    getMatrix(str) {
        const arr = str.slice(1, -1).split('|').map(elems =>
            elems.split(';').map(elem => this.getEntity(elem))
        );
        return this.matrix(arr);
    }

    getVector(str) {
        const arr = str.slice(1, -1).split(',').map(elem =>
            this.getEntity(elem)
        );
        return this.vector(arr);
    }

    getComplex(str) {
        str = str.replace(/\s/g, '');
        if (str.includes('i')) {

            str = str.replace('i', '');
            let index = -1;
            for (let i = 1; i < str.length; i++) {
                if (str[i] === '+' || str[i] === '-') {
                    index = i;
                    break;
                }
            }
    
            if (index !== -1) {
                const re = parseFloat(str.slice(0, index).replace(/\s/g, ''));
                const im = parseFloat(str.slice(index).replace(/\s/g, ''));
                console.log(re, im);
                return this.complex(re, im);

            } else {
                const im = parseFloat(str.trim());
                return this.complex(0, im);
            }
        } else {
            const re = parseFloat(str.trim());
            return this.complex(re, 0);
        }
    
        throw new Error("Неверный формат комплексного числа");
    }
    
    

    get(elem) {
        if (elem instanceof Polynomial) {
            return new PolynomialCalculator();
        }
        if (elem instanceof Matrix) {
            return new MatrixCalculator(this.get(elem.values[0][0]));
        }
        if (elem instanceof Vector) {
            return new VectorCalculator(this.get(elem.values[0]));
        }
        if (elem instanceof Complex) {
            return new ComplexCalculator();
        }
        return new RealCalculator();
    }

    add(a, b) {
        return this.get(a).add(a, b);
    }

    sub(a, b) {
        return this.get(a).sub(a, b);
    }

    mult(a, b) {
        return this.get(a).mult(a, b);
    }

    div(a, b) {
        return this.get(a).div(a, b);
    }

    pow(a, n) {
        if (typeof n === 'number') {
            return this.get(a).pow(a, n);
        }
        return null;
    }

    prod(a, p) {
        if (typeof p === 'number') {
            return this.get(a).prod(a, p);
        }
        return null;
    }

    one(type, elem) {
        type = type ? type : elem ? elem.constructor.name : null;
        switch (type) {
            case 'Complex': return this.get(this.complex()).one();
            case 'Vector': return this.get(elem).one(elem.values.length);
            case 'Matrix': return this.get(elem).one(elem.values.length);
            case 'Polynomial': return this.get(this.polynomial()).one();
            default: return this.get().one();
        }
    }

    zero(type, elem) {
        type = type ? type : elem ? elem.constructor.name : null;
        switch (type) {
            case 'Complex': return this.get(this.complex()).zero();
            case 'Vector': return this.get(elem).zero(elem.values.length);
            case 'Matrix': return this.get(elem).zero(elem.values.length);
            case 'Polynomial': return this.get(this.polynomial()).zero();
            default: return this.get().zero();
        }
    }
}

export default _Calculator;