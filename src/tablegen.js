import _ from 'lodash';
import assert from 'assert';

export const HORIZONTAL = "horizontal";
export const VERTICAL = "vertical";

export class TableCell {
    
    constructor(slice) {
        if (slice != HORIZONTAL && slice != VERTICAL) { throw "no"; }
        this.slice = slice;
        this.cells = [];

        this.requiredRows = undefined;
        this.requiredCols = undefined;
        this.allocatedRows = undefined;
        this.allocatedCols = undefined;
        this.rowPos = undefined;
        this.colPos = undefined;
    }

    get type() {
        return "cell";
    }

    addCell(slice) {
        let cell = new TableCell(slice);
        this.cells.push(cell);
        return cell;
    }

    addTerminal(inner) {
        let terminal = new TableTerminal(inner);
        this.cells.push(terminal);
    }

    calculateRowCol() {
        let rows = 0;
        let cols = 0;

        if (this.slice == HORIZONTAL) {
            _.each(this.cells, cell => {
                let inner = cell.calculateRowCol();
                rows += inner.rows;
                if (cols < inner.cols) cols = inner.cols;
            });
        } else {
            _.each(this.cells, cell => {
                let inner = cell.calculateRowCol();
                if (rows < inner.rows) rows = inner.rows;
                cols += inner.cols;
            });
        }

        this.requiredRows = rows;
        this.requiredCols = cols;
        return { rows, cols };
    }

    allocateRowCol(rows, cols, rowPos, colPos) {
        this.allocatedRows = rows;
        this.allocatedCols = cols;
        this.rowPos = rowPos;
        this.colPos = colPos;

        assert(this.allocatedRows >= this.requiredRows, "allocated wrong rows");
        assert(this.allocatedCols >= this.requiredCols, "allocated wrong cols");

        if (this.slice == HORIZONTAL) {

            let cellSizesRows = divideEvenly(
                this.allocatedRows - this.requiredRows, 
                this.cells.length
            );

            _.each(_.zip(this.cells, cellSizesRows), ([cell, rowSize]) => {
                let size = cell.requiredRows + rowSize;
                cell.allocateRowCol(size, cols, rowPos, colPos);
                rowPos += size;
            });

        } else {

            let cellSizesCols = divideEvenly(
                this.allocatedCols - this.requiredCols, 
                this.cells.length
            );

            _.each(_.zip(this.cells, cellSizesCols), ([cell, colSize]) => {
                //let size = cell.requiredCols;
                let size = cell.requiredCols + colSize;
                cell.allocateRowCol(rows, size, rowPos, colPos);
                colPos += size;
            });

        }
    }

    toOutput() {
        let { rows, cols } = this.calculateRowCol();
        this.allocateRowCol(rows, cols, 0, 0);

        let out = [];

        for (var cRow = 0; cRow < this.allocatedRows; cRow += 1) {
            let row = [];
            for (var cCol = 0; cCol < this.allocatedCols; cCol += 1) {
                this.rasterize(row, cRow, cCol);
            }
            out.push(row);
        }

        return out;
    }

    rasterize(out, rowPos, colPos) {
        // TODO: Optimize
        _.each(this.cells, cell => cell.rasterize(out, rowPos, colPos));
    }

}

class TableTerminal {

    constructor(inner, parent) {
        this.inner = inner;

        this.requiredRows = 1;
        this.requiredCols = 1;
        this.allocatedRows = undefined;
        this.allocatedCols = undefined;
        this.rowPos = undefined;
        this.colPos = undefined;
    }

    get type() {
        return "terminal";
    }

    calculateRowCol() {
        return { rows: 1, cols: 1 };
    }

    allocateRowCol(rows, cols, rowPos, colPos) {
        this.allocatedRows = rows;
        this.allocatedCols = cols;
        this.rowPos = rowPos;
        this.colPos = colPos;
    }

    rasterize(out, rowPos, colPos) {
        if (this.rowPos == rowPos && this.colPos == colPos) {
            out.push({
                rows: this.allocatedRows,
                cols: this.allocatedCols,
                inner: this.inner,
            });
        }
    }

}

function divideEvenly(number, count) {
    assert(!(number > 0 && count == 0), "could not divideEvenly");
    let elements = _.times(count, _.constant(0));
    while (number > 0) {
        elements = _.map(elements, ec => {
            if (number > 0) {
                number -= 1;
                return ec + 1;
            } else {
                return ec;
            }
        });
    }
    return elements;
}
