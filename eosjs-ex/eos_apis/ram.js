const Eos = require('eosjs');

const config = {
    httpEndpoint : 'http://kylin-testnet.jeda.one:8888',
    chainId : '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
    keyProvider : ['5JYWRxp8Xe4EHkdcUvAeHMReWK7xeizTWAHdTLw7TGsAfUfSFtW']
};

// Eos(config).transaction(tr => {
//     tr.buyrambytes({
//         payer : 'allnations12',
//         receiver : 'allnations12',
//         bytes : 8192
//     })
// }).then(console.log).catch(console.error)

// EOS 기준
// Eos(config).transaction(tr => {
//     tr.buyram({
//         payer : 'allnations12',
//         receiver : 'allnations12',
//         quant : '1.0000 EOS'
//     })
// })

// 판매
Eos(config).transaction(tr => {
    tr.sellram({
        account : 'allnations12',
        bytes : 10000
    })
}).then(console.log).catch(console.error)