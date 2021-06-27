import React, { useEffect, useMemo, useState } from 'react';
import type * as Kernel from 'kernel';
import './App.css';

const Liquids = {
  'gray': '#636466',
  'green': '#2e6337',
  'lime': '#7f9530',
  'blue': '#67a1e0',
  'purple': '#682f8e',
  'azure': '#392ebb',
  'blush': '#d8677b',
  'red': '#b5392d',
  'aqua': '#81d486',
  'brown': '#774b1a',
  'coral': '#db8f51',
  'yellow': '#ecda6c',
  'empty': 'rgba(0,0,0,0)',
};

const LiquidsNames = Object.fromEntries(Object.entries(Liquids).map(([a, b]) => [b, a]));

const data = [
    [
        Liquids['gray'],
        Liquids['green'],
        Liquids['blue'],
        Liquids['lime'],
    ],
    [
        Liquids['red'],
        Liquids['blush'],
        Liquids['green'],
        Liquids['purple'],
    ],
    [
        Liquids['aqua'],
        Liquids['brown'],
        Liquids['gray'],
        Liquids['azure'],
    ],
    [
        Liquids['blue'],
        Liquids['lime'],
        Liquids['blue'],
        Liquids['brown'],
    ],
    [
        Liquids['gray'],
        Liquids['coral'],
        Liquids['coral'],
        Liquids['coral'],
    ],
    [
        Liquids['red'],
        Liquids['lime'],
        Liquids['brown'],
        Liquids['brown'],
    ],
    [
        Liquids['azure'],
        Liquids['yellow'],
        Liquids['red'],
        Liquids['aqua'],
    ],
    [
        Liquids['red'],
        Liquids['yellow'],
        Liquids['coral'],
        Liquids['gray'],
    ],
    [
        Liquids['purple'],
        Liquids['yellow'],
        Liquids['aqua'],
        Liquids['green'],
    ],
    [
        Liquids['purple'],
        Liquids['blue'],
        Liquids['yellow'],
        Liquids['azure'],
    ],
    [
        Liquids['lime'],
        Liquids['azure'],
        Liquids['aqua'],
        Liquids['blush'],
    ],
    [
        Liquids['blush'],
        Liquids['blush'],
        Liquids['green'],
        Liquids['purple'],
    ],
    [
        Liquids['empty'],
        Liquids['empty'],
        Liquids['empty'],
        Liquids['empty'],
    ],
    [
        Liquids['empty'],
        Liquids['empty'],
        Liquids['empty'],
        Liquids['empty'],
    ],
];

const Flasks = ({ flasks }: any) => (
  <>
    {
      flasks.map((flask: any, id: number) => (
        <div key={id}>
          {
            flask.map((liquid: any, lId: number) => <div key={lId} style={{backgroundColor: liquid}} />)
          }
        </div>
      ))
    }
    <br />
    <br />
    <br />
    <br />
  </>
);

const kernelData = data.map((flask) => flask.map((liquid) => {
  let name = LiquidsNames[liquid];
  return name.charAt(0).toUpperCase() + name.slice(1);
}));

const fromKernel = (flasks: string[][]) => flasks.map((flask: string[]) =>
// @ts-ignore
  flask.map((liquid: string): any => Liquids[liquid.toLowerCase()])
);

function App() {
  let [wasm, takeWasm] = useState(null);
  useEffect(() => import('kernel').then(takeWasm as any) as any, []);
  let solution = useMemo(() => {
    if (!wasm) {
      return null;
    }
    return (wasm as any)?.search(kernelData);
  }, [wasm, data]);
  console.log(solution);
  return (
    <div className="App">
      <div><Flasks flasks={data} /></div>
      { solution && (
        solution.map((_: any, id: number) => {
          let flasks = (wasm as any).get_step(kernelData, solution.slice(0, id))
          return <div key={id}><Flasks flasks={fromKernel(flasks)} /></div>;
        })
      ) }
    </div>
  );
}

export default App;
