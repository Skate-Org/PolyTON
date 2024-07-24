import "@stdlib/deploy";
import "../traits/jetton/JettonWallet.tact";

// user jetton Wallet to holds their USDT.
// Create one if they don't have it yet.
contract JettonWallet with JettonWalletBase, Deployable {
    balance: Int as coins = 0;
    owner: Address;
    jetton_master: Address;

    get fun balance(): Int {
        return self.balance;
    }

    init(owner: Address, jetton_master: Address) {
        self.owner = owner;
        self.jetton_master = jetton_master;
    }

    override inline fun calculate_jetton_wallet_init(owner_address: Address): StateInit {
        return initOf JettonWallet(owner_address, self.jetton_master);
    }
}
