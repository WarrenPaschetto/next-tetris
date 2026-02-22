type RGB = { r: number; g: number; b: number };

function hexToRgb(hex: string): RGB {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map(ch => ch + ch).join("") : h;
    const n = parseInt(full, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function clamp(v: number) {
    return Math.max(0, Math.min(255, v));
}

function rgbToString({ r, g, b }: RGB) {
    return `rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`;
}

function shade(hex: string, amount: number) {
    // amount: -255..255 (negative = darker, positive = lighter)
    const { r, g, b } = hexToRgb(hex);
    return rgbToString({ r: r + amount, g: g + amount, b: b + amount });
}

export function drawBlock(
    ctx: CanvasRenderingContext2D,
    px: number,
    py: number,
    size: number,
    base: string
) {
    // Base gradient (darker bottom-right, lighter top-left)
    const grad = ctx.createLinearGradient(px, py, px + size, py + size);
    grad.addColorStop(0, shade(base, +40));
    grad.addColorStop(0.5, base);
    grad.addColorStop(1, shade(base, -50));

    ctx.fillStyle = grad;
    ctx.fillRect(px, py, size, size);

    // Bevel thickness
    const b = Math.max(2, Math.floor(size * 0.12));

    // Top/left highlight bevel
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + size, py);
    ctx.lineTo(px + size - b, py + b);
    ctx.lineTo(px + b, py + b);
    ctx.lineTo(px + b, py + size - b);
    ctx.lineTo(px, py + size);
    ctx.closePath();
    ctx.fill();

    // Bottom/right shadow bevel
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.moveTo(px + size, py + size);
    ctx.lineTo(px, py + size);
    ctx.lineTo(px + b, py + size - b);
    ctx.lineTo(px + size - b, py + size - b);
    ctx.lineTo(px + size - b, py + b);
    ctx.lineTo(px + size, py);
    ctx.closePath();
    ctx.fill();

    // Inner inset (gives that “block within a block” look)
    const inset = b + 1;
    const innerGrad = ctx.createLinearGradient(px + inset, py + inset, px + size - inset, py + size - inset);
    innerGrad.addColorStop(0, "rgba(255,255,255,0.18)");
    innerGrad.addColorStop(1, "rgba(0,0,0,0.12)");
    ctx.fillStyle = innerGrad;
    ctx.fillRect(px + inset, py + inset, size - inset * 2, size - inset * 2);

    // Gloss highlight stripe near top
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(px + inset, py + inset, size - inset * 2, Math.floor(size * 0.18));

    // Outline
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.strokeRect(px + 0.5, py + 0.5, size - 1, size - 1);
}