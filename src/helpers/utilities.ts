import sha256 from "crypto-js/sha256";
import { handleSignificantDecimals } from "./bignumber";
import { APP_DESCRIPTION, APP_NAME } from "../constants/appMeta";
import { isIpfsHash, getIpfsUrl } from "./ipfs";

export function capitalize(string: string): string {
  return string
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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
  amount: number,
  symbol: string,
  decimals: number = 2
) {
  const _amount = handleSignificantDecimals(`${amount}`, decimals);
  const result = `${_amount} ${symbol}`;
  return result;
}

export function updateTitle(title: string) {
  if (typeof document !== "undefined") {
    document.title = title;
  }
}

export function updateMetaTag(name: string, attribute: string, value: string) {
  const meta = document.querySelector(`meta[name="${name}"]`);
  if (meta) {
    meta.setAttribute(attribute, value);
  }
}

export function updateFavicon(href: string) {
  if (typeof document !== "undefined") {
    const link: any =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.rel = "shortcut icon";
    link.href = href;
    document.getElementsByTagName("head")[0].appendChild(link);
  }
}

export function updatePageMeta(meta: any) {
  updateTitle(meta.title);
  updateMetaTag("description", "content", meta.description);
  updateFavicon(meta.favicon);
}

export function revertPageMeta() {
  updateTitle(APP_NAME);
  updateMetaTag("description", "content", APP_DESCRIPTION);
  updateFavicon("/favicon.ico");
}

export function parseConstantString(constant: string): string {
  let result = constant
    .toLowerCase()
    .split("_")
    .join(" ");
  result = capitalize(result);
  return result;
}

export function formatConstantString(value: string): string {
  const result = value
    .toUpperCase()
    .split(" ")
    .join("_");
  return result;
}

export function sanitizeImgSrc(image: string): string {
  return isIpfsHash(image) ? getIpfsUrl(image) : image;
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
