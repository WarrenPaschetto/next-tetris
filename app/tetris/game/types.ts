export type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Board = Cell[][];

export type Shape = number[][]; // 2D array representing the shape's blocks (1s and 0s)
export type Piece = {
    shape: Shape;
    x: number; // horizontal position on the board
    y: number; // vertical position on the board
    id: Exclude<Cell, 0>; // the cell value representing this piece (1-7)
};

