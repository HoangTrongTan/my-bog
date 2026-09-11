import { FoodItem } from '../../services/food-ai.service';

/**
 * Pure canvas rendering for the lucky food wheel. Extracted out of
 * FoodWheelComponent so the component only owns state/physics/gestures,
 * not pixel-drawing details.
 */
export function drawFoodWheel(
  canvas: HTMLCanvasElement,
  dishes: FoodItem[],
  currentAngle: number,
  pointerColor: string
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const size = canvas.width;
  const center = size / 2;
  const outerRadius = size / 2 - 15;
  const innerRadius = Math.round(size * 0.08); // Responsive inner radius
  const count = dishes.length;
  if (count === 0) return;

  ctx.clearRect(0, 0, size, size);

  const sliceAngle = (2 * Math.PI) / count;

  // 1. Draw Outer Glow Ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, outerRadius + 8, 0, 2 * Math.PI);
  ctx.strokeStyle = pointerColor;
  ctx.lineWidth = 6;
  ctx.shadowColor = pointerColor;
  ctx.shadowBlur = 15;
  ctx.stroke();
  ctx.restore();

  // 2. Draw Slices
  for (let i = 0; i < count; i++) {
    const item = dishes[i];
    const startAngle = currentAngle + i * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, outerRadius, startAngle, endAngle);
    ctx.closePath();

    // Gradient Fill for Premium Aesthetic
    const midAngle = startAngle + sliceAngle / 2;
    const gradX = center + Math.cos(midAngle) * outerRadius;
    const gradY = center + Math.sin(midAngle) * outerRadius;
    const grad = ctx.createLinearGradient(center, center, gradX, gradY);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(0.4, item.color || '#3b82f6');
    grad.addColorStop(1, adjustBrightness(item.color || '#3b82f6', -30));

    ctx.fillStyle = grad;
    ctx.fill();

    // Slice Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Dish Text + Emoji
    ctx.translate(center, center);
    ctx.rotate(midAngle);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    const fontSize = Math.max(11, Math.round(outerRadius * 0.062));
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;

    // Truncate long dish name
    const maxTextLen = size < 400 ? 11 : 14;
    const displayName = item.name.length > maxTextLen ? item.name.substring(0, maxTextLen) + '...' : item.name;
    const textOffset = outerRadius - Math.round(outerRadius * 0.08);
    ctx.fillText(`${item.emoji || '🍲'} ${displayName}`, textOffset, fontSize / 3);

    ctx.restore();
  }

  // 3. Draw Center Hub Cap
  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, innerRadius, 0, 2 * Math.PI);
  const hubGrad = ctx.createRadialGradient(center, center, 5, center, center, innerRadius);
  hubGrad.addColorStop(0, '#ffffff');
  hubGrad.addColorStop(0.7, '#0f172a');
  hubGrad.addColorStop(1, '#020617');
  ctx.fillStyle = hubGrad;
  ctx.shadowColor = pointerColor;
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.strokeStyle = pointerColor;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Center Emoji or Icon
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${Math.round(innerRadius * 0.6)}px sans-serif`;
  ctx.fillText('🍱', center, center);
  ctx.restore();
}

/**
 * Color brightness helper (hex string in/out).
 */
export function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
