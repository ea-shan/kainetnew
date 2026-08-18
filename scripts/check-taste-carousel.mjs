import assert from "node:assert/strict";

function panelTransform(index, count, radius, spin = 0) {
  const angle = (360 / count) * index + spin;
  return `rotateY(${angle}deg) translateZ(${radius}px)`;
}

assert.equal(panelTransform(0, 12, 256), "rotateY(0deg) translateZ(256px)");
assert.equal(panelTransform(3, 12, 256), "rotateY(90deg) translateZ(256px)");
assert.equal(panelTransform(0, 12, 256, 45), "rotateY(45deg) translateZ(256px)");
console.log("ok carousel math");
