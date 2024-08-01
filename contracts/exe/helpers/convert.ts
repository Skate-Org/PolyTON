import { createHash } from "crypto";
import { ok } from "node:assert";

export function sha256(message: string) {
  const hashedMsg = createHash("sha256").update(message).digest();
  ok(hashedMsg.length == 32);
  return hashedMsg;
}

export function bigintToHash(bytes32: bigint) {
  const hash = bytes32.toString(16).padStart(64, "0");
  return hash;
}
