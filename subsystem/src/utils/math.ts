export const sigmoid = (x: number) =>
  x >= 0 ? 1 / (1 + Math.exp(-x)) : Math.exp(x) / (1 + Math.exp(x));

export const centroid = (lm: any[]) => {
  let x = 0,
    y = 0,
    z = 0;

  for (const l of lm) {
    x += l.x;
    y += l.y;
    z += l.z ?? 0;
  }

  return [x / lm.length, y / lm.length, z / lm.length];
};

export const norm = (v: number[]) => Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);