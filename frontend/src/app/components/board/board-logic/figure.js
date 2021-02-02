export default class Figure {
    constructor (color, type, img, position) {
        this.color = color;
        this.type = type;
        this.img = img;
        this.hasMoved = false;
        this.position = position;
    }
}
