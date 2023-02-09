import React, { useState } from "react";
import styled from "styled-components";
import { Controls } from "./Controls";
import { createColours } from "./createColours";
import { Simulation } from "./Simulation";
import { Settings } from "./types";

function App() {
  const [settings, setSettings] = useState<Settings>({
    seed: 2,
    colors: createColours(2),
  });

  return (
    <AppWrapper>
      <SimulationWrapper>
        <Simulation settings={settings} />
      </SimulationWrapper>

      <ControlsWrapper>
        <Controls settings={settings} setSettings={setSettings} />
      </ControlsWrapper>
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  position: relative;
  height: 100vh;
`;
const ControlsWrapper = styled.div`
  top: 0;
  left: 0;
  width: 300px;
  height: 100vh;
  z-index: 1;
`;
const SimulationWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  mouse-events: none;
  z-index: -1;
`;

export default App;
