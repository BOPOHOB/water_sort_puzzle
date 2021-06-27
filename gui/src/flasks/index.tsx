import React, { useMemo } from 'react';
import { Button, Dropdown } from 'antd';
import type { FC } from 'react';
import cn from 'classnames';

import './colors.css';
import './index.css';

export enum Liquid {
  Empty = 'Empty',
  Gray = 'Gray',
  Green = 'Green',
  Lime = 'Lime',
  Blue = 'Blue',
  Purple = 'Purple',
  Azure = 'Azure',
  Blush = 'Blush',
  Red = 'Red',
  Aqua = 'Aqua',
  Brown = 'Brown',
  Coral = 'Coral',
  Yellow = 'Yellow',
};

const ALL_LIQUIDS: Liquid[] = [
  Liquid.Empty,
  Liquid.Gray,
  Liquid.Green,
  Liquid.Lime,
  Liquid.Blue,
  Liquid.Purple,
  Liquid.Azure,
  Liquid.Blush,
  Liquid.Red,
  Liquid.Aqua,
  Liquid.Brown,
  Liquid.Coral,
  Liquid.Yellow,
];

export type Flask = [Liquid, Liquid, Liquid, Liquid];

export type Flasks = Flask[];

const PER_ROW = 7;

type ColorPickerProps = {
  value: Liquid;
  onChange?: (flasks: Liquid) => any;
  children: React.ReactElement;
  allowEmpty: boolean,
}

const ColorPicker: FC<ColorPickerProps> = ({ children, onChange, value, allowEmpty }) => {
  const allLiquids = useMemo(() => ALL_LIQUIDS.filter((l) =>
    l !== value && (allowEmpty || l !== Liquid.Empty))
  , [allowEmpty, value]);
  const onChangeLiquid = useMemo(() => {
    let reactions = new Array(allLiquids.length);
    if (onChange) {
      reactions = reactions.fill(null).map((_, id) => () => {
        onChange(allLiquids[id]);
      });
    }
    return reactions
  }, [onChange, allLiquids]);
  if (!onChange) {
    return children;
  }
  return (
    <Dropdown overlay={(
      <div className="picker">
        {
          allLiquids.map((liquid, id) => (
            <Button type="text" key={id} className={liquid.toLowerCase()} children="&nbsp;" onClick={onChangeLiquid[id]} size="small" />
          ))
        }
      </div>
    )}>
      { children }
    </Dropdown>
  )
};

type FlaskProps = {
  value: Flask;
  onChange?: (flasks: Flask) => any;
};


const FlaskWidget: FC<FlaskProps> = ({ value, onChange }) => {
  const onChangeLiquid = useMemo(() => {
    let reactions = new Array(4);
    if (onChange) {
      reactions = reactions.fill(null).map((_, id) => (liquid: Liquid) => {
        const result = JSON.parse(JSON.stringify(value));
        result[id] = liquid;
        onChange(result);
      });
    }
    return reactions
  }, [onChange, value]);
  return (
    <div className="flask">
      {
        value.map((liquid, id) => (
          <ColorPicker allowEmpty={id === 0 || value[id - 1] === Liquid.Empty} key={id} value={liquid} onChange={value[id + 1] !== Liquid.Empty ? onChangeLiquid[id] : undefined}>
            <div className={cn(liquid.toLowerCase(), 'liquid')} />
          </ColorPicker>
        ))
      }
    </div>
  );
};

type FlasksProps = {
  value: Flasks,
  onChange?: (flasks: Flasks) => any,
};

const FlasksWidget: FC<FlasksProps> = ({ value, onChange }) => {
  const onFlaskChange = useMemo(() => {
    if (!onChange) {
      return { get: () => undefined };
    }
    return new Map(value.map((flask, id) => [flask, (flask: Flask) => {
      let result = JSON.parse(JSON.stringify(value));
      result[id] = flask;
      onChange(result);
    }]));
  }, [value, onChange]);
  return (
    <div className="flasks">
      {
        new Array(Math.ceil(value.length / PER_ROW)).fill(null).map((_: null, rowId: number) => (
          <div className="flasks_row" key={rowId}>
            {
              value.slice(rowId * PER_ROW, (rowId + 1) * PER_ROW).map((flask, columnId) => (
                <FlaskWidget key={rowId * PER_ROW + columnId} value={flask} onChange={onFlaskChange.get(flask)} />
              ))
            }
          </div>
        ))
      }
    </div>
  );
}

export default FlasksWidget;
