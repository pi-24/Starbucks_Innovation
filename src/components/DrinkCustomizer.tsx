"use client";

import React, { useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

const layersData = {
  foam: {
    en: 'Foam',
    ar: 'رغوة',
    options: [
      { en: 'No Foam', ar: 'بدون رغوة', color: '#f7f3ec' },
      { en: 'Cold Foam', ar: 'رغوة باردة', color: '#ffffff' },
      { en: 'Vanilla Sweet Cream Foam', ar: 'رغوة كريمة الفانيليا الحلوة', color: '#f3e5ab' },
      { en: 'Chocolate Cream Foam', ar: 'رغوة كريمة الشوكولاتة', color: '#5a3a2e' },
      { en: 'Whipped Cream', ar: 'كريمة مخفوقة', color: '#fffdf7' },
    ],
  },
  ice: {
    en: 'Ice',
    ar: 'ثلج',
    options: [
      { en: 'No Ice', ar: 'بدون ثلج', color: '#f7f3ec' },
      { en: 'Light Ice', ar: 'ثلج قليل', color: 'rgba(200,230,255,0.6)' },
      { en: 'Regular Ice', ar: 'ثلج عادي', color: 'rgba(180,220,255,0.8)' },
      { en: 'Extra Ice', ar: 'ثلج إضافي', color: 'rgba(160,210,255,0.9)' },
    ],
  },
  milk: {
    en: 'Milk',
    ar: 'حليب',
    options: [
      { en: 'Whole Milk', ar: 'حليب كامل الدسم', color: '#ffffff' },
      { en: 'Low-Fat Milk', ar: 'حليب قليل الدسم', color: '#f7f7f7' },
      { en: 'Skim Milk', ar: 'حليب خالي الدسم', color: '#fcfcfc' },
      { en: 'Oat Milk', ar: 'حليب الشوفان', color: '#e6d3a3' },
      { en: 'Almond Milk', ar: 'حليب اللوز', color: '#f0ead6' },
      { en: 'Soy Milk', ar: 'حليب الصويا', color: '#efe6d8' },
      { en: 'Coconut Milk', ar: 'حليب جوز الهند', color: '#fafafa' },
    ],
  },
  base: {
    en: 'Base',
    ar: 'الأساس',
    options: [
      { en: 'Espresso', ar: 'اسبريسو', color: '#3b1f1f' },
      { en: 'Blonde Espresso', ar: 'اسبريسو أشقر', color: '#a47148' },
      { en: 'Matcha', ar: 'ماتشا', color: '#6aa84f' },
      { en: 'Coffee', ar: 'قهوة', color: '#4b2e2b' },
      { en: 'Crème Base', ar: 'قاعدة كريمية', color: '#f5f5f5' },
    ],
  },
  syrup: {
    en: 'Syrup',
    ar: 'شراب',
    options: [
      { en: 'No Syrup', ar: 'بدون شراب', color: '#f2e9dc' },
      { en: 'Vanilla', ar: 'فانيليا', color: '#f3e5ab' },
      { en: 'Caramel', ar: 'كراميل', color: '#c68642' },
      { en: 'White Mocha', ar: 'موكا بيضاء', color: '#e6d8ad' },
      { en: 'Hazelnut', ar: 'بندق', color: '#b08968' },
      { en: 'Toffee Nut', ar: 'جوز التوفي', color: '#a86b3c' },
      { en: 'Cinnamon Dolce', ar: 'قرفة دولتشي', color: '#cfa670' },
      { en: 'Strawberry Purée', ar: 'هريس الفراولة', color: '#d94a4a' },
      { en: 'Pistachio (Seasonal)', ar: 'فستق (موسمي)', color: '#93c47d' },
    ],
  },
};

type LayerKey = keyof typeof layersData;

interface CustomizerLayerProps {
  layerKey: LayerKey;
  index: number;
  onIndexChange: (newIndex: number) => void;
  language: 'en' | 'ar';
}

const CustomizerLayer: React.FC<CustomizerLayerProps> = ({ layerKey, index, onIndexChange, language }) => {
  const layerInfo = layersData[layerKey];
  const option = layerInfo.options[index];

  const handleArrowClick = (dir: 'left' | 'right') => {
    let newIndex = dir === 'left' ? index - 1 : index + 1;
    newIndex = (newIndex + layerInfo.options.length) % layerInfo.options.length;
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
        {option[language]}
        <br />
        <span className="text-xs opacity-80">{layerInfo[language].toUpperCase()}</span>
      </div>
      <div className="text-2xl cursor-pointer opacity-75 hover:opacity-100" onClick={() => handleArrowClick('right')}>▶</div>
    </motion.div>
  );
};


export default function DrinkCustomizer({ language }: { language: 'en' | 'ar' }) {
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
          {language === 'ar' ? 'خصص مشروبك' : 'Customize Your Drink'}
        </div>

        {(Object.keys(layersData) as LayerKey[]).map((key) => (
          <CustomizerLayer
            key={key}
            layerKey={key}
            index={selections[key]}
            onIndexChange={(newIndex) => handleIndexChange(key, newIndex)}
            language={language}
          />
        ))}

        <div className="text-center text-xs p-[10px] bg-black/5">
          {language === 'ar' ? 'اسحب لليسار / لليمين أو اضغط على الأسهم' : 'Swipe left / right or tap arrows'}
        </div>
      </div>
    </div>
  );
}
