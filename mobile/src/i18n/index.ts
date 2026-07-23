import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";

export const SUPPORTED_LANGUAGES = ["en", "es"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_STORAGE_KEY = "countries-explorer.language";

/** Initial language: device locale, narrowed to what we support. */
function getDeviceLanguage(): AppLanguage {
  const code = Localization.getLocales()[0]?.languageCode;
  return code === "es" ? "es" : "en";
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: getDeviceLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Restore the persisted choice (async, so the device language shows meanwhile).
AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
  .then((saved) => {
    if (saved && (SUPPORTED_LANGUAGES as readonly string[]).includes(saved)) {
      if (saved !== i18n.language) void i18n.changeLanguage(saved);
    }
  })
  .catch(() => {
    // Non-fatal: fall back to the device language already applied.
  });

export async function setAppLanguage(language: AppLanguage): Promise<void> {
  await i18n.changeLanguage(language);
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Persistence is best-effort; the in-memory language is already switched.
  }
}

export default i18n;
