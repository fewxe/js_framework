class Complex {
    constructor(re = 0, im = 0) {
        this.re = re;
        this.im = im;
    }

    toString() {
        return this.im 
            ? `${this.re}${this.im < 0 ? '' : '+'}${this.im}i`
            : this.re.toString();
    }
}

export default Complex;