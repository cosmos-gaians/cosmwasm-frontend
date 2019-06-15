import CryptoJS from "crypto-js";

import {
  generateWallet,
  generateWalletFromSeed,
  standardRandomBytesFunc
} from "./wallet";

import { IKeyStore, IWallet } from "./types";

const keySize = 256;
const iterations = 100;

export function storeKeys(keys: IKeyStore[]) {
  localStorage.setItem(`keys`, JSON.stringify(keys));
}
export function loadKeys(): IKeyStore[] {
  return JSON.parse(localStorage.getItem(`keys`) || `[]`);
}

export function getKey(name: string, password: string) {
  const keys = loadKeys();
  const key = keys.find(key => key.name === name);
  if (!key) {
    throw new Error(`Couldn't find key with name: ${name}`);
  }
  try {
    const decrypted = decrypt(key.wallet, password);
    const wallet = JSON.parse(decrypted);

    return wallet;
  } catch (err) {
    throw new Error(`Incorrect password`);
  }
}

function addKey(wallet: IWallet, name: string, password: string) {
  const keys = loadKeys();

  if (keys.find(key => key.name === name)) {
    throw new Error(`Key with that name already exists`);
  }

  const ciphertext = encrypt(JSON.stringify(wallet), password);

  keys.push({
    name,
    address: wallet.cosmosAddress,
    wallet: ciphertext
  });

  storeKeys(keys);
}

export function testPassword(name: string, password: string) {
  const keys = loadKeys();

  const key = keys.find(key => key.name === name);

  if (!key) {
    throw new Error(`Couldn't find key with name: ${name}`);
  }

  try {
    // try to decode and check if is json format to proofs that decoding worked
    const decrypted = decrypt(key.wallet, password);
    JSON.parse(decrypted);
    return true;
  } catch (err) {
    return false;
  }
}

export function addNewKey(
  name: string,
  password: string,
  randomBytesFunc = standardRandomBytesFunc
) {
  const wallet = generateWallet(randomBytesFunc);
  addKey(wallet, name, password);

  return wallet;
}
export function importKey(name: string, password: string, seed: string) {
  const wallet = generateWalletFromSeed(seed);
  addKey(wallet, name, password);

  return wallet;
}

// TODO needs proof reading
function encrypt(message: string, password: string) {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);

  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: keySize / 32,
    iterations
  });

  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  const encrypted = CryptoJS.AES.encrypt(message, key, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  const transit = salt.toString() + iv.toString() + encrypted.toString();
  return transit;
}

function decrypt(transit: string, password: string) {
  const salt = CryptoJS.enc.Hex.parse(transit.substr(0, 32));
  const iv = CryptoJS.enc.Hex.parse(transit.substr(32, 32));
  const encrypted = transit.substring(64);

  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: keySize / 32,
    iterations
  });

  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  }).toString(CryptoJS.enc.Utf8);
  return decrypted;
}
