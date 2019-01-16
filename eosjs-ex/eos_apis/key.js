const Eos = require('eosjs');

const { ecc } = Eos.modules;

ecc.randomKey().then(privateKey => {
    console.log(`privateKey : ${privateKey}`)
    const publicKey = ecc.privateToPublic(privateKey);
    console.log(`publicKey : ${publicKey}`)
});