import React from 'react';
import logo from './logo.svg';
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
};

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
];

function App() {
  return (
    <div className="App">
      {
        data.map((flask) => (
          <div key={flask.join(',')}>
            {
              flask.map((liquid) => <div style={{backgroundColor: liquid}} />)
            }
          </div>
        ))
      }

    </div>
  );
}

export default App;
