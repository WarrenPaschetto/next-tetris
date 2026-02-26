export function makeStarfield(width: number, height: number) {
    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const ctx = off.getContext("2d")!;
    if (!ctx) return off;

    // --- Base deep-space gradient ---
    const base = ctx.createLinearGradient(0, 0, 0, height);
    base.addColorStop(0, "#030612");
    base.addColorStop(0.45, "#070b1d");
    base.addColorStop(1, "#02040d");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    // --- Soft colored nebula glows (subtle) ---
    const nebulae = [
        { x: width * 0.22, y: height * 0.35, r: width * 0.38, color: "rgba(90, 70, 180, 0.10)" },
        { x: width * 0.72, y: height * 0.55, r: width * 0.42, color: "rgba(50, 90, 190, 0.08)" },
        { x: width * 0.45, y: height * 0.82, r: width * 0.30, color: "rgba(120, 60, 160, 0.06)" },
    ];

    for (const n of nebulae) {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, n.color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
    }

    // --- Sparse stars (fewer, more realistic) ---
    const starCount = Math.floor((width * height) / 2400);
    for (let i = 0; i < starCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const bright = Math.random() < 0.12;
        const r = bright ? 1.5 + Math.random() * 1.2 : 0.4 + Math.random() * 0.7;
        const alpha = bright ? 0.85 : 0.35 + Math.random() * 0.25;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
    }

    // --- Very faint dust speckles ---
    const dustCount = Math.floor((width * height) / 9000);
    for (let i = 0; i < dustCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.fillStyle = `rgba(180, 200, 255, ${0.03 + Math.random() * 0.04})`;
        ctx.fillRect(x, y, 1, 1);
    }

    // --- Inner panel glow (makes center slightly brighter) ---
    const innerGlow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        width * 0.08,
        width * 0.5,
        height * 0.5,
        width * 0.75
    );
    innerGlow.addColorStop(0, "rgba(80, 100, 180, 0.08)");
    innerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = innerGlow;
    ctx.fillRect(0, 0, width, height);

    // --- Edge vignette (darkens edges, focuses center) ---
    const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        width * 0.25,
        width * 0.5,
        height * 0.5,
        width * 0.85
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.42)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // --- Subtle glassy vertical sheen ---
    const sheen = ctx.createLinearGradient(0, 0, width, 0);
    sheen.addColorStop(0, "rgba(255,255,255,0.015)");
    sheen.addColorStop(0.18, "rgba(255,255,255,0.035)");
    sheen.addColorStop(0.4, "rgba(255,255,255,0.01)");
    sheen.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, width, height);

    // --- Subtle border glow inside the playfield ---
    ctx.strokeStyle = "rgba(120, 150, 255, 0.08)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    return off;
}