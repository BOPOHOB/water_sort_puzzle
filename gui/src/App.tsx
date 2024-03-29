import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'antd';
import { DoubleLeftOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import FlasksWidget, { Liquid, isValidFlasks } from './flasks'
import type { Flask, Flasks } from './flasks';
import type { get_step, search } from 'kernel';
import kernel from 'kernel';
import "antd/dist/reset.css";
import './App.css';

type Kernel = { get_step: typeof get_step, search: typeof search };

const data = [
    [
      Liquid.Gray,
      Liquid.Green,
      Liquid.Blue,
      Liquid.Lime,
    ] as Flask,
    [
      Liquid.Red,
      Liquid.Blush,
      Liquid.Green,
      Liquid.Purple,
    ] as Flask,
    [
      Liquid.Aqua,
      Liquid.Brown,
      Liquid.Gray,
      Liquid.Azure,
    ] as Flask,
    [
      Liquid.Blue,
      Liquid.Lime,
      Liquid.Blue,
      Liquid.Brown,
    ] as Flask,
    [
      Liquid.Gray,
      Liquid.Coral,
      Liquid.Coral,
      Liquid.Coral,
    ] as Flask,
    [
      Liquid.Red,
      Liquid.Lime,
      Liquid.Brown,
      Liquid.Brown,
    ] as Flask,
    [
      Liquid.Azure,
      Liquid.Yellow,
      Liquid.Red,
      Liquid.Aqua,
    ] as Flask,
    [
      Liquid.Red,
      Liquid.Yellow,
      Liquid.Coral,
      Liquid.Gray,
    ] as Flask,
    [
      Liquid.Purple,
      Liquid.Yellow,
      Liquid.Aqua,
      Liquid.Green,
    ] as Flask,
    [
      Liquid.Purple,
      Liquid.Blue,
      Liquid.Yellow,
      Liquid.Azure,
    ] as Flask,
    [
      Liquid.Lime,
      Liquid.Azure,
      Liquid.Aqua,
      Liquid.Blush,
    ] as Flask,
    [
      Liquid.Blush,
      Liquid.Blush,
      Liquid.Green,
      Liquid.Purple,
    ] as Flask,
    [
      Liquid.Empty,
      Liquid.Empty,
      Liquid.Empty,
      Liquid.Empty,
    ] as Flask,
    [
      Liquid.Empty,
      Liquid.Empty,
      Liquid.Empty,
      Liquid.Empty,
    ] as Flask,
];


function App() {
  const [forSolve, setData] = useState(data);
  const [step, setStep] = useState(0);
  const [solution, setSolution] = useState<null | [number, number][]>(null);

  useEffect(() => {
    const changeStep = ({ key }: { key: string }) => {
      if (key === 'ArrowLeft') {
        setStep(Math.max(step - 1, 0));
      }
      if (key === 'ArrowRight') {
        setStep(Math.min(step + 1, solution?.length || 0));
      }
    };
    document.addEventListener('keydown', changeStep);
    return () => { document.removeEventListener('keydown', changeStep)};
  }, [step, solution?.length]);
  const [wasm, takeWasm] = useState<Kernel | null>(null);
  useEffect(() => {
    kernel().then((module: Kernel) => {
      console.log(forSolve, forSolve.length, Array.isArray(forSolve));
      module.search(forSolve);
      console.log(forSolve, forSolve.length, Array.isArray(forSolve));
      takeWasm(module);
    });
  }, []);
  const [undecidable, setUndecidable] = useState(false);
  const onChange = useMemo(() => (n: Flasks) => {
    setData(n);
    if (wasm && isValidFlasks(n)) {
      const newSolution = wasm.search(n);
      setSolution(newSolution);
      setUndecidable(newSolution === null);
    } else {
      setSolution(null);
      if (undecidable) {
        setUndecidable(false);
      }
    }
  }, [wasm, undecidable]);
  const buttons = useMemo(() => ({
    first: () => setStep(0),
    prew: () => setStep(s => s - 1),
    next: () => setStep(s => s + 1),
  }), []);
  return (
    <div className="app">
      {
        undecidable ? (
          <h2>Puzzle have not solution</h2>
        ) : (
          solution === null ? (
            <h2>Complete the puzzle</h2>
          ) : (
            <h2>{`Step ${step}${solution?.length ? `/${solution.length}` : ''}`}</h2>
          )
        )
      }
      <FlasksWidget
        value={step && solution && wasm ? wasm.get_step(forSolve, solution.slice(0, step)) : forSolve}
        onChange={step === 0 ? onChange : undefined}
      />
      <div className="buttons">
        <Button icon={<DoubleLeftOutlined />} onClick={buttons.first} disabled={step === 0 || !solution} />
        <Button icon={<LeftOutlined />} onClick={buttons.prew} disabled={step === 0 || !solution} />
        <Button icon={<RightOutlined />} onClick={buttons.next} disabled={step === solution?.length || !solution} />
      </div>
    </div>
  );
}

export default App;
