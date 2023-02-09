import MersenneTwister from "mersenne-twister";
import { useRef, useEffect } from "react";
import styled from "styled-components";
import { Color, Dot, Settings } from "./types";
import { V } from "./V";

function createDots(seed: number, allColors: Color[]) {
  const mt = new MersenneTwister(seed);
  const rng = () => mt.random();

  const r = (max: number) => Math.floor(rng() * max);
  function pick<T>(arr: T[]): T {
    return arr[r(arr.length)];
  }

  const dots: Dot[] = Array.from({ length: 1000 }, () => {
    return {
      pos: new V(r(500), r(500)),
      vel: new V(0, 0),
      col: pick(allColors),
    };
  });

  return dots;
}

interface SimulationProps {
  settings: Settings;
}

export function Simulation({ settings }: SimulationProps) {
  const canvasRefs = Array.from({ length: 9 }, () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useRef<HTMLCanvasElement>(null),
  );
  const [masterRef, ...allRefs] = canvasRefs;

  const dotsRef = useRef<Dot[]>();

  useEffect(() => {
    dotsRef.current = createDots(settings.seed, settings.colors);
  }, [settings]);

  useEffect(() => {
    const contexts = allRefs.map(r => r.current?.getContext("2d") || null);
    if (masterRef.current) {
      const canvas = masterRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        const handle = setInterval(() => tick(canvas, context, contexts), 50);
        return () => {
          clearTimeout(handle);
        };
      }
    }
  });

  function tick(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    otherContexts: (CanvasRenderingContext2D | null)[],
  ) {
    if (!dotsRef.current) return;
    const dots = dotsRef.current;

    dots.forEach((d1, i) => {
      dots.forEach((d2, j) => {
        if (j <= i) return;
        const diff = d1.pos.diffWrap(d2.pos, canvas.width, canvas.height);
        const delta = diff.length();
        const unit = diff.unit(delta);
        let f1 = 0;
        let f2 = 0;
        if (delta < repulse) {
          f1 = (repulse - delta) / 1000;
          f2 = (-repulse - delta) / 1000;
        } else if (delta < 100) {
          const rel1 = d1.col.rel.get(d2.col.name);
          const rel2 = d2.col.rel.get(d1.col.name);
          if (rel1 && rel2) {
            f1 = (delta * rel1) / 1000;
            f2 = (-delta * rel2) / 1000;
          }
        }
        d1.vel = d1.vel.add(unit.scale(f1));
        d2.vel = d2.vel.add(unit.scale(f2));
      });
    });

    context.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(d => {
      context.fillStyle = d.col.name;
      context.beginPath();
      context.arc(d.pos.x, d.pos.y, 2, 0, 2 * Math.PI);
      context.fill();

      const end = d.pos.add(d.vel);
      line(context, d.pos, end);
    });

    otherContexts.forEach((otherCtx, i) => {
      otherCtx?.clearRect(0, 0, canvas.width, canvas.height);
      otherCtx?.drawImage(canvas, 0, 0);
    });

    dots.forEach(d => {
      d.pos = d.pos.add(d.vel).limit(canvas.width, canvas.height);
      d.vel = d.vel.scale(0.7);
    });
  }

  return (
    <CanvasWrapper>
      <Canvas width="500" height="500" ref={masterRef} />
      <CanvasCopy width="500" height="500" ref={allRefs[0]} top="-1000px" />
      <CanvasCopy
        width="500"
        height="500"
        ref={allRefs[1]}
        top="-1000px"
        right="-1000px"
      />
      <CanvasCopy width="500" height="500" ref={allRefs[2]} right="-1000px" />
      <CanvasCopy
        width="500"
        height="500"
        ref={allRefs[3]}
        bottom="-1000px"
        right="-1000px"
      />
      <CanvasCopy width="500" height="500" ref={allRefs[4]} bottom="-1000px" />
      <CanvasCopy
        width="500"
        height="500"
        ref={allRefs[5]}
        bottom="-1000px"
        left="-1000px"
      />
      <CanvasCopy width="500" height="500" ref={allRefs[6]} left="-1000px" />
      <CanvasCopy
        width="500"
        height="500"
        ref={allRefs[7]}
        top="-1000px"
        left="-1000px"
      />
      {/* {allRefs.map(ref => (
        <canvas width="500" height="500" ref={ref} />
      ))} */}
    </CanvasWrapper>
  );
}

const Canvas = styled.canvas`
  position: absolute;
  margin: auto;
  height: 500px;
  width: 500px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
const CanvasCopy = styled.canvas<{
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}>`
  position: absolute;
  margin: auto;
  height: 500px;
  width: 500px;
  top: ${p => p.top ?? "0"};
  bottom: ${p => p.bottom ?? "0"};
  left: ${p => p.left ?? "0"};
  right: ${p => p.right ?? "0"};
`;
const CanvasWrapper = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
`;

function line(ctx: CanvasRenderingContext2D, start: V, end: V) {
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  const x = end.x;
  ctx.lineTo(x, end.y);
  ctx.stroke();
}

const repulse = 24;
