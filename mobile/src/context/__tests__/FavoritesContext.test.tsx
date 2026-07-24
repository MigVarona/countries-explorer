import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { FavoritesProvider, useFavorites } from "../FavoritesContext";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

const STORAGE_KEY = "countries-explorer.favorites";

const wrapper = ({ children }: { children: ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe("FavoritesContext", () => {
  it("adds and removes a favorite, persisting each change", async () => {
    const { result } = await renderHook(() => useFavorites(), { wrapper });

    await act(async () => {
      result.current.toggleFavorite("ESP");
    });
    expect(result.current.isFavorite("ESP")).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(STORAGE_KEY, JSON.stringify(["ESP"]));

    await act(async () => {
      result.current.toggleFavorite("ESP");
    });
    expect(result.current.isFavorite("ESP")).toBe(false);
    expect(result.current.favorites).toEqual([]);
  });

  it("restores favorites saved in a previous session", async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(["FRA", "JPN"]));

    const { result } = await renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => expect(result.current.favorites).toEqual(["FRA", "JPN"]));
    expect(result.current.isFavorite("JPN")).toBe(true);
  });

  it("ignores unreadable stored data instead of crashing", async () => {
    await AsyncStorage.setItem(STORAGE_KEY, "not json");

    const { result } = await renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => expect(result.current.favorites).toEqual([]));
  });
});
