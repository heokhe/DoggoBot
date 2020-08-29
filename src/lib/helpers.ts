export type Bounds = [number, number];

export const round = (x: number, s: number) => {
  if (x < 0) return Math.floor(x / s) * s;
  return Math.ceil(x / s) * s;
};
