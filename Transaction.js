const Wallet = require("./Wallet");

class Tranasction {
  constructor({ from, to, amount, fee }) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.fee = fee;
  }
}

module.exports = Tranasction;
