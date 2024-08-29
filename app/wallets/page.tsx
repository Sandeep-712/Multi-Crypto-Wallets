"use client";

import React, { useEffect } from "react";
import {
  generateBitcoinWallet,
  generateEthereumWallet,
  generateSolanaWallet,
} from "../../providers/WalletUtils";
import { useRecoilState } from "recoil";
import {
  mnemonicState,
  selectedWalletState,
  btcWalletState,
  ethWalletState,
  solWalletState,
  Wallet,
} from "../../state/state";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { RxClipboardCopy } from "react-icons/rx";
import { useRouter } from "next/navigation";

export default function WalletsPage() {
  const [btcwallet, setBtcwallet] = useRecoilState(btcWalletState);
  const [ethwallet, setEthwallet] = useRecoilState(ethWalletState);
  const [solwallet, setSolwallet] = useRecoilState(solWalletState);
  const [mnemonic] = useRecoilState(mnemonicState);
  const [, setSelectedWallet] = useRecoilState(selectedWalletState);

  const router = useRouter();

  useEffect(() => {
    const initWallets = async () => {
      if (btcwallet.length === 0)
        setBtcwallet([await generateBitcoinWallet(mnemonic, 0)]);
      if (ethwallet.length === 0)
        setEthwallet([await generateEthereumWallet(mnemonic, 0)]);
      if (solwallet.length === 0)
        setSolwallet([await generateSolanaWallet(mnemonic, 0)]);
    };
    initWallets();
  }, []);

  const handlebitcoinwallet = async () => {
    if (btcwallet.length >= 0) {
      const newallet = await generateBitcoinWallet(
        mnemonic,
        btcwallet.length + 1
      );
      setBtcwallet([...btcwallet, newallet]);
      toast.success("BTC Wallet generated successfully.");
    } else {
      toast.error(
        "Error generating BTC wallet. Please generate a new mnemonic phrase."
      );
    }
  };

  const handleEthwallet = async () => {
    if (ethwallet.length >= 0) {
      const newallet = await generateEthereumWallet(
        mnemonic,
        ethwallet.length + 1
      );
      setEthwallet([...ethwallet, newallet]);
      toast.success("ETH Wallet generated successfully.");
    } else {
      toast.error(
        "Error generating ETH wallet. Please generate a new mnemonic."
      );
    }
  };

  const handleSolwallet = async () => {
    if (solwallet.length >= 0) {
      const newallet = await generateSolanaWallet(
        mnemonic,
        solwallet.length + 1
      );
      setSolwallet([...solwallet, newallet]);
      toast.success("SOL Wallet generated successfully.");
    } else {
      toast.error(
        "Error generating SOL wallet. Please generate a new mnemonic."
      );
    }
  };

  const handledel = (type: string, index: number) => {
    switch (type) {
      case "btc": {
        const newWallets = [...btcwallet];
        newWallets.splice(index, 1);
        setBtcwallet(newWallets);
        break;
      }
      case "eth": {
        const newWallets = [...ethwallet];
        newWallets.splice(index, 1);
        setEthwallet(newWallets);
        break;
      }
      case "sol": {
        const newWallets = [...solwallet];
        newWallets.splice(index, 1);
        setSolwallet(newWallets);
        break;
      }
      default:
        break;
    }
  };

  const copytoclip = (text: string, type: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(`${type} copied to clipboard`))
      .catch(() => toast.error(`Failed to copy ${type.toLocaleLowerCase()}.`));
  };

  const handleSelect = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    router.push("/airdrop");
  };

  const truncateAddress = (address: String, length: number) => {
    return address.length > length
      ? `${address.substring(0, length)}...`
      : address;
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ width: "100%" }}
    >
      <div className="d-flex flex-column align-items-center justify-items-center p-6 rounded-3">
        <h3
          className="h3 mb-5"
          style={{ fontSize: "40px", fontWeight: "bold" }}
        >
          Multi Crypto Wallets
        </h3>

        <div className="row mb-4">
          <div className="col-md-4" style={{ width: "400px", height: "500px" }}>
            <div
              className="card"
              style={{
                width: "360px",
                height: "500px",
                borderRadius: "20px",
                backgroundColor: "#f3f4f6",
              }}
            >
              <div className="card-body">
                <h5 className="card-title d-flex justify-content-center mb-4">
                  Bitcoin Wallets
                </h5>
                <div style={{ height: "350px", overflow: "auto" }}>
                  <ul className="list-group list-group-flush d-flex justify-content-center overflow-y">
                    {btcwallet.map((wallet, index) => (
                      <React.Fragment key={index}>
                        <div
                          className="d-flex justify-content-between align-items-center mb-2"
                          style={{
                            backgroundColor: "white",
                            margin: "10px",
                            padding: "5px",
                            borderRadius: "5px",
                            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
                            cursor: "pointer",
                          }}
                        >
                          <div onClick={() => handleSelect(wallet)}>
                            {truncateAddress(wallet.address, 20)}
                          </div>
                          <div className="d-flex justify-content-end">
                            <div
                              onClick={() => copytoclip(wallet.address, "BTC")}
                              style={{
                                cursor: "pointer",
                                display: "inline-block",
                              }}
                            >
                              <RxClipboardCopy size={25} />
                            </div>

                            <div
                              onClick={() => handledel("btc", index)}
                              style={{
                                cursor: "pointer",
                                display: "inline-block",
                              }}
                            >
                              <MdDelete size={30} />
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                onClick={() => handlebitcoinwallet()}
                className="btn btn-primary mb-4 w-75 mx-auto rounded-3"
              >
                Generate Bitcoin Wallets
              </button>
            </div>
          </div>

          <div className="col-md-4" style={{ width: "400px", height: "500px" }}>
            <div
              className="card"
              style={{
                width: "360px",
                height: "500px",
                borderRadius: "20px",
                backgroundColor: "#f3f4f6",
              }}
            >
              <div className="card-body">
                <h5 className="card-title d-flex justify-content-center mb-4">
                  Ethereum Wallets
                </h5>
                <div style={{ height: "350px", overflow: "auto" }}>
                  <ul className="list-group list-group-flush">
                    {ethwallet.map((wallet, index) => (
                      <React.Fragment key={index}>
                        <div
                          className="d-flex justify-content-between align-items-center mb-2"
                          style={{
                            backgroundColor: "white",
                            margin: "10px",
                            padding: "5px",
                            borderRadius: "5px",
                            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
                            cursor: "pointer",
                          }}
                        >
                          <div onClick={() => handleSelect(wallet)}>
                            {truncateAddress(wallet.address, 20)}
                          </div>
                          <div className="d-flex justify-content-between">
                            <div
                              onClick={() => copytoclip(wallet.address, "ETH")}
                              style={{
                                cursor: "pointer",
                                display: "inline-block",
                              }}
                            >
                              <RxClipboardCopy size={25} />
                            </div>
                            <div
                              onClick={() => handledel("eth", index)}
                              style={{
                                cursor: "pointer",
                                display: "inline-block",
                              }}
                            >
                              <MdDelete size={30} />
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                onClick={() => handleEthwallet()}
                className="btn btn-primary mb-4 w-75 mx-auto rounded-3"
              >
                Generate Ethereum Wallets
              </button>
            </div>
          </div>

          <div className="col-md-4" style={{ width: "400px", height: "500px" }}>
            <div
              className="card"
              style={{
                width: "360px",
                height: "500px",
                borderRadius: "20px",
                backgroundColor: "#f3f4f6",
              }}
            >
              <div className="card-body">
                <h5 className="card-title d-flex justify-content-center mb-4">
                  Solana Wallets
                </h5>
                <div style={{ height: "350px", overflow: "auto" }}>
                  <ul className="list-group list-group-flush">
                    {solwallet.map((wallet, index) => (
                      <React.Fragment key={index}>
                        <div
                          className="d-flex justify-content-between align-items-center mb-2"
                          style={{
                            backgroundColor: "white",
                            margin: "10px",
                            padding: "5px",
                            borderRadius: "5px",
                            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          <div
                            onClick={() => handleSelect(wallet)}
                            style={{ cursor: "pointer" }}
                          >
                            {truncateAddress(wallet.address, 20)}
                          </div>
                          <div className="d-flex justify-content-between">
                            <div
                              onClick={() => copytoclip(wallet.address, "SOL")}
                              style={{
                                cursor: "pointer",
                                display: "inline-block",
                              }}
                            >
                              <RxClipboardCopy size={25} />
                            </div>
                            <div
                              onClick={() => handledel("sol", index)}
                              style={{
                                cursor: "pointer",
                                display: "inline-block",
                              }}
                            >
                              <MdDelete size={30} />
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                onClick={() => handleSolwallet()}
                className="btn btn-primary mb-4 w-75 mx-auto rounded-3"
              >
                Generate Solana Wallets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
