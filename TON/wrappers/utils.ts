import { Slice } from "@ton/core";

export function endParse(slice: Slice) {
  if (slice.remainingBits > 0 || slice.remainingRefs > 0) {
    throw new Error('remaining bits in data');
  }
}

