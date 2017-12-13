const Block = require('./Block')

class BlockChain {

  constructor() {
    this.chain = [this.createGenesisBlock()]
    this._difficulty = 1
  }

  createGenesisBlock() {
    const firstBlock = {
      index:0,
      timestamp:new Date(),
      data: 'Genesis Block',
      previousHash:'0',
    }

    return new Block(firstBlock)
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }

  calulateDifficulty() {
    const ratio = this.chain.length/2
    this._difficulty = Math.ceil(ratio)
    return this._difficulty
  }

  addBlock(newBlock) {
    const difficulty = this.calulateDifficulty()

    newBlock.previousHash = this.getLatestBlock().hash,
    newBlock.mineBlock(difficulty)

    if(this.isChainValid()){
      this.chain.push(newBlock)
    }
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }

      if(currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }
    return true
  }

  get difficulty() {
    return this.calulateDifficulty()
  }
 }

module.exports = BlockChain
