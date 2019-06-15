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
  console.log("[generateWalletFromSeed] masterKey", masterKey); // tslint:disable-line
  const { privateKey, publicKey } = deriveKeypair(masterKey);
  // tslint:disable-next-line
  console.log(
    "[generateWalletFromSeed] privateKey",
    privateKey.toString("hex")
  );
  console.log("[generateWalletFromSeed] publicKey", publicKey.toString("hex")); // tslint:disable-line
  const cosmosAddress = createCosmosAddress(publicKey);
  console.log("[generateWalletFromSeed] cosmosAddress", cosmosAddress); // tslint:disable-line
  return {
    privateKey: privateKey.toString(`hex`),
    publicKey: publicKey.toString(`hex`),
    cosmosAddress
  };
}

export function generateSeed(randomBytesFunc = standardRandomBytesFunc) {
  const randomBytes = Buffer.from(randomBytesFunc(32), `hex`);
  console.log("[generateSeed] randomBytes", randomBytes); // tslint:disable-line
  if (randomBytes.length !== 32) {
    throw Error(`Entropy has incorrect length`);
  }
  const mnemonic = bip39.entropyToMnemonic(randomBytes.toString(`hex`));
  console.log("[generateSeed] mnemonic", mnemonic); // tslint:disable-line

  return mnemonic;
}

export function generateWallet(
  randomBytesFunc = standardRandomBytesFunc
): IWallet {
  console.log("[generateWallet] randomBytesFunc", randomBytesFunc); // tslint:disable-line
  const mnemonic = generateSeed(randomBytesFunc);
  console.log("[generateWallet] mnemonic", mnemonic); // tslint:disable-line
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
  console.log("[deriveMasterKey] mnemonic", mnemonic); // tslint:disable-line
  // throws if mnemonic is invalid
  bip39.validateMnemonic(mnemonic);
  // tslint:disable-next-line
  console.log(
    "[deriveMasterKey] bip39.validateMnemonic(mnemonic)",
    bip39.validateMnemonic(mnemonic)
  );

  const seed = bip39.mnemonicToSeed(mnemonic);

  console.log("[deriveMasterKey] seed", seed); // tslint:disable-line
  const masterKey = fromSeed(seed);
  console.log("[deriveMasterKey] masterKey", masterKey); // tslint:disable-line
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
