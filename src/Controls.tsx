import React, { useState } from "react";
import { Settings } from "./types";
import styled from "styled-components";
import { createColours } from "./createColours";

export function Controls({
  settings,
  setSettings,
}: {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}) {
  const [seed, setSeed] = useState(`${settings.seed}`);
  const [colSeed, setColSeed] = useState(`${settings.seed}`);
  const apply = () => {
    setSettings({
      ...settings,
      seed: parseInt(seed),
    });
  };

  const { colors } = settings;

  const mapToColor = (scale: number | undefined) => {
    if (!scale) return `hsl(50deg, 100%, 50%)`;
    const hue = (scale + 1) * 50;
    return `hsl(${hue.toFixed(2)}deg, 100%, 50%)`;
  };

  const randCol = () => {
    const colors = createColours(parseInt(colSeed));

    setSettings({
      ...settings,
      colors,
    });
  };

  return (
    <details>
      <summary>⚙️</summary>
      <Label>
        seed
        <input value={seed} onChange={e => setSeed(e.target.value)} />
        <span>{settings.seed}</span>
      </Label>
      <button onClick={() => apply()}>Apply</button>

      {colors.map((c, i) => (
        <Label>
          C[{i}]
          <input value={c.name} onChange={e => setSeed(e.target.value)} />
        </Label>
      ))}

      <Matrix columns={colors.length + 1}>
        <div />
        {colors.map((c, i) => (
          <MatrixHead color={c.name}>{i}</MatrixHead>
        ))}
        {colors.map((c1, i) => (
          <>
            <MatrixHead color={c1.name}>{i}</MatrixHead>
            {colors.map((c2, j) => (
              <MatrixCell color={mapToColor(c1.rel.get(c2.name))}>
                {c1.rel.get(c2.name)?.toFixed(2)}
              </MatrixCell>
            ))}
          </>
        ))}
      </Matrix>

      <Label>
        color seed
        <input value={colSeed} onChange={e => setColSeed(e.target.value)} />
        <span>{colSeed}</span>
      </Label>
      <button onClick={() => randCol()}>Random Colours</button>
    </details>
  );
}

const Label = styled.label`
  display: block;
`;

const Matrix = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${p => p.columns}, 1fr);
  font-family: monospace;
`;
const MatrixHead = styled.div<{ color: string }>`
  background-color: ${p => p.color};
`;
const MatrixCell = styled.div<{ color: string }>`
  background-color: ${p => p.color};
  display: flex;
  justify-content: end;
`;
