const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

const previousBlockHash = 'OSDFWEFWEFKJZXCVKJSFEW';
const currentBlockData = [
    {
        amount : 10,
        sender : 'NASFWEFWEFWEFK',
        recipent : 'SFKWEJFLWEJFWEF'
    },{
        amount : 30,
        sender : 'NASFWEFWEFWEFK',
        recipent : 'SFKWEJFLWEJFWEF'
    },{
        amount : 40,
        sender : 'NASFWEFWEFWEFK',
        recipent : 'SFKWEJFLWEJFWEFA'
    }
];

const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);


console.log(nonce);
console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));
