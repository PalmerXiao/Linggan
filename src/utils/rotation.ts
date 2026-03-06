export function getNextIndex(
  current: number,
  length: number,
  mode: "sequential" | "random"
): number {
  if (length === 0) return 0;
  if (mode === "sequential") {
    return (current + 1) % length;
  }
  let next = current;
  if (length === 1) return current;
  while (next === current) {
    next = Math.floor(Math.random() * length);
  }
  return next;
}

