const Block = require("./Block");
const Transaction = require("./Transaction");

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this._difficulty = 1;
    this.pendingTransactions = [];
    this.miningReward = 100;
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

  minePendingTransactions(miningRewardAddress) {
    var lastBlock = this.chain[this.chain.length - 1];
    let block = new Block({
      timestamp: new Date(),
      transactions: this.pendingTransactions,
      previousHash: lastBlock.hash
    });
    this.addBlock(block);
    this.pendingTransactions = [
      new Transaction({
        from: "GenesisBlock",
        to: miningRewardAddress,
        amount: this.miningReward
      })
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
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
}

module.exports = BlockChain;
