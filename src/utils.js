export function roundWithPrecision(v) {
  return Math.round(v * 10000) / 10000;
}

export function getDistanceBetweenPoints(a, b) {
  return roundWithPrecision(
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
  );
}
