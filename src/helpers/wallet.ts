import sha256 from "crypto-js/sha256";
import ripemd160 from "crypto-js/ripemd160";
import CryptoJS from "crypto-js";
import bip39 from "bip39";
import { fromSeed, BIP32Interface } from "bip32";
import bech32 from "bech32";
import secp256k1 from "secp256k1";
import { IWallet } from "./types";

const hdPathAtom = `m/44'/118'/0'/0/0`; // key controlling ATOM allocation

export function standardRandomBytesFunc(size: number) {
  /* istanbul ignore if: not testable on node */
  if (window.crypto) {
    let key = ``;
    let keyContainer = new Uint32Array(size / 4);
    keyContainer = window.crypto.getRandomValues(keyContainer);
    for (let keySegment = 0; keySegment < keyContainer.length; keySegment++) {
      key += keyContainer[keySegment].toString(16); // Convert int to hex
    }
    return key;
  } else {
    return CryptoJS.lib.WordArray.random(size).toString();
  }
}

export function generateWalletFromSeed(mnemonic: string): IWallet {
  const masterKey = deriveMasterKey(mnemonic);
  const { privateKey, publicKey } = deriveKeypair(masterKey);
  const cosmosAddress = createCosmosAddress(publicKey);
  return {
    privateKey: privateKey.toString(`hex`),
    publicKey: publicKey.toString(`hex`),
    cosmosAddress
  };
}

export function generateSeed(randomBytesFunc = standardRandomBytesFunc) {
  const randomBytes = Buffer.from(randomBytesFunc(32), `hex`);
  if (randomBytes.length !== 32) {
    throw Error(`Entropy has incorrect length`);
  }
  const mnemonic = bip39.entropyToMnemonic(randomBytes.toString(`hex`));

  return mnemonic;
}

export function generateWallet(
  randomBytesFunc = standardRandomBytesFunc
): IWallet {
  const mnemonic = generateSeed(randomBytesFunc);
  return generateWalletFromSeed(mnemonic);
}

// NOTE: this only works with a compressed public key (33 bytes)
export function createCosmosAddress(publicKey: Buffer) {
  const message = CryptoJS.enc.Hex.parse(publicKey.toString(`hex`));
  const test: any = sha256(message);
  const hash = ripemd160(test).toString();
  const address = Buffer.from(hash, `hex`);
  const cosmosAddress = bech32ify(address, `cosmos`);

  return cosmosAddress;
}

function deriveMasterKey(mnemonic: string) {
  // throws if mnemonic is invalid
  bip39.validateMnemonic(mnemonic);

  const seed = bip39.mnemonicToSeed(mnemonic);

  const masterKey = fromSeed(seed);
  return masterKey;
}

function deriveKeypair(masterKey: BIP32Interface) {
  const cosmosHD = masterKey.derivePath(hdPathAtom);
  const privateKey = cosmosHD.privateKey || new Buffer(0);
  const publicKey = secp256k1.publicKeyCreate(privateKey, true);

  return {
    privateKey,
    publicKey
  };
}

function bech32ify(address: Buffer, prefix: string) {
  const words = bech32.toWords(address);
  return bech32.encode(prefix, words);
}

// produces the signature for a message (returns Buffer)
export function signWithPrivateKey(signMessage: string, privateKey: string) {
  const signHash = Buffer.from(sha256(signMessage).toString(), `hex`);
  const { signature } = secp256k1.sign(
    signHash,
    Buffer.from(privateKey, `hex`)
  );
  return signature;
}
