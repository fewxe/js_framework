class Member {
    constructor (value = 0, power = 0) {
        this.value = value;
        this.power = power;
    }

    toString() {
        return this.value ? 
            `${this.value}*x^${this.power}` : 
            '';
    }
}