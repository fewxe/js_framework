class Vector {
    constructor(values = []) {
        this.values = [];
        values.forEach(el => this.values.push(el));
    }

    toString() {
        return `(${this.values.map(el => el.toString()).join(', ')})`;
    }
}

export default Vector;