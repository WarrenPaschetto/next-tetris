import type { Board, Piece } from "./types";
import { ROWS, COLS } from "./constants";

export function collides(board: Board, piece: Piece, nextX: number, nextY: number) {
    const { shape } = piece;

    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === 0) continue; // skip empty cells in the piece

            const boardX = nextX + c;
            const boardY = nextY + r;

            // Check boundaries
            if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
                return true; // collision with walls or floor
            }

            if (boardY < 0) continue; // allow pieces to be above the board when spawning

            // Check collision with existing pieces on the board
            if (board[boardY][boardX] !== 0) {
                return true; // collision with existing piece
            }
        }
    }
    return false; // no collision detected
}