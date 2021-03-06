import sha256 from "crypto-js/sha256";
import { handleSignificantDecimals } from "./bignumber";
import { ITokenAmount } from "./types";

export function capitalize(string: string): string {
  return string
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function ellipseWord(word: string = "", maxLength: number = 9999) {
  const _maxLength = maxLength - 3;
  return word.substr(0, _maxLength) + "...";
}

export function ellipseText(
  text: string = "",
  maxLength: number = 9999
): string {
  if (text.length <= maxLength) {
    return text;
  }
  const _maxLength = maxLength - 3;
  let ellipse = false;
  let currentLength = 0;
  const result =
    text
      .split(" ")
      .filter(word => {
        currentLength += word.length;
        if (ellipse || currentLength >= _maxLength) {
          ellipse = true;
          return false;
        } else {
          return true;
        }
      })
      .join(" ") + "...";
  return result;
}

export const padLeft = (n: string, length: number, z?: string): string => {
  z = z || "0";
  n = n + "";
  return n.length >= length ? n : new Array(length - n.length + 1).join(z) + n;
};

export const padRight = (n: string, length: number, z?: string): string => {
  z = z || "0";
  n = n + "";
  return n.length >= length ? n : n + new Array(length - n.length + 1).join(z);
};

export const getDataString = (func: string, arrVals: any[]): string => {
  let val = "";
  for (let i = 0; i < arrVals.length; i++) {
    val += padLeft(arrVals[i], 64);
  }
  const data = func + val;
  return data;
};

export function sanitizeHex(hex: string): string {
  hex = removeHexPrefix(hex);
  hex = hex.length % 2 !== 0 ? "0" + hex : hex;
  if (hex) {
    hex = addHexPrefix(hex);
  }
  return hex;
}

export function addHexPrefix(hex: string): string {
  if (hex.toLowerCase().substring(0, 2) === "0x") {
    return hex;
  }
  return "0x" + hex;
}

export function removeHexPrefix(hex: string): string {
  if (hex.toLowerCase().substring(0, 2) === "0x") {
    return hex.substring(2);
  }
  return hex;
}

export function getUrlProtocol(url: string): string {
  const protocolRegex = new RegExp(/(?:\w+):\/\//);

  let protocol = "";

  const matches = protocolRegex.exec(url);

  if (matches) {
    protocol = matches[0];
  }

  return protocol;
}

export function sanitizeUrl(url: string): string {
  const protocol = getUrlProtocol(url);

  if (protocol) {
    url = url.replace(protocol, "");
  }

  let result = url.replace(/\/+/g, "/").replace(/\/+$/, "");

  if (protocol) {
    result = protocol + result;
  }

  return result;
}

export function payloadId(): number {
  const datePart: number = new Date().getTime() * Math.pow(10, 3);
  const extraPart: number = Math.floor(Math.random() * Math.pow(10, 3));
  const id: number = datePart + extraPart;
  return id;
}

export function uuid(): string {
  const result: string = ((a?: any, b?: any) => {
    for (
      b = a = "";
      a++ < 36;
      b +=
        (a * 51) & 52
          ? (a ^ 15 ? 8 ^ (Math.random() * (a ^ 20 ? 16 : 4)) : 4).toString(16)
          : "-"
    ) {
      // empty
    }
    return b;
  })();
  return result;
}

export function formatDisplayAmount(
  amount: number | string,
  symbol: string,
  decimals: number = 2
) {
  const _amount = handleSignificantDecimals(`${amount}`, decimals);
  const result = `${_amount} ${symbol}`;
  return result;
}

export function getCurrentPathname() {
  const current =
    typeof window !== "undefined" ? sanitizeUrl(window.location.pathname) : "";
  return current || "/";
}

export function formatPathname(path: string, match: any) {
  return sanitizeUrl(`${match.url}${path}`);
}

export function isActivePath(path: string, match: any) {
  const pathname = formatPathname(path, match) || "/";
  const current = getCurrentPathname();
  return current === pathname;
}

export function stringToCapitals(str: string, max: number = 2) {
  if (!str) {
    return "";
  }
  return str
    .split(" ")
    .slice(0, max)
    .map((word: string) => word.charAt(0).toUpperCase())
    .join("");
}

export function hashToInteger(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export function integerToHexColor(i: number) {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}

export function stringToHexColor(str: string) {
  const hash = sha256(str).toString();
  const integer = hashToInteger(hash);
  const hexColor = integerToHexColor(integer);
  return hexColor;
}

export function isEmptyArray(array: any[]) {
  return !(array && array.length);
}

export function getTokenBalance(
  balances: ITokenAmount[],
  denom: string
): string {
  let tokenBalance = "";

  if (!isEmptyArray(balances)) {
    const matches = balances.filter(
      token => token.denom.toLowerCase() === denom.toLowerCase()
    );
    if (!isEmptyArray(matches)) {
      tokenBalance = matches[0].amount;
    }
  }

  return tokenBalance;
}
