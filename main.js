const BlockChain = require("./BlockChain");
const Transaction = require("./Transaction");
const Wallet = require("./Wallet");

const satoshisWallet = new Wallet("satoshi");
const johnsWallet = new Wallet("john");
const minersWallet = new Wallet("minersAddress");

const minimumFeeForGreedyMiner = 2;

let blockchain = new BlockChain();

// Satoshi invites john to join his new crypto !
blockchain.createTransaction(
  new Transaction({ from: "satoshi", to: "john", amount: 90, fee: 20 })
);

console.log("..starting mining");

// some lucky miner
blockchain.minePendingTransactions("minersAddress", minimumFeeForGreedyMiner);
console.log(
  `satoshis balance:${satoshisWallet.getBalance(
    blockchain.chain
  )} Johns balance:${johnsWallet.getBalance(
    blockchain.chain
  )} Miners balance:${minersWallet.getBalance(blockchain.chain)}`
);

// John is very happy and pays satoshi back
blockchain.createTransaction(
  new Transaction({
    from: "john",
    to: "satoshi",
    amount: 10,
    fee: 1
  })
);

blockchain.minePendingTransactions("minersAddress", minimumFeeForGreedyMiner);
console.log(
  `satoshis balance:${satoshisWallet.getBalance(
    blockchain.chain
  )} Johns balance:${johnsWallet.getBalance(
    blockchain.chain
  )} Miners balance:${minersWallet.getBalance(blockchain.chain)}`
);

// John and satoshi stop using this crypto, miner just mines their own previous rewards/transactions
for (let i = 1; i < 5; i++) {
  blockchain.minePendingTransactions("minersAddress", minimumFeeForGreedyMiner);
  console.log(`Miners balance:${minersWallet.getBalance(blockchain.chain)}`);
}

// Greedy miner doesnt want to mine some pending transactions due to low fees
console.log(
  blockchain.pendingTransactions.filter(
    transaction => transaction.fee <= minimumFeeForGreedyMiner
  )
);

// John tries to send satoshi more than he has
blockchain.createTransaction(
  new Transaction({
    from: "john",
    to: "satoshi",
    amount: 10000,
    fee: 1
  })
);

blockchain.minePendingTransactions("minersAddress", minimumFeeForGreedyMiner);
console.log(
  `satoshis balance:${satoshisWallet.getBalance(
    blockchain.chain
  )} Johns balance:${johnsWallet.getBalance(
    blockchain.chain
  )} Miners balance:${minersWallet.getBalance(blockchain.chain)}`
);
