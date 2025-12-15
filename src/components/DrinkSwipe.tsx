"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

// --- Demo Drink Data (1 per Starbucks category)
const DRINKS = [
  {
    id: 1,
    name: { en: "Pike Place Roast", ar: "قهوة بايك بليس" },
    category: "coffee",
    description: { en: "Smooth, well-rounded brewed coffee.", ar: "قهوة مخمرة ناعمة ومتوازنة." },
    image: "https://cloudassets.starbucks.com/is/image/sbuxcorp/BrewedCoffee"
  },
  {
    id: 2,
    name: { en: "Caffè Latte", ar: "كافيه لاتيه" },
    category: "espresso",
    description: { en: "Rich espresso with steamed milk.", ar: "اسبريسو غني مع حليب مبخر." },
    image: "https://bunny-wp-pullzone-8lgzf5kyx3.b-cdn.net/assets/uploads/2023/08/sbx20190617-35529-caffelatte-onwhite-corelib-srgb.png"
  },
  {
    id: 3,
    name: { en: "Caramel Frappuccino", ar: "فرابوتشينو كراميل" },
    category: "frappuccino",
    description: { en: "Blended coffee with caramel sweetness.", ar: "قهوة ممزوجة بحلاوة الكراميل." },
    image: "https://cloudassets.starbucks.com/is/image/sbuxcorp/SBX20220323_CaramelFrapp?impolicy=1by1_wide_topcrop_630&crop=180,360,1440,1440&wid=630&hei=630&qlt=85"
  },
  {
    id: 4,
    name: { en: "Dragon Drink", ar: "مشروب التنين" },
    category: "refreshers",
    description: { en: "Tropical mango & dragonfruit refresher.", ar: "منعش المانجو وفاكهة التنين الاستوائية." },
    image: "https://cloudassets.starbucks.com/is/image/sbuxcorp/DragonDrink?impolicy=1by1_wide_topcrop_630&crop=180,360,1440,1440&wid=630&hei=630&qlt=85"
  },
  {
    id: 5,
    name: { en: "Matcha Green Tea Latte", ar: "لاتيه شاي الماتشا الأخضر" },
    category: "tea",
    description: { en: "Creamy green tea with subtle sweetness.", ar: "شاي أخضر كريمي مع حلاوة خفيفة." },
    image: "https://cloudassets.starbucks.com/is/image/sbuxcorp/IcedMatchaTeaLatte?impolicy=1by1_wide_topcrop_630&crop=180,360,1440,1440&wid=630&hei=630&qlt=85"
  },
  {
    id: 6,
    name: { en: "Pumpkin Spice Latte", ar: "لاتيه اليقطين بالتوابل" },
    category: "seasonal",
    description: { en: "Classic fall flavors with warm spices.", ar: "نكهات الخريف الكلاسيكية مع التوابل الدافئة." },
    image: "https://cloudassets.starbucks.com/is/image/sbuxcorp/PumpkinSpiceLatte-2?impolicy=1by1_wide_topcrop_630&crop=180,360,1440,1440&wid=630&hei=630&qlt=85"
  },
  {
    id: 7,
    name: { en: "Iced Caffè Latte with Protein", ar: "كافيه لاتيه مثلج بالبروتين" },
    category: "protein",
    description: { en: "Chilled latte with added protein for energy.", ar: "لاتيه مثلج مع بروتين مضاف للطاقة." },
    image: "https://cloudassets.starbucks.com/is/image/sbuxcorp/IcedCaffeLattewProtein?impolicy=1by1_wide_topcrop_630&crop=180,360,1440,1440&wid=630&hei=630&qlt=85"
  }
];

export default function DrinkSwipe({ language }: { language: 'en' | 'ar' }) {
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

  const categoryTranslations: { [key: string]: string } = {
    coffee: "قهوة",
    espresso: "اسبريسو",
    frappuccino: "فرابوتشينو",
    refreshers: "منعشات",
    tea: "شاي",
    seasonal: "موسمي",
    protein: "بروتين"
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
                    alt={drink.name[language]}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6 space-y-3">
                  <h2 className="text-xl font-semibold">{drink.name[language]}</h2>
                  <p className="text-sm text-neutral-600">{drink.description[language]}</p>

                  <span className="text-xs uppercase tracking-wide text-neutral-400">
                    {language === 'ar' ? categoryTranslations[drink.category] : drink.category}
                  </span>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => swipe(false)}>
                      {language === 'ar' ? 'تخطي' : 'Pass'}
                    </Button>
                    <Button onClick={() => swipe(true)}>{language === 'ar' ? 'أعجبني' : 'Like'}</Button>
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
            <h2 className="text-xl font-semibold">{language === 'ar' ? 'مشروبك المثالي اليوم' : 'Your Starbucks Match Today'}</h2>
            {recommendedDrink ? (
              <>
                <div className="relative w-full h-56">
                  <Image
                    src={recommendedDrink.image}
                    alt={recommendedDrink.name[language]}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
                <p className="text-lg font-medium">
                  {emojiMap[recommendedDrink.category]} {recommendedDrink.name[language]}
                </p>
                <p className="text-sm text-neutral-600">
                  {recommendedDrink.description[language]}
                </p>
                <p className="text-xs text-neutral-500">
                  {language === 'ar' ? `تمت المطابقة لأنك أحببت مشروبات ${categoryTranslations[recommendedDrink.category]}` : `Matched because you liked ${recommendedDrink.category} drinks`}
                </p>
                <Button className="w-full">
                  <ShoppingCart className="mr-2"/>
                  {language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
                </Button>
              </>
            ) : (
              <p>{language === 'ar' ? 'لم يتم الكشف عن تفضيل قوي' : 'No strong preference detected'}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
