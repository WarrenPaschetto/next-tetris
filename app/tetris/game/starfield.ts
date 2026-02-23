export function makeStarfield(width: number, height: number) {
    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const ctx = off.getContext("2d")!;

    // space gradient
    const g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, "#050612");
    g.addColorStop(1, "#0b1024");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    // stars
    const starCount = Math.floor((width * height) / 900); // density
    for (let i = 0; i < starCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;

        // small chance of brighter stars
        const big = Math.random() < 0.08;
        const r = big ? 1.6 + Math.random() * 1.4 : 0.6 + Math.random() * 0.8;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${big ? 0.9 : 0.55})`;
        ctx.fill();

        // subtle colored stars sometimes
        if (big && Math.random() < 0.35) {
            ctx.beginPath();
            ctx.arc(x + 0.5, y + 0.5, r * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${200 + Math.random() * 55}, ${200 + Math.random() * 55}, 255, 0.25)`;
            ctx.fill();
        }
    }

    // faint nebula blobs
    for (let i = 0; i < 6; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const rr = 60 + Math.random() * 140;

        const ng = ctx.createRadialGradient(x, y, 0, x, y, rr);
        ng.addColorStop(0, `rgba(120, 80, 255, 0.10)`);
        ng.addColorStop(1, `rgba(0, 0, 0, 0)`);
        ctx.fillStyle = ng;
        ctx.fillRect(0, 0, width, height);
    }

    return off;
}