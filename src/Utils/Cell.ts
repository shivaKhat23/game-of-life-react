import { MatrixIndex } from "./MatrixIndex";
import { Point } from "./Point";

export class Cell {

    ctx: CanvasRenderingContext2D;
    index: MatrixIndex;
    start: Point;
    end: Point;
    size: number;
    color: string;
    isAlive: boolean;
    age: number = 0;
    readonly selectedColor: string = 'yellow';

    constructor(ctx: CanvasRenderingContext2D, index: MatrixIndex, start: Point, size: number, color: string) {
        this.ctx = ctx;
        this.index = index;
        this.start = start;
        this.end = new Point(start.x + size, start.y + size);
        this.size = size;
        this.color = color;
        this.isAlive = false;
    }

    draw() {
        this.ctx.clearRect(this.start.x, this.start.y, this.size, this.size);
        this.ctx.fillStyle = this.getColor();
        this.ctx.fillRect(this.start.x, this.start.y, this.size, this.size);
        this.ctx.strokeStyle = '#242424';
        this.ctx.strokeRect(this.start.x, this.start.y, this.size, this.size);
    }

    getColor() {
        return this.isAlive ? this.selectedColor : this.color;
    }

    toggle() {
        this.isAlive = !this.isAlive;
        this.draw();
    }

    updateBasedOnNeibours(numberOfAliveNeibours: number) {
        let updated: boolean = false;
        if (this.isAlive && (numberOfAliveNeibours > 3 || numberOfAliveNeibours < 2)) {
            this.isAlive = false;
            this.age = 0;
            updated = true;
        } else if (!this.isAlive && numberOfAliveNeibours == 3) {
            this.isAlive = true;
            this.age = 0;
            updated = true;
        } else if (this.isAlive && numberOfAliveNeibours <= 3 && numberOfAliveNeibours >= 2) {
            this.age = this.age + 1;
            updated = true;
        }
        if (updated) {
            this.draw();
        }
    }
}