import Web3 from 'web3';
import HDWalletProvider from 'truffle-hdwallet-provider';


// const web3 = new Web3(window.web3.currentProvider); 서버사이드코드라 윈도우 객체가 없는것은 당연하다

let web3;
(async () => {
    // if (typeof window !== 'undefined' && typeof window.Web3 !== 'undefined') {
        // web3 = new Web3(window.web3.currentProvider); // 브라우저가 동작한 상태와 MetaMask가 구동될 때...
        // web3 = new Web3(window.ethereum);
        // console.log(123);
        // try {
        //     await ethereum.enable();
        // } catch (error) {
        //     console.error('MetaMask accounts access denied...')
        // }
        // web3 = new Web3.providers.WebsocketProvider('ws://localhost:7545');


        const provider = new HDWalletProvider(
            'bind vault local impact example easily essence civil later pretty run giraffe',
            //'http://localhost:9545'
            'https://ropsten.infura.io/v3/8326226fd5694e83b2bbe607b0d8afce'
        );
        web3 = new Web3(provider);


    // } else {
        // 위와 다르게 브라우저가 아닌 상황에서 HttpProvider로 객체 생성..
        // const provider = new Web3.providers.HttpProvider(
        //     'https://rinkeby.infura.io/v3/8326226fd5694e83b2bbe607b0d8afce'
        // );
        //
        // web3 = new Web3(provider);
    // }
})();


export default web3;