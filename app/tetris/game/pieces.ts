import type { Piece, Shape } from "./types";

// Define the 7 standard Tetris pieces as 2D arrays (shapes)
const O: Shape = [
    [1, 1],
    [1, 1],
];

const I: Shape = [
    [1, 1, 1, 1],
];

const T: Shape = [
    [0, 1, 0],
    [1, 1, 1],
];

const S: Shape = [
    [0, 1, 1],
    [1, 1, 0],
];

const Z: Shape = [
    [1, 1, 0],
    [0, 1, 1],
];

const J: Shape = [
    [1, 0, 0],
    [1, 1, 1],
];

const L: Shape = [
    [0, 0, 1],
    [1, 1, 1],
];

// Function to spawn a new piece at the top of the board
export function spawnPiece(): Piece {
    // Randomly select a piece from the available shapes
    const shapes = [O, I, T, S, Z, J, L] as const; // 'as const' ensures the array is treated as a tuple of specific types
    type PieceId = 1 | 2 | 3 | 4 | 5 | 6; // Define a type for piece IDs corresponding to the shapes
    const randomIndex = Math.floor(Math.random() * shapes.length) as PieceId; // Random index to select a shape, cast to PieceId for type safety

    return {
        shape: shapes[randomIndex], // select the shape based on the random index
        x: 4, // middle of a 10-column board
        y: 0, // top row
        id: (randomIndex + 1) as PieceId, // Assign an ID to the piece (1-7) based on the index, cast to PieceId for type safety
    };
}

