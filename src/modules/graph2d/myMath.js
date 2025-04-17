Math.__proto__.getZero = function (f, a, b, eps = 0.0001) {
    if (f(a) * f(b) > 0) return null;
    if (Math.abs(f(a) - f(b)) <= eps) return (a + b) / 2;

    const half = (a + b) / 2;
    if (f(a) * f(half) <= 0) return this.getZero(f, a, half, eps);
    if (f(half) * f(b) <= 0) return this.getZero(f, half, b, eps);
};

Math.__proto__.getDerivativeAtPoint  = function(f, x, h = 0.0001) {
    return (f(x + h) - f(x - h)) / (2 * h);
}
