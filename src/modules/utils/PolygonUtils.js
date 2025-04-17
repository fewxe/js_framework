export function applyColorToPolygons(polygons, hexColor) {
    const bigint = parseInt(hexColor.replace('#', ''), 16);
    const color = {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
    polygons.forEach(polygon => {
        polygon.color = color;
    });
}
