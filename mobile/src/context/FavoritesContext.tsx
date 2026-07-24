import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "countries-explorer.favorites";

interface FavoritesValue {
  /** Country ids (cca3) marked as favorite. */
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesValue | null>(null);

/**
 * Favorites are shared state (the list screen filters by them, the detail
 * screen toggles them), so they live in context rather than being threaded
 * through props. Persisted to AsyncStorage on every change.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const stored: unknown = JSON.parse(raw);
        if (Array.isArray(stored)) {
          setFavorites(stored.filter((id): id is string => typeof id === "string"));
        }
      })
      .catch(() => {
        // Non-fatal: start with an empty list if the stored value is unreadable.
      });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((current) => {
      const next = current.includes(id)
        ? current.filter((favorite) => favorite !== id)
        : [...current, id];
      // Persistence is best-effort; the in-memory list is already updated.
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo<FavoritesValue>(() => {
    const lookup = new Set(favorites);
    return {
      favorites,
      isFavorite: (id: string) => lookup.has(id),
      toggleFavorite,
    };
  }, [favorites, toggleFavorite]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used inside a FavoritesProvider");
  }
  return context;
}
