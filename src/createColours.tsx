import MersenneTwister from "mersenne-twister";
import { Color } from "./types";

export function createColours(seed: number) {
  const mt = new MersenneTwister(seed);
  const rng = () => mt.random();

  const allColors = [
    new Color("red"),
    new Color("green"),
    new Color("orange"),
    new Color("blue"),
    // new Color('white'),
    new Color("hotpink"),
    // new Color('slategrey'),
    // new Color('rebeccapurple'),
  ];

  allColors.forEach(c1 => {
    allColors.forEach(c2 => {
      c1.rel.set(c2.name, (rng() - 0.5) * 2);
    });
  });

  return allColors;
}
