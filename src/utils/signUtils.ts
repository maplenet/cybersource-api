
import CryptoJS from "crypto-js";

export function computeHttpSignature(
  keyId: string,
  secretKey: string,
  headers: Record<string, string>
): string {
  const signingBase = Object.entries(headers)
    .map(([key, value]) => `${key.toLowerCase()}: ${value}`)
    .join("\n");

  const hash = CryptoJS.HmacSHA256(signingBase, CryptoJS.enc.Base64.parse(secretKey));
  const signature = CryptoJS.enc.Base64.stringify(hash);

  return `keyid="${keyId}", algorithm="HmacSHA256", headers="${Object.keys(headers).join(" ")}", signature="${signature}"`;
}
