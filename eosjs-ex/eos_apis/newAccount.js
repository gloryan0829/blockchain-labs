const Eos = require('eosjs');

const config = {
    httpEndpoint : 'http://kylin-testnet.jeda.one:8888',
    chainId : '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
    keyProvider : ['5JYWRxp8Xe4EHkdcUvAeHMReWK7xeizTWAHdTLw7TGsAfUfSFtW']
};

// const privateKey = '5JBbsvKPs5qcNB2gbP7AB3v4i9eggu8qQAQZp4X5dUoCMBTjwLV';
const publicKey = 'EOS57KScpYJk4Ag5HHywBWE3gwY6bd6SpKAaEoQmx3w6dhyFRSmnA';

Eos(config).transaction(tr => {
    tr.newaccount({
        creator : 'allnations12',
        name : 'allnations15',
        owner : publicKey,
        active : publicKey
    })

    // tr.buyrambytes({
    //     payer : 'allnations12',
    //     receiver : 'allnations14',
    //     bytes : 8192
    // })

    // tr.delegatebw({
    //     from : 'allnations12',
    //     receiver : 'allnations14',
    //     stake_cpu_quantity : '1.0000 EOS',
    //     stake_net_quantity : '1.0000 EOS',
    //     transfer : 1 // 0 빌려주는 거 1 주는거
    // })
}).then(console.log).catch(console.error)