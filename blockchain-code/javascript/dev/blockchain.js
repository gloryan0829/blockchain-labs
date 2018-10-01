const sha256 = require('sha256');

function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];
    this.createNewBlock(0, 0, 'GenesisBlock');
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const newBlock = {
        index : this.chain.length + 1,
        timestamp : Date.now(),
        transactions : this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash : previousBlockHash
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;

};

Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipent) {
    const newTransaction = {
        amount : amount,
        sender : sender,
        recipent : recipent
    };

    this.pendingTransactions.push(newTransaction);

    return this.pendingTransactions.length;
}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);

    return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    var nonce = 0;
    var hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 5) !== '00000') {
        nonce ++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    return nonce;
}

module.exports = Blockchain;