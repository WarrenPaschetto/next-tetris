import type { Board, Cell } from "./types";
import { ROWS, COLS } from "./constants";

export function createBoard(rows: number = ROWS, cols: number = COLS): Board {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => 0 as Cell)
    );
}