import * as bip39 from 'bip39';
import { Wallet } from '@/state/state';


export const generateMnemonic = (): string => {
    return bip39.generateMnemonic();
}



export const generateBitcoinWallet = async (mnemonic: string, index: number): Promise<Wallet> => {
    const bip39 = await import('bip39');
    const { BIP32Factory } = await import('bip32');
    const ecc = await import('tiny-secp256k1');
    const bitcoin = await import('bitcoinjs-lib');

    const bip32 = BIP32Factory(ecc);
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed);
    const child = root.derivePath(`m/44'/0'/0'/0/${index}`);
    const { address } = bitcoin.payments.p2pkh({ pubkey: child.publicKey });

    if (address === undefined) throw new Error('Could not generate bitcoin address');

    return { key: child.publicKey.toString('hex'), address: address, privateKey: child.toWIF(), type: 'btc', amount: 0 };
}


export const generateEthereumWallet = async (mnemonic: string, index: number): Promise<Wallet> => {
    const bip39 = await import('bip39');
    const { HDNodeWallet } = await import('ethers');

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hdNode = HDNodeWallet.fromSeed(seed);
    const path = `m/44'/60'/0'/0/${index}`;
    const wallet = hdNode.derivePath(path);

    if (wallet.address === undefined) throw new Error('Could not generate ethereum address');

    return { key: wallet.publicKey, address: wallet.address, privateKey: wallet.privateKey, type: 'eth', amount: 0 };
}

export const generateSolanaWallet = async (mnemonic: string, index: number): Promise<Wallet> => {
    const bip39 = await import('bip39');
    const { BIP32Factory } = await import('bip32');
    const ecc = await import('tiny-secp256k1');
    const { Keypair } = await import('@solana/web3.js');

    const bip32 = BIP32Factory(ecc);
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed);
    const child = root.derivePath(`m/44'/501'/0'/0/${index}`);
    const keypair = Keypair.fromSeed(child.privateKey!.slice(0, 32));

    return { key: keypair.publicKey.toBase58(), address: keypair.publicKey.toString(), privateKey: keypair.secretKey, type: 'sol', amount: 0 };
}
