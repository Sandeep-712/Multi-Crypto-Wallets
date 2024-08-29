"use client";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { generateMnemonic } from "@/providers/WalletUtils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  mnemonicState,
  btcWalletState,
  ethWalletState,
  solWalletState,
} from "@/state/state";

const Mnemonic = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [mnemonicrecoil, setMnemonicrecoil] = useRecoilState(mnemonicState);
  const [btcWallet, setBtcWallet] = useRecoilState(btcWalletState);
  const [ethWallet, setEthWallet] = useRecoilState(ethWalletState);
  const [solWallet, setSolWallet] = useRecoilState(solWalletState);
  const router = useRouter();

  useEffect(() => {
    setMnemonic(generateMnemonic());
  }, []);

  const handleRefreshMnemonic = (): void => {
    toast.success("Mnemonic refreshed successfully");
    setMnemonic(generateMnemonic());
  };

  const handleGenerateWallet = (): void => {
    setMnemonicrecoil(mnemonic);
    setBtcWallet([]);
    setEthWallet([]);
    setSolWallet([]);
    router.push("/wallets");
  };

  const copytoclipboard = (text: string, type: string): void => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(`${type} copied to clipboard`))
      .catch(() => toast.error(`Failed to copy ${type.toLocaleLowerCase()}.`));
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ width: "100%", borderRadius: "15px" }}
    >
      <div
        className="d-flex flex-column align-items-center justify-items-center p-4 shadow-sm rounded-3"
        style={{ width: "30%", backgroundColor: "#D2D2D2", minHeight: "60vh" }}
      >
        <h3 className="h3 font-weight-bold mb-4 ">Mnemonic Phrase</h3>

        <div className="row w-70 mb-2">
          {mnemonic.split(" ").map((word, index) => (
            <div className="col-4 p-2" key={index}>
              <div
                className=" text-center bg-dark text-white align-items-center justify-content-center d-flex rounded-3"
                style={{ height: "40px" }}
              >
                {word}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleRefreshMnemonic}
          className="btn btn-primary  w-75 mt-3"
          style={{
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Refresh Mnemonic Phrase
        </button>

        <div
          className="d-flex justify-between w-75 m-4"
          // style={{ gap: "8rem" }}
        >
          <button
            onClick={() => copytoclipboard(mnemonic, "Mnemonic Phrase")}
            className="btn btn-primary flex-grow-1 me-2"
            style={{
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Copy
          </button>
          <button
            onClick={() => {
              if (window !== undefined) {
                localStorage.setItem("mnemonic_phrase", mnemonic);
                toast.success("Mnemonic saved to local storage");
              }
            }}
            className="btn btn-primary flex-grow-1"
            style={{
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Save
          </button>
        </div>

        <button
          className="btn btn-primary w-75"
          onClick={handleGenerateWallet}
          style={{
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Generate Wallet
        </button>
      </div>
    </div>
  );
};

export default Mnemonic;
