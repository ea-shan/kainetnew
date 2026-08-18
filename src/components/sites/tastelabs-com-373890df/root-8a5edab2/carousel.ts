/** Cylinder panel transform for the challenge carousel. */
export function panelTransform(index: number, count: number, radius: number, spin = 0) {
  const angle = (360 / count) * index + spin;
  return `rotateY(${angle}deg) translateZ(${radius}px)`;
}
