const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');


const nodeAddress = uuid().split('-').join('');

// 블록체인 생성자를 통해 개체를 생성함
const bitcoin = new Blockchain();

// express 모듈에 request, response의 내용을 json 데이터 구조로 받기 위한 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

/**
 * @method GET
 * @description 브라우저에 블록체인 데이터 출력
 */
app.get('/blockchain', function(req, res) {
    res.send(bitcoin);
});

/**
 * @method POST
 * @description 거래의 트랜잭션을 Mempool 에 추가하는 개념으로 생각하면되 PendingTransaction에 추가됨
 */
app.post('/transaction', function(req, res) {
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
    res.json({ msg : 'Transaction will be added in block ' + blockIndex});
});

/**
 * @method POST
 * @description /transaction 과 똑같은 역할을 하지만 연결된 다른 노드에 동일한 거래 트랜잭션을 전파한다
 */
app.post('/transaction/broadcast', function(req, res) {
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipent);
    bitcoin.addTransactionToPendingTransactions(newTransaction);

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
       const requestOptions = {
           uri : networkNodeUrl + '/transaction',
           method : 'POST',
           body : newTransaction,
           json : true
       };
       requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
        .then(data => {
           res.json({ msg : 'Transaction created and broadcast successfully.'});
        });
});

/**
 * @method GET
 * @description 마이닝을 하는 함수를 호출하는 URL로 ProoOfWork(작업량증명)을 실행하고
 * Nonce를 찾게 되면 블록을 만들어 준다. 그리고 연결된 노드에게 블록을 전파하며 마이닝에 성공한 노드에게 12.5의 코인을
 * 주게된다.
 */
app.get('/mine', function(req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        index : lastBlock['index'] + 1,
        transactions : bitcoin.pendingTransactions
    };

    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {

        const requestOptions = {
             uri : networkNodeUrl + '/receive-new-block',
             method : 'POST',
             body : { newBlock : newBlock },
             json : true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
        .then(data => {

            const requestOptions = {
                uri : bitcoin.currentNodeUrl + '/transaction/broadcast',
                method : 'POST',
                body : {
                    amount : 12.5,
                    sender : "00",
                    recipent : nodeAddress
                },
                json : true
            };

            return rp(requestOptions);

        })
        .then(data => {
            res.json({
                msg : 'mined successfully..',
                mineBlock : newBlock
            });
        });
});

/**
 * @method POST
 * @description /mine에서 사용되는 API로 마이닝시 연결된 노드들한테 블록을 전파할 수 있음
 */
app.post('/receive-new-block', function(req, res) {
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

    if ( correctHash && correctIndex ) {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        res.json({
            msg : 'New Block received and accepted.',
            newBlock : newBlock
        })
    } else {
        res.json({
            msg : 'New Block rejected...',
            newBlock : newBlock
        })
    }
});

/**
 * @description 노드를 연결할 수 있는 API 특정 노드에 연결하고자 하는 노드를 추가하게 되면 전체 노드에 연결이 됨
 */
app.post('/register-and-broadcast-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;

    if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

    const regNodesPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOption = {
            uri : networkNodeUrl + '/register-node',
            method : 'POST',
            body : { newNodeUrl : newNodeUrl },
            json : true
        };

        regNodesPromises.push(rp(requestOption));
    });

    Promise.all(regNodesPromises)
        .then(data => {
            const bulkRegisterOptions = {
                uri : newNodeUrl + '/register-nodes-bulk',
                method : 'POST',
                body : { allNetworkNodes : [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
                json : true
            };

            return rp(bulkRegisterOptions);
        })
        .then(data => {
            res.json({ msg : 'New node registered with network successfully. '})
        });

});

/**
 * @method POST
 * @description 노드를 연결할 수 있는 API /register-and-broadcast-node 에서 쓰이고 있음
 */
app.post('/register-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if( nodeNotAlreadyPresent && notCurrentNode )bitcoin.networkNodes.push(newNodeUrl);
    res.json({ msg : 'New node registered successfully with node.' });
});

/**
 * @method POST
 * @description 노드를 연결할 수 있는 API /register-and-broadcast-node 에서 쓰이고 있음
 */
app.post('/register-nodes-bulk', function(req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;

        if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
    });

    res.json({ msg : 'Bulk registration successful. '});
});

/**
 * @method GET
 * @description 컨세서스 API로 가장 긴 체인이 Truth를 바탕으로 노드가 상대적으로 짧은 블록체인 데이터를 갖고 있게 된다면
 * 긴 체인의 데이터로 바꿔준다
 */
app.get('/consensus', function(req, res) {

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
       const requestOptions = {
           uri : networkNodeUrl + '/blockchain',
           method : 'GET',
           json : true
       };
       requestPromises.push(rp(requestOptions));
    });
    Promise.all(requestPromises)
        .then(blockchains => {

            const currentChainLength = bitcoin.chain.length;
            let maxChainLength = currentChainLength;
            let newLongestChain = null;
            let newPendingTransactions = null;

            blockchains.forEach(blockchain => {
                if (blockchain.chain.length > maxChainLength) {
                    maxChainLength = blockchain.chain.length;
                    newLongestChain = blockchain.chain;
                    newPendingTransactions = blockchain.pendingTransactions;
                }
            });

            if(!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
                res.json({
                    msg : 'Current chain has not been replaced',
                    chain : bitcoin.chain
                })
            }
            else if (newLongestChain && bitcoin.chainIsValid(newLongestChain)) {
                bitcoin.chain = newLongestChain;
                bitcoin.pendingTransactions = newPendingTransactions;
                res.json({
                    msg : 'This chain has been replaced',
                    chain : bitcoin.chain
                });
            }
        });
});

/**
 * @method GET
 * @description Block-Explorer : BlockHash 값을 바탕으로 Block의 정보를 찾아줌
 * @return dev/block-explorer/index.html
 */
app.get('/block/:blockHash', function(req, res) {
    const blockHash = req.params.blockHash;
    const correctBlock = bitcoin.getBlock(blockHash);
    res.json({
       block: correctBlock
    });
});


/**
 * @method GET
 * @description Block-Explorer : Transaction ID를 기준으로 해당 트랜잭션 데이터와 블록을 출력함
 * @return dev/block-explorer/index.html
 */
app.get('/transaction/:transactionId', function(req, res) {
    const transactionId = req.params.transactionId;
    const transactionData = bitcoin.getTransaction(transactionId);
    res.json({
        transaction : transactionData.transaction,
        block : transactionData.block
    });
});


/**
 * @method GET
 * @description Block-Explorer : Account 주소를 찾아 얼마를 가지고 있는지 잔고를 가지고 옴
 * @return dev/block-explorer/index.html
 */
app.get('/address/:address', function(req, res) {
    const address = req.params.address;
    const addressData = bitcoin.getAddressData(address);
    res.json({
        addressData : addressData
    });
});

/**
 * @method GET
 * @description HTML코드로 화면 UI를 브라우저에 출력함
 * @return dev/block-explorer/index.html
 */
app.get('/block-explorer', function(req, res) {
   res.sendFile('./block-explorer/index.html', { root : __dirname });
});


/**
 * @method GET
 * @description 서버 노드의 포트
 */
app.listen(port, function() {
    console.log('Server Started. Listening on port ' + port);
});