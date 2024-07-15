import "@stdlib/deploy";
import "@stdlib/ownable";
import "../traits/jetton/JettonWallet.tact";
import "../traits/skate/SkateGateway.tact";
import "../traits/skate/SkateApp.tact";

struct Bet {
    marketId: Int as uint32; // ERC1155 tokenId of equivalent PolyMarket market.
    amount: Int as uint32; // Jetton or TON amount, USD equivalent to bet on PolyMarket
    direction: Bool; // True = BUY, False = Sell
    status: Int as uint8 = 0; // 0 = PLACED, 1 = WIN, 2 = LOSE, 3 = ABORT (withdraw)
}
struct BetList {
    bets: map<Int as uint32, Bet>;
    length: Int as uint32 = 0;
}
// Extension mutation function for adding new entries to the end of the array
extends mutates fun append(self: BetList, item: Bet) {
    require(self.length + 1 <= 4294967295, "WHATT! You have 4,294,967,295 bets placed!");
    self.bets.set(self.length, item); // set the entry (key-value pair)
    self.length += 1;                // increase the length field
}
extends mutates fun upgradeStatus(self: BetList, idx: Int, newStatus: Int) {
    require(idx < self.length, "Index out of bounds");
    let targetBet: Bet = self.bets.get(idx)!!;
    targetBet.status = newStatus;
    self.bets.set(idx, targetBet);
}
fun emptyBetList(): BetList {
    return BetList{
        bets: emptyMap(),
        length: 0
    };
}

message SettleBet {
    user: Address;
    betIdx: Int as uint32;
    relayerSig: Slice;
}

message PlaceBet {
    marketId: Int as uint32;
    amount: Int as uint32;
    direction: Bool;
    // Status default to 0.
}

message WithdrawBet {
    betIdx: Int as uint32;
}

contract SkateVault with Deployable, OwnableTransferable {
    relayer: Int as uint256; // Relayer is an ED25519 public key
    owner: Address;
    executors: map<Address, Bool>;

    // WARN: Discourage: https://docs.tact-lang.org/book/maps#limits-and-drawbacks
    userToBetList: map<Address, BetList>;

    init(owner: Address, relayer: Int) {
        self.owner = owner;
        self.relayer = relayer;
    }

    ////////////// Skate Infras ///////////////
    receive(msg: SetExecutor) {
        self.requireOwner();
        self.executors.set(msg.executor, true);
    }

    receive(msg: RevokeExecutor) {
        self.requireOwner();
        self.executors.set(msg.executor, true);
    }

    get fun relayer(): Int {
        return self.relayer;
    }
    ///////////////////////////////////////////


    //////////// User interactions ////////////
    receive(msg: PlaceBet) {
        let user: Address = sender();
        // TODO: transfer the underlying token, likely USDT to this contract, which also a Jetton wallet.

        // Create and save the bet struct
        let newBet: Bet = Bet {
            marketId: msg.marketId,
            amount: msg.amount,
            direction: msg.direction,
            // status = PLACED (0)
            status: 0
        };

        let betList: BetList? = self.userToBetList.get(user);
        if (betList == null) {
            betList = emptyBetList();
        }
        betList!!.append(newBet);
        self.userToBetList.set(user, betList!!);

        // Notify the caller that the receiver was executed and forward remaining value back
        self.notify("BetPlaced".asComment());
    }

    receive(msg: WithdrawBet) {
        let user: Address = sender();
        let betList: BetList? = self.userToBetList.get(user);
        require(betList != null, "No bet placed!");

        // status 4 = WITHDRAW.
        betList!!.upgradeStatus(msg.betIdx, 4);
        self.userToBetList.set(user, betList!!);
    }
    ///////////////////////////////////////////

    ////////// Executor interactions //////////
    receive(msg: SettleBet) {
        let executor = sender();
        let isExecutor = self.executors.get(executor);
        nativeThrowUnless(132, isExecutor != null && isExecutor!!);

        let betList = self.userToBetList.get(msg.user);
        require(betList != null, "Invalid user! This user hasn't placed any bet!");

        // 1. Executor must approves his USDT Jetton to this contract.
        // TODO: Then we transfer Jetton to user
    }

    ///////////////////////////////////////////
}

