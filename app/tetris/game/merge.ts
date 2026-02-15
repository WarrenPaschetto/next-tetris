import type { Board, Piece, Cell } from "./types";

export function merge(board: Board, piece: Piece): Board {
    const next: Board = board.map(row => [...row]) as Board; // deep copy of the board

    for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c] === 0) continue; // skip empty cells in the piece

            // calculate the corresponding position on the board
            const y = piece.y + r;
            const x = piece.x + c;

            if (y >= 0) { // only merge if within the visible board
                next[y][x] = piece.id as Cell; // set the cell to the piece's id (1-7)
            }
        }
    }

    return next;
}