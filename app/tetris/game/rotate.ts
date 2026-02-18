import { Shape } from './types';

// Function to rotate a shape 90 degrees clockwise
export function rotateShape(shape: Shape): Shape {
    const col = shape[0].length; // number of columns in the original shape
    const row = shape.length; // number of rows in the original shape
    const rotated: Shape = Array.from({ length: col }, () => Array(row).fill(0)); // create a new shape with swapped dimensions

    for (let r = 0; r < row; r++) {
        for (let c = 0; c < col; c++) {
            rotated[c][row - 1 - r] = shape[r][c]; // rotate the shape by reassigning values
        }
    }

    return rotated; // return the rotated shape
}