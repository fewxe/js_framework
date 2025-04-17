class Matrix {
    constructor(values = [[]]) {
        this.values = values.map(row => row.map(el => el)); 
    }

    toString() {
        return this.values.map(row =>
            row.join(', ') 
        ).join('\n'); 
    }
}

export default Matrix;
