import type { Piece, Shape } from "./types";

// Define the 7 standard Tetris pieces as 2D arrays (shapes)
const O: Shape = [
    [1, 1],
    [1, 1],
];



export function spawnPiece(): Piece {
    // For now, we'll just spawn the O piece in the middle top of the board
    return {
        shape: O,
        x: 4, // middle of a 10-column board
        y: 0, // top row
        id: 1, // using 1 to represent the O piece for now
    };
}

