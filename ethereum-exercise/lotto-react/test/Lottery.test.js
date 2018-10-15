const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;


// it이 실행되기전에 항상 먼저 실행되는 beforeEach 함수 임
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data : bytecode })
        .send({ from : accounts[0], gas : '1000000' })
});

describe('Lottery Contract', () => {

    //Test1
    it('컨트랙트 배포 TEST', () => {
        assert.ok(lottery.options.address);
    });

    it('1명의 참여자로 0.02이더 송금과 enter 함수 실행', async () => {

        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        })

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('3명의 참여자로 0.02이더 송금과 enter 함수를 실행함', async () => {
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from : accounts[1],
            value : web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from : accounts[2],
            value : web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it('1명의 참여자로 pickWinner를 테스트하고 잔액이 처음보다 증가 되었는지 확인함', async () => {
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({ from : accounts[0] });
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;

        assert(difference > web3.utils.toWei('1.8', 'ether'));
    });
});