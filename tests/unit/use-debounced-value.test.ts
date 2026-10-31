import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebouncedValue } from "@/lib/use-debounced-value";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("updates value only after the specified delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ val, delay }) => useDebouncedValue(val, delay),
      { initialProps: { val: "first", delay: 300 } }
    );

    expect(result.current).toBe("first");

    rerender({ val: "second", delay: 300 });
    // Immediately after rerender, it should still be "first"
    expect(result.current).toBe("first");

    // Advance 200ms -> still "first"
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("first");

    // Advance 100ms -> now 300ms passed -> updates to "second"
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("second");
  });

  it("collapses rapid successive changes into a single final update", () => {
    const { result, rerender } = renderHook(
      ({ val }) => useDebouncedValue(val, 300),
      { initialProps: { val: "v1" } }
    );

    rerender({ val: "v2" });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ val: "v3" });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ val: "v4" });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Total time elapsed: 300ms, but v4 was set only 100ms ago
    expect(result.current).toBe("v1");

    // Advance remaining 200ms
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("v4");
  });

  it("cleans up active timers when component unmounts", () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
    const { unmount, rerender } = renderHook(
      ({ val }) => useDebouncedValue(val, 300),
      { initialProps: { val: "test" } }
    );

    rerender({ val: "updated" });
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
