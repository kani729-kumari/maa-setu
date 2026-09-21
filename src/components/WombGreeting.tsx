import { useCallback, useEffect, useRef, useState } from "react";

import { useI18n } from "@/lib/i18n";
import motherArt from "@/assets/mother-hero.png";

const quotes: { en: string; hi: string }[] = [
  { en: "One mother. One journey. One caring bridge.", hi: "एक माँ। एक यात्रा। एक देखभाल का पुल।" },
  {
    en: "Because every mother deserves to be heard and cared for.",
    hi: "क्योंकि हर माँ की बात सुनी जानी चाहिए और उनकी देखभाल होनी चाहिए।",
  },
  { en: "Connecting mothers to care, one step at a time.", hi: "हर कदम पर माँ को देखभाल से जोड़ते हुए।" },
  { en: "For her. For her baby. For a healthier tomorrow.", hi: "उसके लिए, उसके बच्चे के लिए, एक स्वस्थ कल के लिए।" },
  { en: "MAA Setu — a bridge to safer motherhood.", hi: "माँ सेतु — सुरक्षित मातृत्व की ओर एक सेतु।" },
  {
    en: "Your village may be far, but healthcare shouldn't be.",
    hi: "आपका गाँव दूर हो सकता है, पर स्वास्थ्य सेवा दूर नहीं होनी चाहिए।",
  },
];

type Heart = { id: number; left: number; delay: number; emoji: string };

export function WombGreeting() {
  const { lang } = useI18n();
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [popKey, setPopKey] = useState(0);
  const [popped, setPopped] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const heartTimer = useRef<number | null>(null);
  const autoTimer = useRef<number | null>(null);

  const pop = useCallback(() => {
    setPopped(true);
    setPopKey((k) => k + 1);
    setQuoteIdx((i) => (i + 1) % quotes.length);
    const burst: Heart[] = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      left: 52 + Math.random() * 42,
      delay: Math.random() * 0.35,
      emoji: (["💗", "✨", "💕", "🌸"] as const)[i % 4] ?? "💗",
    }));
    setHearts(burst);
    if (heartTimer.current) window.clearTimeout(heartTimer.current);
    heartTimer.current = window.setTimeout(() => setHearts([]), 1800);
  }, []);

  useEffect(() => {
    // Gentle auto-pop once when the tab first appears.
    autoTimer.current = window.setTimeout(() => pop(), 900);
    return () => {
      if (autoTimer.current) window.clearTimeout(autoTimer.current);
      if (heartTimer.current) window.clearTimeout(heartTimer.current);
    };
  }, [pop]);

  return (
    <section className="soft-gradient relative overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)]">
      <div className="flex flex-col items-center gap-6 p-6 sm:p-8 md:flex-row md:gap-10">
        <div className="relative shrink-0">
          <img
            src={motherArt}
            alt={lang === "hi" ? "गर्भवती माँ" : "Expecting mother"}
            width={1024}
            height={1024}
            loading="lazy"
            className="h-64 w-auto object-contain sm:h-80"
          />
          <button
            type="button"
            onClick={pop}
            aria-label={lang === "hi" ? "पेट को थपथपाएँ" : "Tap the belly"}
            className="group absolute left-[55%] top-[62%] flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-primary/15 backdrop-blur-[1px] transition-transform duration-200 hover:scale-105 active:scale-95 womb-pulse"
          >
            {popped && (
              <span
                key={popKey}
                className="absolute left-full top-1/2 -translate-y-1/2 pl-2"
                aria-hidden
              >
                <span className="animate-baby-pop block text-4xl drop-shadow-md">👶</span>
              </span>
            )}
            <span className="text-2xl" aria-hidden>
              {popped ? "💖" : "💗"}
            </span>
          </button>
          {hearts.map((h) => (
            <span
              key={h.id}
              className="heart-float pointer-events-none absolute text-2xl"
              style={{ left: `${h.left}%`, top: "36%", animationDelay: `${h.delay}s` }}
              aria-hidden
            >
              {h.emoji}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1 text-center md:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {lang === "hi" ? "माँ सेतु · जोड़ें सेहत, माँ और भविष्य" : "MAA Setu · जोड़ें सेहत, माँ और भविष्य"}
          </p>
          <p key={quoteIdx} className="animate-quote-in mt-3 font-display text-2xl font-semibold leading-snug sm:text-3xl">
            <span className="brand-text">“</span>
            {(() => {
              const q = quotes[quoteIdx] ?? quotes[0]!;
              return lang === "hi" ? q.hi : q.en;
            })()}
            <span className="brand-text">”</span>
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {lang === "hi"
              ? "पेट को थपथपाएँ — नन्हा मेहमान और एक नई सोच दोनों झाँकेंगे 👆"
              : "Tap the belly — a little guest and a fresh thought pop out 👆"}
          </p>
        </div>
      </div>
    </section>
  );
}
