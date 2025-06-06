export default class Polygon {
    constructor(points = [], color = { r: 128, g: 128, b: 128 }, index = 0) {
        this.points = points;
        this.color = color;
        this.index = index;
        this.lumen = 1;
    }

    rgbToHex(r, g, b) {
        const toHex = (value) => {
            const hex = value.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
}