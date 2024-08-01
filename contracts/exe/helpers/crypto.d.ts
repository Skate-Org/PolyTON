export declare function bigintToHash(bytes32: bigint): string;
export declare function ed25519Sign(hashedMsg: string | Buffer, privateKey: BigInt): Promise<Buffer>;
