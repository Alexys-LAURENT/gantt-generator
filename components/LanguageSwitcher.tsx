"use client";

import { useLocale } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 p-1 flex gap-1">
        <button
          onClick={() => setLocale("fr")}
          className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all ${
            locale === "fr"
              ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          🇫🇷 FR
        </button>
        <button
          onClick={() => setLocale("en")}
          className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all ${
            locale === "en"
              ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          🇬🇧 EN
        </button>
      </div>
    </div>
  );
}
