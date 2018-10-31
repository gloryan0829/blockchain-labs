const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');


/**
 * 생성자 함수
 * @constructor
 */
function Blockchain() {
    this.chain = []; // Blockchain 데이터들
    this.pendingTransactions = []; // 거래에대한 Transaction 을 전송함 ( Mempool 에 쌓이게 되는 아직 처리 되지 않은 트랜잭션 집합 )

    this.currentNodeUrl = currentNodeUrl; // 현재 서버를 띄운 노드의 주소
    this.networkNodes = []; // 연결된 노드들

    this.createNewBlock(100, '0', '0'); // Genesis 블록
}

/**
 * 블록을 생성하는 함수
 * @param nonce 마이닝
 * @param 이전 블록의 해시 값
 * @param 현재 블록의 해시 값
 * @returns 생성된 블록의 결과 값
 */
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


/**
 * 블록체인의 길이를 구하는 함수
 * @returns 현재 Chain의 길이 (Length)
 */
Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
};

/**
 * 트랜잭션 데이터들을 Object로 반환하는 함수
 * @param 코인 전송량
 * @param 보낸 사람의 주소
 * @param 받는 사람의 주소
 * @returns Transaction Object 데이터로 변환
 */
Blockchain.prototype.createNewTransaction = function(amount, sender, recipent) {
    return {
        amount : amount,
        sender : sender,
        recipent : recipent,
        transactionId : uuid().split('-').join('')
    };
};

/**
 * 아직 블록화 되지 않은 pending transaction들을 추가
 * @param Transaction Object 데이터
 * @returns 현재 블록 길이 + 1
 */
Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] + 1;
};

/**
 * 블록의 Header에 Hash 값을 구하는 함수
 * @param 이전 블록의 해시값
 * @param 현재 블록에 담긴 데이터들 ( pendingTransaction )
 * @param ProofOfWork에서 증가되는 Nonce 값
 */
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);

    return hash;
};

/**
 * PoW 마이닝 함수 while 문에서 비교하는 '0000' 은 난이도를 조절할 수 있는 Factor임
 * @param 이전 블록의 해시값
 * @param 현재 블록에 담긴 데이터들 ( pendingTransaction )
 * @returns 마이닝이 완료되었을 때 현재 Nonce
 */
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    var nonce = 0;
    var hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 5) !== '00000') {
        nonce ++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    return nonce;
};

/**
 * 체인을 검증할 때 이전 블록 해시와 현재 블록의 해시를 비교하여 틀린지 비교하는 함수
 * @param 노드가 보유한 Blockchain Data
 * @returns Chain이 Vaild 한 상태인지 true/false
 */
Blockchain.prototype.chainIsValid = function(blockchain) {

    let validChain = true;

    for (var i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const prevBlock = blockchain[i - 1];
      const blockHash = this.hashBlock(
                                prevBlock['hash'],
                                {
                                    index : currentBlock['index'],
                                    transactions : currentBlock['transactions']
                                },
                                currentBlock['nonce']
          );
      if(blockHash.substring(0, 4) !== '0000') validChain = false;
      if(currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
    }
    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] === '0';
    const correctTransactions = genesisBlock['transactions'].length === 0;

    if( !correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions ) validChain = false;

    return validChain;
};

/**
 * block-explorer UI에서 사용하는 함수 getBlock
 * @param 블록 해시 값
 * @returns 블록 해시 값에 맞는 블록 데이터
 */
Blockchain.prototype.getBlock = function(blockHash) {
    let correctBlock = null;
    this.chain.forEach(block => {
        if (block.hash === blockHash) correctBlock = block;
    });

    return correctBlock;
};

/**
 * 트랜잭션 Id로 트랜잭션 데이터를 검색하는 함수
 * @param 트랜잭션 ID
 * @returns 트랜잭션 데이터
 */
Blockchain.prototype.getTransaction = function(transactionId) {
    let correctTransaction = null;
    let correctBlock = null;
    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if (transaction.transactionId === transactionId) {
                correctTransaction = transaction;
                correctBlock = block;
            }
        })
    });
    return {
        transaction : correctTransaction,
        block : correctBlock
    };
};

/**
 * 유저 계정의 주소의 잔고를 확인하기 위한 부분으로 UTXO를 프로토타입으로 구현한 함수입니다
 * @param 유저 Address
 * @returns 유저의 잔고와 유저와 관련된 트랜잭션 리스트를 출력함
 */
Blockchain.prototype.getAddressData = function(address) {
    const addressTransactions = [];
    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
           if(transaction.sender == address || transaction.recipent == address)
               addressTransactions.push(transaction);
        });
    });

    let balance = 0;
    addressTransactions.forEach(transaction => {
        if (transaction.recipent === address) balance += transaction.amount;
        else if (transaction.sender === address) balance -= transaction.amount;
    });

    return {
        addressTransactions : addressTransactions,
        addressBalance : balance
    };

};

module.exports = Blockchain;