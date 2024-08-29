"use client";

import { selectedWalletState } from "@/state/state";
import { Wallet } from "@/state/state";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useRecoilState } from "recoil";

const Send = () => {
  const [amount, setAmount] = useState(0);
  const [receiver, setReceiver] = useState("");
  const [, setTransactionHash] = useState("");

  const [selectedWallet] = useRecoilState<Wallet>(selectedWalletState);
  let availableBalance = selectedWallet.amount;

  if (selectedWallet.type === "sol") {
    availableBalance = availableBalance / LAMPORTS_PER_SOL;
  }

  const handleTransaction = () => {
    if (selectedWallet.type === "sol") {
      handleSolTransaction();
    }
  };

  const handleSolTransaction = async () => {
    let toastID;
    try {
      toastID = toast.loading("Sending Transaction...");
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const tx = new Transaction();
      const senderPublicKey = new PublicKey(selectedWallet.key);
      const receiverPublicKey = new PublicKey(receiver);

      tx.add(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: receiverPublicKey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const payer = Keypair.fromSecretKey(
        selectedWallet.privateKey as Uint8Array
      );
      const signature = await sendAndConfirmTransaction(connection, tx, [
        payer,
      ]);
      setTransactionHash(signature);
      toast.dismiss(toastID);
      toast.success("Transaction successful", { id: toastID });
    } catch (error) {
      console.error("Transaction error:", error); // Log detailed error
      toast.dismiss(toastID);
      toast.error("Some thing went wrong. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4"
        style={{
          width: "30rem",
          backgroundColor: "#f3f4f6",
          borderRadius: "20px",
        }}
      >
        <div className="card-body d-flex flex-column h-100">
          <div className="w-100 d-flex flex-column align-items-center">
            <h1 className="display-4" style={{ fontWeight: "bold" }}>
              Transaction
            </h1>
            <div className="mt-4 w-100">
              <p
                className="text-muted"
                style={{ fontWeight: "bold", color: "black" }}
              >
                Enter Amount (Balance: {availableBalance})
              </p>
              <input
                type="number"
                id="amount"
                placeholder="Amount"
                className="form-control"
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <div className="mt-3 w-100">
              <p
                className="text-muted"
                style={{ fontWeight: "bold", color: "black" }}
              >
                Enter Receiver&apos;s Address
              </p>
              <input
                type="text"
                id="receiver"
                placeholder="Receiver's Address"
                className="form-control"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 w-100">
            <button
              id="performTransaction"
              onClick={handleTransaction}
              className="btn btn-primary w-100"
            >
              Perform Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Send;
