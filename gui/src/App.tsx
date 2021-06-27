import React, { useEffect, useMemo, useState } from 'react';
import FlasksWidget, { Liquid } from './flasks'
import type { Flask, Flasks } from './flasks';
import type { get_step, search } from 'kernel';
import "antd/dist/antd.css";
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
    import('kernel').then((kernel: Kernel) => {
      takeWasm(kernel);
      setSolution(kernel.search(forSolve));
    });
  }, []);
  const onChange = useMemo(() => (n: Flasks) => {
    setData(n);
    if (wasm) {
      setSolution(wasm.search(n));
    }
  }, [wasm]);
  return (
    <div className="app">
      <h2>{`Шаг ${step}${solution?.length ? `/${solution.length}` : ''}`}</h2>
      <FlasksWidget
        value={step && solution && wasm ? wasm.get_step(forSolve, solution.slice(0, step)) : forSolve}
        onChange={step === 0 ? onChange : undefined}
      />
    </div>
  );
}

export default App;
