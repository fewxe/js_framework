import RealCalculator from './RealCalculator.js';
import Complex from '../types/Complex.js'; // Исправлен путь

class ComplexCalculator extends RealCalculator {
    add(a, b) {
        return new Complex(a.re + b.re, a.im + b.im);
    }
    sub(a, b) {
        return new Complex(a.re - b.re, a.im - b.im);
    }
    inv(a) {
        let q = a.re * a.re + a.im * a.im;
        return new Complex(a.re / q, -a.im / q);
    }
    mult(a, b) {
        return new Complex(
            a.re * b.re - a.im * b.im,
            a.re * b.im + b.re * a.im
        );
    }
    div(a, b) {
        const m = b.re * b.re + b.im * b.im;
        return new Complex(
            (a.re * b.re + a.im * b.im) / m,
            (a.im * b.re - a.re * b.im) / m
        );
    }
    pow(a, n) {
        if (n === 0) return this.one();
        if (n < 0) return this.pow(this.inv(a), -n);

        let S = this.one();
        for (let i = 0; i < n; i++) {
            S = this.mult(S, a);
        }
        return S;
    }
    prod(a, p) {
        return new Complex(a.re * p, a.im * p);
    }
    one() {
        return new Complex(1, 0);
    }
    zero() {
        return new Complex(0, 0);
    }
}

export default ComplexCalculator;
