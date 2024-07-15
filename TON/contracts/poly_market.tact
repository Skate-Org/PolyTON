import "@stdlib/deploy";
import "@stdlib/ownable";
import "./traits/jetton/JettonWallet.tact";
import "./traits/skate/SkateApp.tact";

struct Bet {
    market_id: Int as uint256; // ERC1155 tokenId of equivalent PolyMarket market.
    amount: Int as uint256; // Jetton or TON amount, USD equivalent to bet on PolyMarket
    direction: Bool; // True = BUY, False = Sell
    status: Int as uint8 = 0; // 0 = PLACED, 1 = WIN, 2 = LOSE, 3 = ABORT (withdraw)
}
struct BetList {
    bets: map<Int as uint16, Bet>;
    length: Int as uint16 = 0;
}
// Extension mutation function for adding new entries to the end of the array
extends mutates fun append(self: BetList, item: Bet) {
    // WARN: https://docs.tact-lang.org/book/maps#limits-and-drawbacks
    // MAX map size ~ uint16/2 = 32000, gas is more expensive with map size
    // => user should create a new account after > 30k bets
    require(self.length + 1 <= 32000, "WHATT! You have 32000 bets placed!");
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
    bet_idx: Int as uint32;
}

struct BetConfig {
    market_id: Int as uint256;
    direction: Bool;
    // Status default to 0.
}

message WithdrawBet {
    bet_idx: Int as uint32;
}

contract PolyMarket with SkateAppBase, JettonWallet {
    owner: Address;
    jetton_master: Address; // most likely USDT contract
    balance: Int = 0;
    skate_gateway: Address = newAddress(0, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8);

    // WARN: Discourage: https://docs.tact-lang.org/book/maps#limits-and-drawbacks
    // Should change to individual user posess the "jetton + betting wallet".
    userToBetList: map<Address, BetList>;

    // WARN: from actual USDT implementations at .mocks/*.fc, this contract init must conform to jetton interface.
    // Otherwise Master getter will fails -> problem with burn (and also mint).
    init(owner: Address, jetton_master: Address) {
        self.owner = owner;
        self.jetton_master = jetton_master;
    }

    override inline fun calculate_jetton_wallet_init(owner: Address): StateInit {
        return initOf PolyMarket(owner, self.jetton_master);
    }

    // NOTE: as explained above, the skate_gateway

    //////////// User interactions ////////////
    // NOTE: user can only place bet via transferring Jetton.
    // Therefore, this contract implements an extension of JettonInternalTransfer (jetton receive handler)
    // that embeds the Bet struct in forward_payload field.
    // EQUIVALENTLY, SENT BET = SENT JETTON (USDT) + PAYLOAD. OTHERWISE, JETTON WILL BE BOUNCED BACK.
    override inline fun _receive_jetton_callback(ctx: Context, msg: JettonInternalTransfer) {
        let user: Address = ctx.sender;
        let bet_config: BetConfig = BetConfig.fromSlice(msg.forward_payload);

        // Create and save the bet struct
        let newBet: Bet = Bet {
            market_id: bet_config.market_id,
            amount: msg.amount, // Jetton USDT amount
            direction: bet_config.direction,
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
        betList!!.upgradeStatus(msg.bet_idx, 4);
        self.userToBetList.set(user, betList!!);
    }
    ///////////////////////////////////////////

    ////////// Executor interactions //////////
    receive(msg: SettleBet) {
        self._onlySkateGateway();

        let betList = self.userToBetList.get(msg.user);
        require(betList != null, "Invalid user! This user hasn't placed any bet!");

        // 1. Executor must approves his USDT Jetton to this contract.
        // TODO: Then we transfer Jetton to user
    }

    ///////////////////////////////////////////
}

