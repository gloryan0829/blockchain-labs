const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');


const provider = new HDWalletProvider(
    'bind vault local impact example easily essence civil later pretty run giraffe',
    'https://rinkeby.infura.io/v3/8326226fd5694e83b2bbe607b0d8afce'
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    console.log('Attempting to deploy from account', accounts[0]);
    console.log('the balance of account', await web3.eth.getBalance(accounts[0]));

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory['interface']))
        .deploy({ data: '0x' + compiledFactory['bytecode'] })
        .send({ from: accounts[0] });

    console.log('Contract deployed to', result.options.address);
};
deploy();

// 0x0C4a25015801097c1Dd57385A001727339035fb1