const Eos = require('eosjs');

const config = {
    httpEndpoint : 'http://kylin-testnet.jeda.one:8888',
    chainId : '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
};

Eos(config).getBlock(6789631, (error, blockInfo) => {
    console.log(blockInfo.transactions[0].trx.transaction.actions.authorization)
});

// Eos(config).getBlock({block_num_or_id: 1}).then(console.log).catch(console.error);