/** Geschlossener Vollring (Donut), `fill-rule="evenodd"` verwenden. */
export function fullDonutPath(cx: number, cy: number, ro: number, ri: number): string {
  return [
    `M ${cx} ${cy - ro}`,
    `A ${ro} ${ro} 0 1 1 ${cx} ${cy + ro}`,
    `A ${ro} ${ro} 0 1 1 ${cx} ${cy - ro}`,
    `Z M ${cx} ${cy - ri}`,
    `A ${ri} ${ri} 0 1 0 ${cx} ${cy + ri}`,
    `A ${ri} ${ri} 0 1 0 ${cx} ${cy - ri}`,
    "Z",
  ].join(" ");
}
