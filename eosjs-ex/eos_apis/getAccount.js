const Eos = require('eosjs');

const config = {
    httpEndpoint : 'http://39.108.231.157:30065',
    chainId : '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
};

Eos(config).getAccount({account_name : 'allnations12'}).then(console.log).catch(console.error);