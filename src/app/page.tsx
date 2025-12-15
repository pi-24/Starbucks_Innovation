"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, ThermometerSun, Sparkles, Clock, MessageCircle, ShoppingCart, Languages } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { recommendDrink, type RecommendDrinkOutput } from "@/ai/flows/recommend-drink";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import DrinkSwipe from "@/components/DrinkSwipe";
import Link from "next/link";
import DrinkCustomizer from "@/components/DrinkCustomizer";

function getWeatherCondition(code: number): string {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code >= 45 && code <= 48) return "Fog";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code === 95) return "Thunderstorm";
  if (code >= 96 && code <= 99) return "Thunderstorm with hail";
  return "Clear";
}

const MetaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className="size-14"
  >
    <defs>
      <linearGradient id="meta-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0062E0" />
        <stop offset="50%" stopColor="#833AB4" />
        <stop offset="100%" stopColor="#C13584" />
      </linearGradient>
    </defs>
    <path
      d="M50,2 A48,48 0 1,0 50,98 A48,48 0 1,0 50,2 M50,15 A35,35 0 1,1 50,85 A35,35 0 1,1 50,15"
      fill="url(#meta-gradient)"
      fillRule="evenodd"
    />
  </svg>
);


export default function StarbucksPersonalizedDashboard() {
  const { toast } = useToast();
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  /* -------------------- User -------------------- */
  const user = {
    name: "Humza",
    taste: "Caramel & Cold Brew",
    lastOrder: "Iced Caramel Macchiato",
    rewards: 420,
  };

  /* -------------------- State -------------------- */
  const [weather, setWeather] = useState<null | {
    temp: number | string;
    condition: string;
  }>(null);

  const [recommendation, setRecommendation] = useState<RecommendDrinkOutput | null>(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(true);

  /* -------------------- Weather (Dubai, UAE) -------------------- */
  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=25.2048&longitude=55.2708&current_weather=true"
        );
        const data = await res.json();
        setWeather({
          temp: Math.round(data.current_weather.temperature),
          condition: getWeatherCondition(data.current_weather.weathercode),
        });
      } catch(error) {
        console.error("Failed to fetch weather:", error);
        setWeather({ temp: "--", condition: "Unavailable" });
        toast({
          title: "Weather data unavailable",
          description: "Could not fetch current weather. Using default recommendations.",
          variant: "destructive",
        })
      }
    }
    fetchWeather();
  }, [toast]);

  /* -------------------- Time Logic -------------------- */
  const [timeOfDay, setTimeOfDay] = useState("Morning");
  useEffect(() => {
      const hour = new Date().getHours();
      setTimeOfDay(hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening");
  }, []);


  /* -------------------- Recommendation Logic -------------------- */
  useEffect(() => {
    async function getRecommendation() {
      if (weather && typeof weather.temp === 'number' && timeOfDay && user.taste) {
        setIsLoadingRecommendation(true);
        try {
          const result = await recommendDrink({
            temperature: weather.temp,
            timeOfDay,
            userTaste: user.taste,
          });
          setRecommendation(result);
        } catch (error) {
          console.error("Failed to get recommendation:", error);
          setRecommendation({
            title: "Made for You",
            drink: "Caramel Latte",
            reason: "Based on your preferences"
          });
          toast({
            title: "AI recommendation failed",
            description: "There was an issue with our AI. Here's a classic choice for you.",
            variant: "destructive",
          })
        } finally {
          setIsLoadingRecommendation(false);
        }
      } else if (weather) {
        // Handle case where weather fetch failed but we still want a default
        setRecommendation({
          title: "Made for You",
          drink: "Caramel Latte",
          reason: "Based on your preferences"
        });
        setIsLoadingRecommendation(false);
      }
    }
    getRecommendation();
  }, [weather, timeOfDay, user.taste, toast]);

  const infoCards = [
    {
      label: language === 'ar' ? 'الطقس' : 'Weather',
      value: weather ? `${weather.temp}°C · ${weather.condition}` : "Loading…",
      icon: ThermometerSun,
      loading: !weather,
    },
    { label: language === 'ar' ? 'الوقت' : 'Time', value: language === 'ar' ? (timeOfDay === 'Morning' ? 'الصباح' : timeOfDay === 'Afternoon' ? 'بعد الظهر' : 'المساء') : timeOfDay, icon: Clock },
    { label: language === 'ar' ? 'ذوقك' : 'Taste', value: user.taste, icon: Coffee },
    { label: language === 'ar' ? 'المكافآت' : 'Rewards', value: `${user.rewards} ★`, icon: Sparkles },
  ];

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2fbf7] via-[#e9f6f0] to-white p-6 md:p-10 grid gap-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-[#1e3932] rounded-[2.75rem] p-8 md:p-10 text-white flex items-center justify-between gap-6 shadow-2xl"
      >
        <div className="flex items-center gap-6">
          <Image
            src="https://upload.wikimedia.org/wikipedia/sco/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/512px-Starbucks_Corporation_Logo_2011.svg.png"
            alt="Starbucks"
            width={64}
            height={64}
            className="h-16 w-16 rounded-full bg-white p-2 object-contain"
          />
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
              {language === 'ar' ? `مساء الخير، ${user.name}` : `Good ${timeOfDay}, ${user.name}`}
            </h1>
            <p className="text-white/80 text-lg">
              {language === 'ar' ? 'تجربة ستاربكس الخاصة بك - مخصصة في الوقت الفعلي' : 'Your Starbucks experience — personalized in real time'}
            </p>
          </div>
        </div>
        <Button onClick={toggleLanguage} variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <Languages className="size-6"/>
        </Button>
      </motion.div>

      {/* Quick Context */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {infoCards.map(({ label, value, icon: Icon, loading }) => (
          <Card key={label} className="rounded-3xl shadow-lg bg-white/90 backdrop-blur-sm border-0">
            <CardContent className="p-6 flex items-center gap-4">
              <Icon className="text-primary size-5" />
              <div>
                <p className="text-xs uppercase text-muted-foreground">{label}</p>
                {loading ? <Skeleton className="h-5 w-32 mt-1" /> : <p className="font-medium">{value}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendation */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -4 }} className="lg:col-span-2 transition-transform">
          <Card className="rounded-[2.5rem] shadow-xl bg-gradient-to-br from-white to-[#f6fbf9] border-[#e3efe9] h-full">
            <CardContent className="p-10 flex flex-col h-full gap-3">
              <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
                <Sparkles size={16} /> {isLoadingRecommendation ? (language === 'ar' ? "جارٍ إنشاء التوصية..." : "Generating Recommendation...") : recommendation?.title || (language === 'ar' ? 'توصية الذكاء الاصطناعي' : "AI Recommendation")}
              </span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLoadingRecommendation ? "loading" : "loaded"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col flex-grow"
                >
                  {isLoadingRecommendation ? (
                    <div className="space-y-3 flex-grow">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-2/3" />
                    </div>
                  ) : (
                    <div className="flex-grow space-y-2">
                       <h3 className="text-2xl font-bold text-[#1e3932] font-headline">
                        {recommendation?.drink}
                      </h3>
                      <p className="text-muted-foreground">{recommendation?.reason}</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              <Button className="mt-auto w-full bg-gradient-to-r from-primary to-[#1e3932] text-white font-semibold text-lg py-6 h-auto rounded-xl">
                <ShoppingCart className="mr-2"/>
                {language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="transition-transform">
          <Card className="rounded-[2.5rem] shadow-xl bg-white border-[#e3efe9] h-full">
            <CardContent className="p-10 flex flex-col h-full gap-2">
              <h3 className="text-lg font-semibold text-[#1e3932] font-headline">
                {language === 'ar' ? 'مشروبك المفضل' : 'Your Go-To Favorite'}
              </h3>
              <p className="text-muted-foreground">{language === 'ar' ? 'آخر طلب' : 'Last ordered'}</p>
              <p className="text-xl font-medium">{user.lastOrder}</p>
              <Button variant="outline" className="mt-auto w-full rounded-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <ShoppingCart className="mr-2"/>
                {language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* My Taste Section */}
      <Card className="rounded-[2.75rem] shadow-xl bg-gradient-to-br from-white to-[#f6fbf9] border-[#e3efe9]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#1e3932] font-headline">
            {language === 'ar' ? 'اكتشف ذوقك' : 'Discover Your Taste'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          <DrinkSwipe language={language} />
        </CardContent>
      </Card>

      {/* Customize Your Drink Section */}
      <Card className="rounded-[2.75rem] shadow-xl bg-gradient-to-br from-white to-[#f6fbf9] border-[#e3efe9]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#1e3932] font-headline">
            {language === 'ar' ? 'خصص مشروبك' : 'Customize Your Drink'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10 flex flex-col items-center gap-6">
          <DrinkCustomizer language={language} />
          <Button className="w-full max-w-sm bg-gradient-to-r from-primary to-[#1e3932] text-white font-semibold text-lg py-6 h-auto rounded-xl">
            <ShoppingCart className="mr-2"/>
            {language === 'ar' ? 'أضف المشروب المخصص إلى السلة' : 'Add Customized Drink to Cart'}
          </Button>
        </CardContent>
      </Card>

      {/* Lifestyle Section */}
      <Card className="rounded-[2.75rem] shadow-xl bg-gradient-to-br from-white to-[#f6fbf9] border-[#e3efe9]">
        <CardContent className="p-10 space-y-6">
          <h2 className="text-2xl font-bold text-[#1e3932] font-headline">
            {language === 'ar' ? 'مختارات لأسلوب حياة دبي 🏜' : 'Dubai Lifestyle Picks 🏜'}
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            {language === 'ar' ? 'مشروبات منسقة للقيادة في الصحراء، صباحات الشاطئ، ومغامرات غروب الشمس.' : 'Curated drinks for desert drives, beach mornings, and sunset adventures.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { en: "Cold Brew Bottle", ar: "زجاجة كولد برو" },
              { en: "Iced Matcha Latte", ar: "شاي ماتشا مثلج" },
              { en: "Hot Chocolate", ar: "شوكولاتة ساخنة" }
            ].map((item) => (
              <motion.div
                key={item.en}
                whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)' }}
                className="rounded-2xl border border-[#e3efe9] p-6 transition-shadow bg-white flex flex-col"
              >
                <div className="flex-grow">
                  <p className="font-semibold text-[#1e3932]">{language === 'ar' ? item.ar : item.en}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'ar' ? 'مناسب تمامًا لإيقاع دبي.' : 'Perfectly suited for Dubai’s rhythm.'}
                  </p>
                </div>
                <Button variant="outline" className="w-full mt-4 rounded-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  <ShoppingCart className="mr-2"/>
                  {language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meta AI Expert Section */}
      <Card className="rounded-[2.75rem] shadow-xl bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
        <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-accent font-headline">
              {language === 'ar' ? 'محتار؟' : "Can't decide?"}
            </h2>
            <p className="text-muted-foreground max-w-md">
              {language === 'ar' ? 'تحدث مع خبير المشروبات الذكي على ميتا للعثور على توصية المشروب المثالية لك.' : 'Chat with our AI beverage expert on Meta to find your perfect drink recommendation.'}
            </p>
          </div>
          <Link href="https://aistudio.instagram.com/ai/838932582365222/?utm_source=mshare" target="_blank" rel="noopener noreferrer" className="shrink-0">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-bold py-6 px-8 text-base">
              {language === 'ar' ? 'تحدث إلى خبيرنا في ميتا' : 'Talk to our Meta expert'}
              <MessageCircle className="ml-2"/>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Floating Meta Icon */}
      <Link
        href="https://aistudio.instagram.com/ai/838932582365222/?utm_source=mshare"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 transition-transform hover:scale-110"
        aria-label="Talk to our Meta expert"
      >
        <MetaIcon />
      </Link>
    </div>
  );
}
