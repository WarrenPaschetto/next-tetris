import type { Board, Piece, Cell } from "./types";

type MergeResult = {
    board: Board;
    linesCleared: number;
    cellsRemoved: number;   // total cells deleted (row clears)
    scoreDelta: number;     // how much to add to score this merge
};

export function merge(
    board: Board,
    piece: Piece,
    pointsPerCell = 1
): MergeResult {
    // 1) Copy board
    const next: Board = board.map(row => [...row]) as Board;

    // 2) Paint entire piece onto the copied board
    for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c] === 0) continue;

            const y = piece.y + r;
            const x = piece.x + c;

            if (y < 0) continue;

            // Optional safety guard
            if (y >= next.length || x < 0 || x >= next[0].length) continue;

            next[y][x] = piece.id as Cell;
        }
    }

    // 3) Clear full lines in one pass
    const width = next[0].length;

    const keptRows = next.filter(row => row.some(cell => cell === 0)) as Board;
    const linesCleared = next.length - keptRows.length;

    const emptyRow = () => Array(width).fill(0) as Cell[];
    for (let i = 0; i < linesCleared; i++) {
        keptRows.unshift(emptyRow());
    }

    const cellsRemoved = linesCleared * width;
    const scoreDelta = cellsRemoved * pointsPerCell;

    return { board: keptRows, linesCleared, cellsRemoved, scoreDelta };
}