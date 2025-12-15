"use client";

import React, { useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

const layersData = {
  foam: {
    options: [
      { name: 'No Foam', color: '#f7f3ec' },
      { name: 'Cold Foam', color: '#ffffff' },
      { name: 'Vanilla Sweet Cream Foam', color: '#f3e5ab' },
      { name: 'Chocolate Cream Foam', color: '#5a3a2e' },
      { name: 'Whipped Cream', color: '#fffdf7' },
    ],
  },
  ice: {
    options: [
      { name: 'No Ice', color: '#f7f3ec' },
      { name: 'Light Ice', color: 'rgba(200,230,255,0.6)' },
      { name: 'Regular Ice', color: 'rgba(180,220,255,0.8)' },
      { name: 'Extra Ice', color: 'rgba(160,210,255,0.9)' },
    ],
  },
  milk: {
    options: [
      { name: 'Whole Milk', color: '#ffffff' },
      { name: 'Low-Fat Milk', color: '#f7f7f7' },
      { name: 'Skim Milk', color: '#fcfcfc' },
      { name: 'Oat Milk', color: '#e6d3a3' },
      { name: 'Almond Milk', color: '#f0ead6' },
      { name: 'Soy Milk', color: '#efe6d8' },
      { name: 'Coconut Milk', color: '#fafafa' },
    ],
  },
  base: {
    options: [
      { name: 'Espresso', color: '#3b1f1f' },
      { name: 'Blonde Espresso', color: '#a47148' },
      { name: 'Matcha', color: '#6aa84f' },
      { name: 'Coffee', color: '#4b2e2b' },
      { name: 'Crème Base', color: '#f5f5f5' },
    ],
  },
  syrup: {
    options: [
      { name: 'No Syrup', color: '#f2e9dc' },
      { name: 'Vanilla', color: '#f3e5ab' },
      { name: 'Caramel', color: '#c68642' },
      { name: 'White Mocha', color: '#e6d8ad' },
      { name: 'Hazelnut', color: '#b08968' },
      { name: 'Toffee Nut', color: '#a86b3c' },
      { name: 'Cinnamon Dolce', color: '#cfa670' },
      { name: 'Strawberry Purée', color: '#d94a4a' },
      { name: 'Pistachio (Seasonal)', color: '#93c47d' },
    ],
  },
};

type LayerKey = keyof typeof layersData;

interface CustomizerLayerProps {
  layerKey: LayerKey;
  index: number;
  onIndexChange: (newIndex: number) => void;
}

const CustomizerLayer: React.FC<CustomizerLayerProps> = ({ layerKey, index, onIndexChange }) => {
  const { options } = layersData[layerKey];
  const option = options[index];

  const handleArrowClick = (dir: 'left' | 'right') => {
    let newIndex = dir === 'left' ? index - 1 : index + 1;
    newIndex = (newIndex + options.length) % options.length;
    onIndexChange(newIndex);
  };
  
  const x = useMotionValue(0);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{
        height: '78px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px',
        fontWeight: 'bold',
        color: '#222',
        userSelect: 'none',
        transition: 'background 0.35s ease',
        background: option.color,
        x
      }}
      onDragEnd={(event, info) => {
        if (info.offset.x > 40) handleArrowClick('left');
        if (info.offset.x < -40) handleArrowClick('right');
      }}
    >
      <div className="text-2xl cursor-pointer opacity-75 hover:opacity-100" onClick={() => handleArrowClick('left')}>◀</div>
      <div className="text-center">
        {option.name}
        <br />
        <span className="text-xs opacity-80">{layerKey.toUpperCase()}</span>
      </div>
      <div className="text-2xl cursor-pointer opacity-75 hover:opacity-100" onClick={() => handleArrowClick('right')}>▶</div>
    </motion.div>
  );
};


export default function DrinkCustomizer() {
  const [selections, setSelections] = useState({
    foam: 0,
    ice: 0,
    milk: 0,
    base: 0,
    syrup: 0,
  });

  const handleIndexChange = (layerKey: LayerKey, newIndex: number) => {
    setSelections(prev => ({ ...prev, [layerKey]: newIndex }));
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-[300px] bg-[#f7f3ec] rounded-b-[45px] overflow-hidden shadow-2xl">
        <div className="text-center font-bold p-[14px]">
          Customize Your Drink
        </div>

        {(Object.keys(layersData) as LayerKey[]).map((key) => (
          <CustomizerLayer
            key={key}
            layerKey={key}
            index={selections[key]}
            onIndexChange={(newIndex) => handleIndexChange(key, newIndex)}
          />
        ))}

        <div className="text-center text-xs p-[10px] bg-black/5">
          Swipe left / right or tap arrows
        </div>
      </div>
    </div>
  );
}