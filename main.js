const BlockChain = require('./BlockChain')
const Block = require('./Block')

let blockchain = new BlockChain();

// minining 9 block 
for(let i = 1; i < 10; i++){
  console.log(`Mining Block ${i} with difficulty ${blockchain.difficulty}`);
  const newBlock = new Block({
    index:i,
    timestamp:new Date(),
    data:{ amount:i * 10 }
  })
  blockchain.addBlock(newBlock)
}

console.log('blockchain valid : ' + blockchain.isChainValid());
console.log('Trying to invalidate last coin');

let ninthCoin = blockchain.chain[9].data.amount = 1000000

console.log('blockchain valid : ' + blockchain.isChainValid());
console.log(JSON.stringify(blockchain,null,4));
