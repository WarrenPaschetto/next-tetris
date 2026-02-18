import TetrisGame from "./tetris/tetris-game";

export default function Page() {
    return (
        <main style={{ padding: 24 }}>
            <h1>Tetris</h1>
            <TetrisGame />
        </main>
    )
}