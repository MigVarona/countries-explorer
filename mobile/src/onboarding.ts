import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "countries-explorer.welcome-seen";

/** Whether the welcome screen has already been shown on this device. */
export async function hasSeenWelcome(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(STORAGE_KEY)) === "true";
  } catch {
    // If storage is unreadable, skip the intro rather than showing it forever.
    return true;
  }
}

export async function markWelcomeSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Best-effort: worst case the intro shows again next launch.
  }
}
