import Image from "next/image";
import Link from "next/link";
import desi from "../public/Designer-removebg-preview.png";

export default function Home() {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 style={{ fontSize: "50px", fontWeight: "bolder", margin: "25px" }}>
        Multi Crypto Wallets
      </h1>
      <div
        className="card text-center p-4 w-50"
        style={{ borderRadius: "20px", backgroundColor: "#f3f4f6" }}
      >
        <div className="d-flex justify-content-center mt-4 mb-4">
          <Image src={desi} alt="wallet-icon" height={300} width={300} />
        </div>
        <Link href="/mnemonic">
          <button
            className="btn"
            style={{
              backgroundColor: "#000080",
              color: "white",
              borderRadius: "10px",
            }}
          >
            Create New Wallet
          </button>
        </Link>
      </div>
    </div>
  );
}
