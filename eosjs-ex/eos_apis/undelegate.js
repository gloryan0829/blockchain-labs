const Eos = require('eosjs');

const config = {
    httpEndpoint : 'http://kylin-testnet.jeda.one:8888',
    chainId : '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
    keyProvider : ['5JYWRxp8Xe4EHkdcUvAeHMReWK7xeizTWAHdTLw7TGsAfUfSFtW']
};

Eos(config).transaction(tr => {
    tr.undelegatebw({
        from : 'allnations12',
        receiver : 'allnations13',
        unstake_cpu_quantity : '0.1000 EOS',
        unstake_net_quantity : '0.1000 EOS',
        transfer : 0 // 가져오는 개념 0 ( 주는 개념이 없다 1 )
    })
}).then(console.log).catch(console.error)
