import Web3 from 'web3';

// const web3 = new Web3(window.web3.currentProvider); 서버사이드코드라 윈도우 객체가 없는것은 당연하다

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider); // 브라우저가 동작한 상태와 MetaMask가 구동될 때...
} else {
    // 위와 다르게 브라우저가 아닌 상황에서 HttpProvider로 객체 생성..
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/8326226fd5694e83b2bbe607b0d8afce'
    );

    web3 = new Web3(provider);
}


export default web3;