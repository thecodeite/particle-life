import { V } from "./V";

export interface Settings {
  seed: number;
  colors: Color[];
}

export class Color {
  name: string;
  rel: Map<string, number>;
  constructor(name: string) {
    this.name = name;
    this.rel = new Map();
  }
}

export interface Dot {
  pos: V;
  vel: V;
  col: Color;
}
