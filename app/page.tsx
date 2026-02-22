import TetrisGame from "./tetris/tetris-game";

export default function Page() {
    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 24,
            }}
        >
            <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
                <h1 style={{ margin: 0 }}>Tetris</h1>
                <TetrisGame />
            </div>
        </main>
    );
}