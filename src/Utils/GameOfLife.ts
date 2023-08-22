import { Cell } from "./Cell";

export function start(cells: Cell[], numberOfColumns: number, numberOfRows: number) {
    let cellsToAliveNeibours: Map<number, number> = new Map<number, number>();
    cells.forEach((cell, index) => {
        let numberOfAliveNeibours = 0;
        for (let m = -1; m <= 1; m++) {
            for (let n = -1; n <= 1; n++) {
                if (!isSelf(m, n)) {
                    let neibourX = cell.index.col + m;
                    let neibourY = cell.index.row + n;
                    if (neibourIsWithInBoundary(neibourX, neibourY, numberOfColumns, numberOfRows)) {
                        let neibourIndex = neibourY * numberOfColumns + neibourX;
                        if (isWithInArrayBoundary(neibourIndex, cells)) {
                            if (cells[neibourIndex].isAlive) {
                                numberOfAliveNeibours++
                            }
                        }
                    }
                }
            }
        }
        cellsToAliveNeibours.set(index, numberOfAliveNeibours);
    });

    cellsToAliveNeibours.forEach((numberOfAliveNeibours, index) => {
        cells[index].updateBasedOnNeibours(numberOfAliveNeibours);
    })

};

function neibourIsWithInBoundary(neibourX: number, neibourY: number, numberOfColumns: number, numberOfRows: number) {
    return neibourX > -1 && neibourY > -1 && neibourX < numberOfColumns && neibourY < numberOfRows;
}

function isWithInArrayBoundary(neibour_index: number, cells: Cell[]) {
    return neibour_index > 0 && neibour_index < cells.length;
}

function isSelf(m: number, n: number) {
    return m == 0 && n == 0;
}
