import { defineStore } from "pinia";
import { ref } from "vue";

export const useWalletStore = defineStore(
  "wallet-store",
  () => {
    const balance = ref(500);

    function deduct(amount: number): void {
      if (balance.value < amount) {
        throw new Error(`Insufficient balance. Have ${balance.value}, need ${amount}.`);
      }
      balance.value -= amount;
    }

    function credit(amount: number): void {
      balance.value += amount;
    }

    return { balance, deduct, credit };
  },
  { persist: { key: "wallet-store" } }
);
