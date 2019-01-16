const Eos = require('eosjs');

const config = {
    httpEndpoint : 'http://kylin-testnet.jeda.one:8888',
    chainId : '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
    keyProvider : ['5JYWRxp8Xe4EHkdcUvAeHMReWK7xeizTWAHdTLw7TGsAfUfSFtW']
};

// Eos(config).transfer('allnations12', 'allnations13', '10.0000 EOS', 'test tranfer')
//     .then((result) => {
//         console.log(result)
//     }).catch(console.error);



(async () => {
    const result = await Eos(config).transaction({
        actions: [{
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
                actor: 'allnations12',
                permission: 'active',
            }],
            data: {
                from: 'allnations12',
                to: 'allnations13',
                quantity: '0.0001 EOS',
                memo: '',
            },
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    });
    console.dir(result);
})();

// allnations13