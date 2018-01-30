const Block = require("./Block");
const Transaction = require("./Transaction");
const Wallet = require("./Wallet");

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this._difficulty = 1;
    this._miningReward = 50;
    this.pendingTransactions = [];
    this.maxCoinSupply = 21000000;
    this.halfingRate = 210000;
  }

  createGenesisBlock() {
    return new Block({
      timestamp: new Date(),
      transactions: [
        new Transaction({ from: "GenesisBlock", to: "satoshi", amount: 100 })
      ],
      previousHash: "0"
    });
  }

  minePendingTransactions(miningRewardAddress, minFee) {
    var lastBlock = this.chain[this.chain.length - 1];
    const transactionsWantedByMiner = this.getPendingTransactionsForFeeHigherThan(
      minFee
    );
    const transactionsNotWantedByMiner = this.pendingTransactions.filter(
      transaction => transaction.fee < minFee
    );
    const totalTranactionFee = this.calculateTotalTransactionFees(
      transactionsWantedByMiner
    );
    let block = new Block({
      timestamp: new Date(),
      transactions: transactionsWantedByMiner,
      previousHash: lastBlock.hash
    });
    this.addBlock(block);
    this.pendingTransactions = transactionsNotWantedByMiner;
    this.pendingTransactions.push(
      new Transaction({
        from: "MiningRewardGod",
        to: miningRewardAddress,
        amount: this.miningReward + totalTranactionFee,
        fee: minFee
      })
    );
  }

  calculateTotalTransactionFees(transactions) {
    let totalTranactionFee = 0;
    transactions.forEach(
      transaction => (totalTranactionFee += transaction.fee)
    );
    return totalTranactionFee;
  }

  getPendingTransactionsForFeeHigherThan(fee) {
    const transactionsWantedByMiner = this.pendingTransactions
      .filter(transaction => transaction.fee >= fee)
      .sort((a, b) => a.fee - b.fee);
    return transactionsWantedByMiner;
  }

  createTransaction(transaction) {
    const fromBalance = new Wallet(transaction.from).getBalance(this.chain);
    if (fromBalance > transaction.amount) {
      return this.pendingTransactions.push(transaction);
    } else {
      const error = `Ooops, ${transaction.from} is trying to send ${
        transaction.amount
      } but only has ${fromBalance}`;
      console.log(error);
      return new Error(error);
    }
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  calulateDifficulty() {
    const ratio = this.chain.length / 2;
    this._difficulty = Math.ceil(ratio);
    return this._difficulty;
  }

  addBlock(newBlock) {
    const difficulty = this.calulateDifficulty();

    (newBlock.previousHash = this.getLatestBlock().hash),
      newBlock.mine(difficulty);

    if (this.isChainValid()) {
      this.chain.push(newBlock);
    }
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  get difficulty() {
    return this.calulateDifficulty();
  }

  get miningReward() {
    const everyTwoHunderdAndTenThousandBlocks =
      this.chain.length % this.halfingRate === 0;
    if (everyTwoHunderdAndTenThousandBlocks) {
      this._miningReward = this._miningReward / 2;
    }
    return this._miningReward;
  }
}

module.exports = BlockChain;
