import { fireEvent, render, screen } from "@testing-library/react-native";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../../i18n/locales/en.json";
import { EmptyView, ErrorView } from "../StateViews";

// Minimal i18n instance so components can translate without native modules.
beforeAll(async () => {
  await i18n.use(initReactI18next).init({
    lng: "en",
    resources: { en: { translation: en } },
    interpolation: { escapeValue: false },
  });
});

describe("EmptyView", () => {
  it("shows the 'no results found' message", async () => {
    await render(<EmptyView />);
    expect(screen.getByText("No results found")).toBeTruthy();
  });
});

describe("ErrorView", () => {
  it("shows the error message and retries on button press", async () => {
    const onRetry = jest.fn();
    await render(<ErrorView onRetry={onRetry} />);

    expect(
      screen.getByText("Something went wrong. Please check your connection and try again."),
    ).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
