class RealCalculator {
    add(a, b) { return a + b; }
    sub(a, b) { return a - b; }
    mult(a, b) { return a * b; }
    div(a, b) { return a / b; }
    pow(a, n) { return Math.pow(a, n); }
    prod(a, p) { return a * p; }
    one() { return 1; }
    zero() { return 0; }
}

export default RealCalculator;