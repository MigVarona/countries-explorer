import { act, renderHook } from "@testing-library/react-native";

import { useDebouncedValue } from "../useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns the initial value immediately", async () => {
    const { result } = await renderHook(() => useDebouncedValue("spain", 400));
    expect(result.current).toBe("spain");
  });

  it("only emits the new value after the delay", async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value, 400),
      { initialProps: { value: "s" } },
    );

    await rerender({ value: "spain" });
    expect(result.current).toBe("s");

    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current).toBe("spain");
  });

  it("resets the timer when the value keeps changing (debounce)", async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value, 400),
      { initialProps: { value: "s" } },
    );

    await rerender({ value: "sp" });
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    await rerender({ value: "spa" });
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // 600ms elapsed, but never 400ms without a change: still the initial value.
    expect(result.current).toBe("s");

    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current).toBe("spa");
  });
});
