class Wallet {
  constructor(address) {
    this.address = address;
  }

  getBalance(chain) {
    let total = 0;
    for (const block of chain) {
      for (const transaction of block.transactions) {
        if (transaction.from === this.address) {
          total -= transaction.amount;
        }
        if (transaction.to === this.address) {
          total += transaction.amount;
        }
      }
    }
    return total;
  }
}

module.exports = Wallet;
