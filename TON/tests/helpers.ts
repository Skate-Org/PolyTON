import { createHash } from "crypto";
import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";
import { ok } from "node:assert";

// Set the sha512 implementation
ed.etc.sha512Sync = (...msgs) => {
  const hash = sha512.create();
  msgs.forEach((msg) => hash.update(msg));
  return hash.digest();
  // return sha512(ed.etc.concatBytes(...msgs))
};

// Convert BigInt to Uint8Array
export const bigintToUint8Array = (bigint: BigInt): Uint8Array => {
  const hex = bigint.toString(16).padStart(64, "0");
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
};

export function sha256(message: string) {
  const hashedMsg = createHash("sha256").update(message).digest();
  ok(hashedMsg.length == 32);
  return hashedMsg;
}

export function bigintToHash(bytes32: bigint) {
  const hash = bytes32.toString(16).padStart(64, '0');
  return hash;
}

export function ed25519Sign(hashedMsg: string | Buffer, privateKey: BigInt) {
  // step1: hashedMsg = sha256(message);
  const privKeyBytes = bigintToUint8Array(privateKey);

  // step2: return privateKey.sign(hashedMsg)
  const signature = ed.sign(hashedMsg, privKeyBytes);
  return Buffer.from(signature);
}

export * as ed from "@noble/ed25519";
