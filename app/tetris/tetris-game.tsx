"use client";

import { useEffect, useRef, useState } from "react";
import { CELL, COLS, ROWS, PIECE_COLORS } from "./game/constants";
import { createBoard } from "./game/board";
import type { Board, Piece } from "./game/types";
import { spawnPiece } from "./game/pieces";
import { collides } from "./game/collision";
import { merge } from "./game/merge";
import { rotateShape } from "./game/rotate";
import { drawBlock } from "./game/draw-block";

const BLOCKED_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "]);

const canDraw = (img?: HTMLImageElement) =>
    !!img && img.complete && img.naturalWidth > 0;

export default function TetrisGame() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [board, setBoard] = useState<Board>(() => createBoard());
    const [piece, setPiece] = useState<Piece>(() => spawnPiece());
    const [speed, setSpeed] = useState(250);
    const [score, setScore] = useState(0);

    // Keep latest state in refs so interval + key handlers never go stale
    const boardRef = useRef(board);
    const pieceRef = useRef(piece);
    useEffect(() => {
        boardRef.current = board;
    }, [board]);
    useEffect(() => {
        pieceRef.current = piece;
    }, [piece]);

    // Sprites
    const spritesRef = useRef<Record<number, HTMLImageElement>>({});
    const spritesReadyRef = useRef(false);

    useEffect(() => {
        let cancelled = false;

        const ids = [1, 2, 3, 4, 5, 6, 7];
        const images: Record<number, HTMLImageElement> = {};
        let done = 0;

        ids.forEach((id) => {
            const img = new Image();
            img.src = `/sprites/${id}.png`;

            img.onload = () => {
                done++;
                images[id] = img;
                if (!cancelled && done === ids.length) {
                    spritesRef.current = images;
                    spritesReadyRef.current = true;
                }
            };

            img.onerror = () => {
                done++;
                // IMPORTANT: don't store broken images
                if (!cancelled && done === ids.length) {
                    spritesRef.current = images; // only the ones that loaded
                    spritesReadyRef.current = true;
                }
            };
        });

        return () => {
            cancelled = true;
        };
    }, []);

    // Game loop
    useEffect(() => {
        const id = window.setInterval(() => {
            const b = boardRef.current;
            setPiece((prev) => {
                const nextY = prev.y + 1;

                if (collides(b, prev, prev.x, nextY)) {
                    setBoard((currentBoard) => {
                        const result = merge(currentBoard, prev, 1); // 1 point per removed cell
                        setScore((s) => s + result.scoreDelta);
                        return result.board;
                    });
                    return spawnPiece();
                }

                return { ...prev, y: nextY };
            });
        }, speed);

        return () => window.clearInterval(id);
    }, [speed]);

    // Input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (BLOCKED_KEYS.has(e.key)) e.preventDefault();

            const b = boardRef.current;

            if (e.key === "ArrowLeft") {
                setPiece((prev) => {
                    const nextX = prev.x - 1;
                    if (!collides(b, prev, nextX, prev.y)) return { ...prev, x: nextX };
                    return prev;
                });
            } else if (e.key === "ArrowRight") {
                setPiece((prev) => {
                    const nextX = prev.x + 1;
                    if (!collides(b, prev, nextX, prev.y)) return { ...prev, x: nextX };
                    return prev;
                });
            } else if (e.key === "ArrowUp") {
                setPiece((prev) => {
                    const rotatedShape = rotateShape(prev.shape);
                    const rotatedPiece = { ...prev, shape: rotatedShape };
                    if (!collides(b, rotatedPiece, prev.x, prev.y)) return rotatedPiece;
                    return prev;
                });
            } else if (e.key === "ArrowDown") {
                setSpeed(50);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (BLOCKED_KEYS.has(e.key)) e.preventDefault();
            if (e.key === "ArrowDown") setSpeed(250);
        };

        window.addEventListener("keydown", handleKeyDown, { passive: false });
        window.addEventListener("keyup", handleKeyUp, { passive: false });

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    // Draw
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // background
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const sprites = spritesRef.current;

        // board
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                const v = board[y][x];
                if (v === 0) continue;

                const img = sprites[v];
                if (spritesReadyRef.current && canDraw(img)) {
                    ctx.drawImage(img, x * CELL, y * CELL, CELL, CELL);
                } else {
                    drawBlock(ctx, x * CELL, y * CELL, CELL, PIECE_COLORS[v] ?? "#9ca3af");
                }
            }
        }

        // falling piece
        const img = sprites[piece.id];
        for (let r = 0; r < piece.shape.length; r++) {
            for (let c = 0; c < piece.shape[r].length; c++) {
                if (piece.shape[r][c] === 0) continue;

                const dx = (piece.x + c) * CELL;
                const dy = (piece.y + r) * CELL;

                if (spritesReadyRef.current && canDraw(img)) {
                    ctx.drawImage(img, dx, dy, CELL, CELL);
                } else {
                    drawBlock(ctx, dx, dy, CELL, PIECE_COLORS[piece.id] ?? "#9ca3af");
                }
            }
        }

        // grid lines (optional)
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
            <div style={{ color: "#e5e7eb", fontFamily: "system-ui", fontSize: 16 }}>
                Score: <strong>{score}</strong>
            </div>

            <canvas
                ref={canvasRef}
                width={COLS * CELL}
                height={ROWS * CELL}
                style={{ border: "1px solid #333", borderRadius: 8, display: "block" }}
            />
        </div>
    );
}