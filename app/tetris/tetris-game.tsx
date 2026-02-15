"use client";

import { useEffect, useRef, useState } from "react";
import { CELL, COLS, ROWS } from "./game/constants";
import { createBoard } from "./game/board";
import type { Board, Cell } from "./game/types";

export default function TetrisGame() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [board, setBoard] = useState<Board>(() => createBoard()); // () => createBoard() ensures the board is only created once on first render

    // quick test: paint a few cells once so you know drawing works
    useEffect(() => {
        setBoard((prev) => {
            const next: Board = prev.map((row) => [...row]) as Board; // deep copy
            next[34][0] = 1 as Cell;
            next[34][1] = 2 as Cell;
            next[33][0] = 3 as Cell;
            next[33][1] = 4 as Cell;
            return next;
        });
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // draw background
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw filled cells from board
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                const cell = board[y][x];
                if (cell !== 0) {
                    ctx.fillStyle = "#4ade80"; // temporary single color for testing
                    ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
                }
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
    }, [board]);

    return (
        <canvas
            ref={canvasRef}
            width={COLS * CELL}
            height={ROWS * CELL}
            style={{ border: "1px solid #333", borderRadius: 8 }}
        />
    );
}