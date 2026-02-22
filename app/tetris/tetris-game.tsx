"use client";

import { useEffect, useRef, useState } from "react";
import { CELL, COLS, ROWS, PIECE_COLORS } from "./game/constants";
import { createBoard } from "./game/board";
import type { Board, Cell } from "./game/types";
import { spawnPiece } from "./game/pieces";
import { collides } from "./game/collision";
import { merge } from "./game/merge";
import { rotateShape } from "./game/rotate";
import { drawBlock } from "./game/draw-block";

export default function TetrisGame() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [board, setBoard] = useState<Board>(() => createBoard()); // () => createBoard() ensures the board is only created once on first render
    const [piece, setPiece] = useState(() => spawnPiece()); // spawn the first piece
    const [speed, setSpeed] = useState(250); // initial speed (ms per drop)
    const [score, setScore] = useState(0);

    // Block certain keys from scrolling the page when the game is focused
    const BLOCKED_KEYS = new Set([
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        " ",        // Spacebar
    ]);

    // Game loop: move piece down on an interval determined by `speed`
    useEffect(() => {
        const id = setInterval(() => {
            setPiece((prev) => {
                const nextY = prev.y + 1;

                // if moving down collides, lock and spawn new piece
                if (collides(board, prev, prev.x, nextY)) {
                    setBoard((b) => {
                        const result = merge(b, prev, 1); // 1 point per cell removed
                        setScore((s) => s + result.scoreDelta);
                        return result.board;
                    });
                    return spawnPiece(); // spawn new piece
                }

                // otherwise, just move piece down
                return { ...prev, y: nextY };
            });
        }, speed);

        return () => clearInterval(id);
    }, [board, speed]);

    // Handle user input for moving left/right, rotating, and soft drop
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (BLOCKED_KEYS.has(e.key)) e.preventDefault(); // prevent arrow keys and spacebar from scrolling the page

            if (e.key === "ArrowLeft") {
                setPiece((prev) => {
                    const nextX = prev.x - 1;
                    if (!collides(board, prev, nextX, prev.y)) {
                        return { ...prev, x: nextX };
                    }
                    return prev;
                });
            } else if (e.key === "ArrowRight") {
                setPiece((prev) => {
                    const nextX = prev.x + 1;
                    if (!collides(board, prev, nextX, prev.y)) {
                        return { ...prev, x: nextX };
                    }
                    return prev;
                });
            } else if (e.key === "ArrowUp") {   // rotate piece
                setPiece((prev) => {
                    const rotatedShape = rotateShape(prev.shape);
                    const rotatedPiece = { ...prev, shape: rotatedShape };

                    // Check if the rotated piece collides at the current position
                    if (!collides(board, rotatedPiece, prev.x, prev.y)) {
                        return rotatedPiece; // If no collision, update to the rotated piece
                    }
                    return prev; // Otherwise, keep the original piece
                });
            } else if (e.key === "ArrowDown") { // start soft drop
                setSpeed(50); // faster interval while key is held
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (BLOCKED_KEYS.has(e.key)) e.preventDefault();
            if (e.key === "ArrowDown") {
                setSpeed(250); // restore normal speed
            }
        };

        window.addEventListener("keydown", handleKeyDown, { passive: false }); // passive: false allows us to call e.preventDefault() in the handler
        window.addEventListener("keyup", handleKeyUp, { passive: false });
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
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
                const v = board[y][x] as Cell; // cast to Cell type for better readability
                if (v !== 0) {
                    const color = PIECE_COLORS[v] || "#9ca3af"; // get color for the cell value, default to gray if not found
                    drawBlock(ctx, x * CELL, y * CELL, CELL, color); // draw the block with the appropriate color
                }
            }
        }

        // draw the current falling piece on top
        for (let r = 0; r < piece.shape.length; r++) {
            for (let c = 0; c < piece.shape[r].length; c++) {
                if (piece.shape[r][c] === 0) continue;

                const x = (piece.x + c) * CELL;
                const y = (piece.y + r) * CELL;

                const color = PIECE_COLORS[piece.id] || "#9ca3af"; // get color for the piece ID, default to gray if not found
                drawBlock(ctx, x, y, CELL, color); // draw the block with the appropriate color
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
        <div style={{ display: "grid", gap: 12 }}>
            {/* show score */}
            <div style={{ color: "black", fontFamily: "system-ui", fontSize: 16 }}>
                Score: <strong>{score}</strong>
            </div>

            <canvas
                ref={canvasRef}
                width={COLS * CELL}
                height={ROWS * CELL}
                style={{ border: "1px solid #333", borderRadius: 8 }}
            />
        </div>
    );
}