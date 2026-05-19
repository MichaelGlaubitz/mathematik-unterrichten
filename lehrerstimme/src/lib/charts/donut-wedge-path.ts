/** Winkel in Radiant (0 oben, im Uhrzeigersinn). */
function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  return {
    x: cx + r * Math.sin(angle),
    y: cy - r * Math.cos(angle),
  };
}

export function donutWedgePath(
  cx: number,
  cy: number,
  r: number,
  inner: number,
  startAngle: number,
  endAngle: number,
): string {
  const p1 = polarToCartesian(cx, cy, r, startAngle);
  const p2 = polarToCartesian(cx, cy, r, endAngle);
  const p3 = polarToCartesian(cx, cy, inner, endAngle);
  const p4 = polarToCartesian(cx, cy, inner, startAngle);
  const large = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${inner} ${inner} 0 ${large} 0 ${p4.x} ${p4.y}`,
    "Z",
  ].join(" ");
}
