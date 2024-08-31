"use client";

import { useEffect, useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import { useRecoilState } from "recoil";
import axios from "axios";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { selectedWalletState } from "../../state/state";
import toast from "react-hot-toast";
import { RxClipboardCopy } from "react-icons/rx";
import { useRouter } from "next/navigation";

const Airdrop = () => {
  const [selectedWallet, setSelectedWallet] =
    useRecoilState(selectedWalletState);
  const [amount, setAmount] = useState(0);
  const [, setAirdropSuccess] = useState(false);
  const [ishovered, setIsHovered] = useState(false);
  const router = useRouter();
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

  useEffect(() => {
    if (selectedWallet?.key) {
      getBalance();
    }
  }, []);

  const getBalance = async () => {
    if (!selectedWallet?.key) return;

    try {
      const { data } = await axios.post(
        `https://solana-devnet.g.alchemy.com/v2/${apiKey}`,
        {
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [selectedWallet.key],
        }
      );

      if (data.result.value / LAMPORTS_PER_SOL !== amount) {
        setAirdropSuccess(false);
      }

      setAmount(data.result.value / LAMPORTS_PER_SOL);
      setSelectedWallet({ ...selectedWallet, amount: data.result.value });
    } catch (e) {
      console.log(e);
    }
  };

  const handleAirdrop = async () => {
    if (!selectedWallet?.key) return;

    setAirdropSuccess(false);
    try {
      const data = await axios.post(
        `https://solana-devnet.g.alchemy.com/v2/${apiKey}`,
        {
          jsonrpc: "2.0",
          id: 1,
          method: "requestAirdrop",
          params: [selectedWallet.key, 1000000000],
        }
      );

      setAirdropSuccess(true);
      console.log(data);
      toast.success("Airdrop Successful! Reflected within 1 minutes.");
    } catch (e) {
      console.log(e);
    }
  };

  const copytoclip = (text: string, type: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(`${type} copied to clipboard`))
      .catch(() => toast.error(`Failed to copy ${type.toLocaleLowerCase()}.`));
  };

  const truncateAddress = (address: String | undefined, length: number) => {
    if (!address) return;

    return address.length > length
      ? `${address.substring(0, length)}...`
      : address;
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card text-center p-4 rounded-3"
        style={{ width: "30rem", backgroundColor: "#f3f4f6" }}
      >
        <div className="card-body d-flex flex-column justify-content-between align-items-center">
          <div className="w-100 d-flex flex-column align-items-center">
            <div className="h1 display-4 fw-bold">Wallet Info</div>
            <div className="position-relative d-flex justify-content-center">
              <h2 className="display-1 mt-4" style={{ fontWeight: "bolder" }}>
                {amount.toFixed(2)}
              </h2>
              <span
                onClick={getBalance}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="position-absolute gap-2 cursor-pointer d-flex justify-content-center align-items-centerS"
                style={{
                  top: "60%",
                  right: "-50px",
                  transform: "translateY(-50%)",
                  fontWeight: "bolder",
                  cursor: "pointer",
                  color: ishovered ? "red" : "black",
                  transition: "color 0.1s ease-in-out",
                }}
              >
                <FiRefreshCcw size={30} />
              </span>
            </div>
            <div className="w-100 rounded p-4 d-flex flex-column justify-content-between gap-3 my-4">
              <div>
                <p
                  className="text-uppercase mb-1"
                  style={{ fontWeight: "bolder" }}
                >
                  {selectedWallet?.type}
                </p>
                <div
                  className="d-flex justify-content-around align-items-center"
                  style={{
                    width: "360px",
                    height: "40px",
                    borderRadius: "20px",
                    backgroundColor: "#fffff0",
                  }}
                >
                  <div className="d-flex justify-content-center align-items-center">
                    {truncateAddress(selectedWallet?.key, 30)}
                  </div>
                  <div
                    onClick={() =>
                      copytoclip(selectedWallet?.key, "Public Key")
                    }
                    style={{
                      cursor: "pointer",
                      display: "inline-block",
                    }}
                  >
                    <RxClipboardCopy size={25} />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-100 d-flex flex-column gap-3 mt-4">
              {selectedWallet?.type === "sol" && (
                <>
                  <div
                    className="btn btn-primary rounded-3"
                    onClick={handleAirdrop}
                  >
                    Airdrop
                  </div>
                  <div
                    className="btn btn-secondary rounded-3"
                    onClick={() => router.push("/send")}
                  >
                    Send
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Airdrop;
