import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useWalletStore } from "./wallet";

describe("useWalletStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initialises balance at 500", () => {
    const store = useWalletStore();
    expect(store.balance).toBe(500);
  });

  it("deduct reduces balance by the given amount", () => {
    const store = useWalletStore();
    store.deduct(100);
    expect(store.balance).toBe(400);
  });

  it("deduct throws when amount exceeds balance", () => {
    const store = useWalletStore();
    expect(() => store.deduct(600)).toThrow("Insufficient balance");
  });

  it("deduct throws when amount equals balance + 1", () => {
    const store = useWalletStore();
    expect(() => store.deduct(501)).toThrow("Insufficient balance");
  });

  it("deduct succeeds when amount equals balance exactly", () => {
    const store = useWalletStore();
    store.deduct(500);
    expect(store.balance).toBe(0);
  });

  it("credit increases balance by the given amount", () => {
    const store = useWalletStore();
    store.credit(50);
    expect(store.balance).toBe(550);
  });

  it("deduct then credit returns to original balance", () => {
    const store = useWalletStore();
    store.deduct(200);
    store.credit(200);
    expect(store.balance).toBe(500);
  });
});
