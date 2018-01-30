const BlockChain = require("./BlockChain");
const Transaction = require("./Transaction");
const Wallet = require("./Wallet");

const satoshisWallet = new Wallet("satoshi");
const johnsWallet = new Wallet("john");
const minersWallet = new Wallet("minersAddress");

let blockchain = new BlockChain();

// Satoshi invites john join to join his crypto !
blockchain.createTransaction(
  new Transaction({ from: "satoshi", to: "john", amount: 90 })
);

console.log("..starting mining");

//some lucky miner
blockchain.minePendingTransactions("minersAddress");
console.log(
  `satoshis balance:${satoshisWallet.getBalance(
    blockchain.chain
  )} Johns balance:${johnsWallet.getBalance(
    blockchain.chain
  )} Miners balance:${minersWallet.getBalance(blockchain.chain)}`
);

// John is very happy and pays satoshi back
blockchain.createTransaction(
  new Transaction({ from: "john", to: "satoshi", amount: 10 })
);

blockchain.minePendingTransactions("minersAddress");
console.log(
  `satoshis balance:${satoshisWallet.getBalance(
    blockchain.chain
  )} Johns balance:${johnsWallet.getBalance(
    blockchain.chain
  )} Miners balance:${minersWallet.getBalance(blockchain.chain)}`
);

// John and satoshi stop using this crypto, miner just mines their own previous transactions
for (let i = 1; i < 10; i++) {
  blockchain.minePendingTransactions("minersAddress");
  console.log(`Miners balance:${minersWallet.getBalance(blockchain.chain)}`);
}
