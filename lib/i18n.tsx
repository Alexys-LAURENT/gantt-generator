"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Locale = "fr" | "en";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Record<string, unknown>;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");
  const [messages, setMessages] = useState<Record<string, unknown>>({});

  useEffect(() => {
    // Charger la langue depuis localStorage au démarrage
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && (savedLocale === "fr" || savedLocale === "en")) {
      setLocaleState(savedLocale);
    }
  }, []);

  useEffect(() => {
    // Charger les messages quand la langue change
    import(`../messages/${locale}.json`).then((mod) => {
      setMessages(mod.default);
    });
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, messages }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

export function useTranslations(namespace: string) {
  const { messages } = useLocale();
  
  return (key: string) => {
    const keys = `${namespace}.${key}`.split(".");
    let value: unknown = messages;
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in (value as Record<string, unknown>)) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    
    return typeof value === "string" ? value : key;
  };
}
