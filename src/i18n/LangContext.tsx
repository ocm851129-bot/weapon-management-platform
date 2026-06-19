import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type Lang, type TranslationKeys } from './translations';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKeys) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'ko',
  setLang: () => {},
  t: (key) => translations.ko[key],
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ko');
  const t = (key: TranslationKeys) => translations[lang][key];
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
