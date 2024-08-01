"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

function bigintToHash(bytes32) {
  var hash = bytes32.toString(16).padStart(64, "0");
  return hash;
}

// Convert BigInt to Uint8Array
var bigintToUint8Array = function (bigint) {
  var hex = bigint.toString(16).padStart(64, "0");
  return new Uint8Array(
    hex.match(/.{1,2}/g).map(function (byte) {
      return parseInt(byte, 16);
    }),
  );
};

// WARN: to by pass typescript error using require()
async function ed25519Sign(hashedMsg, privateKey) {
  var ed = await import("@noble/ed25519");
  var sha512_1 = await import("@noble/hashes/sha512");
  // Set the sha512 implementation
  ed.etc.sha512Sync = function () {
    var msgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      msgs[_i] = arguments[_i];
    }
    var hash = sha512_1.sha512.create();
    msgs.forEach(function (msg) {
      return hash.update(msg);
    });
    return hash.digest();
  };
  // step1: hashedMsg = sha256(message);
  var privKeyBytes = bigintToUint8Array(privateKey);
  // step2: return privateKey.sign(hashedMsg)
  var signature = ed.sign(hashedMsg, privKeyBytes);
  return Buffer.from(signature);
}

exports.bigintToHash = bigintToHash;
exports.ed25519Sign = ed25519Sign;
