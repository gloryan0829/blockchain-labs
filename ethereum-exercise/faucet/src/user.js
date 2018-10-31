import web3 from './web3';
const localStorage = require('localStorage');


const adminAddr = "0x7f1b8a374070c074343b9b6758e01a0ed86775ac";

class UserAccount {

    constructor() {
        console.log(web3);
        console.log('user constructor');
    }

    getMyAccount() {
        return {
            _pubKey : localStorage.getItem('_pubKey'),
            _priKey : localStorage.getItem('_priKey')
        };
    }

    saveKey(_pubKey, _priKey) {
        localStorage.setItem('_pubKey', _pubKey);
        localStorage.setItem('_priKey', _priKey);
    }

    createAccount(){
        const account = web3.eth.accounts.create();
        console.log(account);
        this.saveKey(account['address'], account['privateKey']);
        return account;
    }

    receiveEther() {

    }

}
export default UserAccount;