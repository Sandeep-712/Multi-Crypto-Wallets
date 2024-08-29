import { atom } from "recoil";

export interface Wallet {
    key: string;
    privateKey: string | Uint8Array;
    type: string;
    amount: number;
    address: string;
}

export const mnemonicState = atom({
    key: "mnemonic",
    default: "",
});

export const btcWalletState = atom({
    key: "btcWallet",
    default: [] as Wallet[],
})

export const ethWalletState = atom({
    key: "ethWallet",
    default: [] as Wallet[],
})

export const solWalletState = atom({
    key: "solWallet",
    default: [] as Wallet[],
})


export const selectedWalletState = atom({
    key: "selectedWallet",
    default: {} as Wallet,
})