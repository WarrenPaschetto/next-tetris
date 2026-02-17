"use client";

import { useEffect, useRef, useState } from "react";
import { CELL, COLS, ROWS } from "./game/constants";
import { createBoard } from "./game/board";
import type { Board, Cell } from "./game/types";
import { spawnPiece } from "./game/pieces";
import { collides } from "./game/collision";
import { merge } from "./game/merge";

export default function TetrisGame() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [board, setBoard] = useState<Board>(() => createBoard()); // () => createBoard() ensures the board is only created once on first render
    const [piece, setPiece] = useState(() => spawnPiece()); // spawn the first piece

    // Game loop: move piece down every 500ms
    useEffect(() => {
        const id = setInterval(() => {
            setPiece((prev) => {
                const nextY = prev.y + 1;

                // if moving down collides, lock and spawn new piece
                if (collides(board, prev, prev.x, nextY)) {
                    setBoard((b) => merge(b, prev)); // lock piece into board
                    return spawnPiece(); // spawn new piece
                }

                // otherwise, just move piece down
                return { ...prev, y: nextY };
            });
        }, 250);

        return () => clearInterval(id);
    }, [board]);

    // draw loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // draw background
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw board...
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (board[y][x] !== 0) {
                    ctx.fillStyle = "#4ade80";
                    ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
                }
            }
        }

        // draw the current falling piece on top
        ctx.fillStyle = "#60a5fa"; // temporary color for the piece
        for (let r = 0; r < piece.shape.length; r++) {
            for (let c = 0; c < piece.shape[r].length; c++) {
                if (piece.shape[r][c] === 0) continue;

                const x = (piece.x + c) * CELL;
                const y = (piece.y + r) * CELL;

                ctx.fillRect(x, y, CELL, CELL);
            }
        }

        // draw grid lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        for (let x = 0; x <= COLS; x++) {
            ctx.beginPath();
            ctx.moveTo(x * CELL, 0);
            ctx.lineTo(x * CELL, ROWS * CELL);
            ctx.stroke();
        }

        for (let y = 0; y <= ROWS; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * CELL);
            ctx.lineTo(COLS * CELL, y * CELL);
            ctx.stroke();
        }
    }, [board, piece]);

    return (
        <canvas
            ref={canvasRef}
            width={COLS * CELL}
            height={ROWS * CELL}
            style={{ border: "1px solid #333", borderRadius: 8 }}
        />
    );
}