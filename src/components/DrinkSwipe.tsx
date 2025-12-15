"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// --- Demo Drink Data (1 per Starbucks category)
const DRINKS = [
  {
    id: 1,
    name: "Pike Place Roast",
    category: "coffee",
    description: "Smooth, well-rounded brewed coffee.",
    image: "https://cloudassets.starbucks.com/is/image/sbuxcorp/BrewedCoffee"
  },
  {
    id: 2,
    name: "Caffè Latte",
    category: "espresso",
    description: "Rich espresso with steamed milk.",
    image: "https://bunny-wp-pullzone-8lgzf5kyx3.b-cdn.net/assets/uploads/2023/08/sbx20190617-35529-caffelatte-onwhite-corelib-srgb.png"
  },
  {
    id: 3,
    name: "Caramel Frappuccino",
    category: "frappuccino",
    description: "Blended coffee with caramel sweetness.",
    image: "https://cloudassets.starbucks.com/is/image/sbuxcorp/SBX20220323_CaramelFrapp?impolicy=1by1_wide_topcrop_630&crop=180,360,1440,1440&wid=630&hei=630&qlt=85"
  },
  {
    id: 4,
    name: "Dragon Drink",
    category: "refreshers",
    description: "Tropical mango & dragonfruit refresher.",
    image: "https://cloudassets.starbucks.com/is/image/sbuxcorp/DragonDrink?impolicy=1by1_wide_topcrop_630&crop=180,360,1440,1440&wid=630&hei=630&qlt=85"
  },
  {
    id: 5,
    name: "Matcha Green Tea Latte",
    category: "tea",
    description: "Creamy green tea with subtle sweetness.",
    image: "https://cloudassets.starbucks.com/is/image/sbuxcorp/IcedMatchaTeaLatte?impolicy=1by1_wide_topcrop_630&crop=180,360,1440,1440&wid=630&hei=630&qlt=85"
  },
  {
    id: 6,
    name: "Pumpkin Spice Latte",
    category: "seasonal",
    description: "Classic fall flavors with warm spices.",
    image: "https://cloudassets.starbucks.com/is/image/sbuxcorp/PumpkinSpiceLatte-2?impolicy=1by1_wide_topcrop_630&crop=180,360,1440,1440&wid=630&hei=630&qlt=85"
  },
  {
    id: 7,
    name: "Iced Caffè Latte with Protein",
    category: "protein",
    description: "Chilled latte with added protein for energy.",
    image: "https://cloudassets.starbucks.com/is/image/sbuxcorp/IcedCaffeLattewProtein?impolicy=1by1_wide_topcrop_630&crop=180,360,1440,1440&wid=630&hei=630&qlt=85"
  }
];

export default function DrinkSwipe() {
  const [index, setIndex] = useState(0);
  const [prefs, setPrefs] = useState<{ [key: string]: number }>({});
  const [finished, setFinished] = useState(false);

  const drink = DRINKS[index];

  const swipe = (liked: boolean) => {
    setPrefs((prev) => ({
      ...prev,
      [drink.category]: (prev[drink.category] || 0) + (liked ? 1 : -0.5)
    }));

    if (index + 1 === DRINKS.length) {
      setFinished(true);
    } else {
      setIndex(index + 1);
    }
  };

  const recommendation = Object.entries(prefs).sort((a, b) => b[1] - a[1])[0]?.[0];
  const recommendedDrink = DRINKS.find((d) => d.category === recommendation);

  const emojiMap: { [key: string]: string } = {
    coffee: "☕",
    espresso: "⚡",
    frappuccino: "🍫",
    refreshers: "🍓",
    tea: "🍵",
    seasonal: "🎃",
    protein: "💪"
  };

  return (
    <div className="flex items-center justify-center">
      {!finished && drink && (
        <AnimatePresence>
          <motion.div
            key={drink.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x > 120) swipe(true);
              if (info.offset.x < -120) swipe(false);
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-[420px] max-w-full"
          >
            <Card className="rounded-3xl shadow-2xl bg-white">
              <CardContent className="p-0 text-center overflow-hidden rounded-2xl">
                <div className="relative w-full h-72">
                  <Image
                    src={drink.image}
                    alt={drink.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6 space-y-3">
                  <h2 className="text-xl font-semibold">{drink.name}</h2>
                  <p className="text-sm text-neutral-600">{drink.description}</p>

                  <span className="text-xs uppercase tracking-wide text-neutral-400">
                    {drink.category}
                  </span>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => swipe(false)}>
                      Pass
                    </Button>
                    <Button onClick={() => swipe(true)}>Like</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {finished && (
        <Card className="rounded-3xl shadow-2xl w-[420px] max-w-full bg-white">
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-xl font-semibold">Your Starbucks Match Today</h2>
            {recommendedDrink ? (
              <>
                <div className="relative w-full h-56">
                  <Image
                    src={recommendedDrink.image}
                    alt={recommendedDrink.name}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
                <p className="text-lg font-medium">
                  {emojiMap[recommendedDrink.category]} {recommendedDrink.name}
                </p>
                <p className="text-sm text-neutral-600">
                  {recommendedDrink.description}
                </p>
                <p className="text-xs text-neutral-500">
                  Matched because you liked {recommendedDrink.category} drinks
                </p>
              </>
            ) : (
              <p>No strong preference detected</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
