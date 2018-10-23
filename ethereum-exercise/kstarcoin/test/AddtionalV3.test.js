/**
 * @Author 2018.10.23 by LEE
 * @description 본 테스트는 KStarLive Coin V3.0 테스트로 추가적인 테스트를 실행하고자 함
 */


const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const compiledContract = require('../compile');
const web3 = new Web3(ganache.provider());
const KStarCoin = compiledContract.contracts[':KStarCoin'];

require('events').EventEmitter.defaultMaxListeners = 0;

let kStarCoin;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    kStarCoin = await new web3.eth.Contract(JSON.parse(KStarCoin.interface))
        .deploy({ data : KStarCoin.bytecode })
        .send({ from : accounts[0], gas : '6000000' })
});

/**
 * @Test Unit Test 1
 * '10 케이스타코인를 보유한 accounts[1]이 5 케이스타코인를 잠그고 4 케이스타코인를 송금하고 2케이스타코인를 또 송금해본다' 케이스에서,
 *    - setLockValue 로 잔고 제한을 0으로 변경한 후 2 케이스타코인을 다시 송금하여 성공하는 케이스를 추가
 *    - lockTo 로 특정 계좌를 잠그는 테스트
 *    - lockTo 로 잠긴 계좌를 unlockTo 로 풀어주는 테스트
 */

describe('# Additional Unit Test 1 : 10 케이스타코인를 보유한 accounts[1]이 5 케이스타코인를 잠그고 4 케이스타코인를 송금하고 2케이스타코인를 또 송금해본다 케이스에서', () => {
    it('setLockValue 로 잔고 제한을 0으로 변경한 후 2 케이스타코인을 다시 송금하여 성공하는 케이스를 추가', async () => {
        // 전체 잠금 해제
        await kStarCoin.methods.unlock('테스트 잠금해제').send({
            from: accounts[0]
        });

        // 10 케이케이스타코인 accounts[1] 보유
        await kStarCoin.methods.kscTransfer(
            accounts[1],
            web3.utils.toWei('10', 'ether'),
            ''
        ).send({
            from: accounts[0]
        });

        // 잠금 5케이스타코인 설정
        await kStarCoin.methods.setLockValue(
            accounts[1],
            web3.utils.toWei('5', 'ether'),
            ''
        ).send({
            from : accounts[0]
        });

        // 4코 송금
        await kStarCoin.methods.kscTransfer(
            accounts[2],
            web3.utils.toWei('4', 'ether'),
            ''
        ).send({
            from: accounts[1]
        });

        let transferableBalance = await kStarCoin.methods.getMyUnlockValue().call({
            from: accounts[1]
        });

        assert.equal('1000000000000000000',
            transferableBalance
        );

        // 2 케이스타코인 송금 - 실패 해야함..
        await kStarCoin.methods.kscTransfer(
            accounts[2],
            web3.utils.toWei('2', 'ether'),
            ''
        ).send({
            from: accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // 실패 이후 잔고제한 0으로 바꿈
        await kStarCoin.methods.setLockValue(
            accounts[1],
            0,
            '잠금 제한 금액 0으로 변경함'
        ).send({
            from : accounts[0]
        });

        // 다시 2 케이스타코인 송금 수행
        await kStarCoin.methods.kscTransfer(
            accounts[2],
            web3.utils.toWei('2', 'ether'),
            ''
        ).send({
            from: accounts[1]
        });

        //accounts[2] 밸런스 확인하기 ( 총 6 케이스타코인이 있어야 함 )
        balance = await kStarCoin.methods.balanceOf(accounts[2]).call();

        console.log(web3.utils.fromWei(balance,'ether'));
        assert.equal(6, web3.utils.fromWei(balance,'ether'))
    });

    it('lockTo 로 특정 계좌를 잠그고 unlockTo로 풀어주는 테스트', async () => {
        // 전체 잠금 해제
        await kStarCoin.methods.unlock('테스트 잠금해제').send({
            from: accounts[0]
        });

        // 10 케이케이스타코인 accounts[1] 보유
        await kStarCoin.methods.kscTransfer(
            accounts[1],
            web3.utils.toWei('10', 'ether'),
            ''
        ).send({
            from: accounts[0]
        });

        // lockTo 테스트
        await kStarCoin.methods.lockTo(accounts[1], '')
            .send({
                from : accounts[0]
            });

        // lock 이 걸린 계정에서 출금 시도해 보기.
        await kStarCoin.methods.kscTransfer(
            accounts[2],
            web3.utils.toWei('10', 'ether'),
            ''
        ).send({
            from: accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // unlockTo 테스트
        await kStarCoin.methods.unlockTo(accounts[1], '')
            .send({
                from : accounts[0]
            });

        // 다시 송금해보기
        await kStarCoin.methods.kscTransfer(
            accounts[2],
            web3.utils.toWei('10', 'ether'),
            ''
        ).send({
            from: accounts[1]
        });

        assert.equal(
            web3.utils.toWei('10','ether'),
            await kStarCoin.methods.balanceOf(accounts[2]).call()
        );

    });
});


/**
 * @Test Unit Test 2
 * 전체가 lock 인 상태에서
 *    - unlockTo 를 지정하여 해당 계정에서 송금이 되는 테스트
 *    - unlock 상태인 계좌에 setLockValue 값을 설정하여 잔고 제한이 걸리는지 테스트
 *    - lock 상태인 계좌에도 setLockValue 값을 설정해본다. (어차피 이체는 안될것)
 *    - 위의 경우와 그 위의 경우 모두 전체를 unlock 으로 변경했을 때 setLockValue 값은 여전히 유지된다.
 */

describe('# Additional Unit Test 2 : 전체가 lock 인 상태에서', () => {

    it('unlockTo 를 지정하여 해당 계정에서 송금이 되는 테스트', async () => {
        // 10 케이케이스타코인 accounts[1] 보유 - constuctor에서 컨트랙트 소유주는 자동으로 unlockAddrs 맵핑 테이블에 담김
        await kStarCoin.methods.kscTransfer(
            accounts[1],
            web3.utils.toWei('10', 'ether'),
            ''
        ).send({
            from: accounts[0]
        });

        // 전체 잠금
        await kStarCoin.methods.lock('테스트 전체 잠금').send({
            from: accounts[0]
        });

        // accounts[1] unlockTo 실행
        await kStarCoin.methods.unlockTo(accounts[1], '')
            .send({
                from : accounts[0]
            });

        // 송금 시도
        await kStarCoin.methods.kscTransfer(
            accounts[2],
            web3.utils.toWei('1', 'ether'),
            ''
        ).send({
            from: accounts[1]
        });

        assert.equal(
            web3.utils.toWei('1','ether'),
            await kStarCoin.methods.balanceOf(accounts[2]).call()
        );
    });

    it('unlock 상태인 계좌에 setLockValue 값을 설정하여 잔고 제한이 걸리는지 테스트', async () => {
        // 10 케이케이스타코인 accounts[1] 보유 - constuctor에서 컨트랙트 소유주는 자동으로 unlockAddrs 맵핑 테이블에 담김
        await kStarCoin.methods.kscTransfer(
            accounts[1],
            web3.utils.toWei('10', 'ether'),
            ''
        ).send({
            from: accounts[0]
        });

        // 전체 잠금
        await kStarCoin.methods.lock('테스트 전체 잠금').send({
            from: accounts[0]
        });

        // accounts[1] unlockTo 실행
        await kStarCoin.methods.unlockTo(accounts[1], '')
            .send({
                from : accounts[0]
            });

        // 잠금 5케이스타코인 설정
        await kStarCoin.methods.setLockValue(
            accounts[1],
            web3.utils.toWei('5', 'ether'),
            ''
        ).send({
            from : accounts[0]
        });

        // lockValue 5가 넘는 6 송금 시도 (실패해야함)
        await kStarCoin.methods.kscTransfer(
            accounts[2],
            web3.utils.toWei('6', 'ether'),
            ''
        ).send({
            from: accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });
    });

    it('lock 상태인 계좌에도 setLockValue 값을 설정해본다. (어차피 이체는 안될것)', async ()=>{
        // 10 케이케이스타코인 accounts[1] 보유 - constuctor에서 컨트랙트 소유주는 자동으로 unlockAddrs 맵핑 테이블에 담김
        await kStarCoin.methods.kscTransfer(
            accounts[1],
            web3.utils.toWei('10', 'ether'),
            ''
        ).send({
            from: accounts[0]
        });

        // 특정 계좌 잠금
        await kStarCoin.methods.lockTo(accounts[1],'잠금').send({
            from: accounts[0]
        });

        // 특정 계좌에서 동일하게 5 코인 lockValue 걸어봄
        await kStarCoin.methods.setLockValue(
            accounts[1],
            web3.utils.toWei('5', 'ether'),
            ''
        ).send({
            from : accounts[0]
        });

        // lockValue 5가 넘는 6 송금 시도 (실패해야함)
        await kStarCoin.methods.kscTransfer(
            accounts[2],
            web3.utils.toWei('6', 'ether'),
            ''
        ).send({
            from: accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // 특정 계좌의 lockValue와 unlock 상태 확인
        const unlockAddrState = await kStarCoin.methods.unlockAddrs(accounts[1]).call();
        const lockValueOfAddr = await kStarCoin.methods.lockValues(accounts[1]).call();

        assert.equal(false, unlockAddrState);
        assert.equal(web3.utils.toWei('5', 'ether'), lockValueOfAddr);

    });

    it('위의 경우와 그 위의 경우 모두 전체를 unlock 으로 변경했을 때 setLockValue 값은 여전히 유지된다.', async ()=>{
        // 10 케이케이스타코인 accounts[1] 보유 - constuctor에서 컨트랙트 소유주는 자동으로 unlockAddrs 맵핑 테이블에 담김
        await kStarCoin.methods.kscTransfer(
            accounts[1],
            web3.utils.toWei('10', 'ether'),
            ''
        ).send({
            from: accounts[0]
        });

        // 전체 잠금 해제
        await kStarCoin.methods.unlock('테스트 전체 잠금').send({
            from: accounts[0]
        });

        // 특정 계좌 잠금 해제
        await kStarCoin.methods.unlockTo(accounts[1],'잠금').send({
            from: accounts[0]
        });

        // 특정 계좌에서 동일하게 5 코인 lockValue 걸어봄
        await kStarCoin.methods.setLockValue(
            accounts[1],
            web3.utils.toWei('5', 'ether'),
            ''
        ).send({
            from : accounts[0]
        });

        // lockValue 5가 넘는 6 송금 시도 (실패해야함)
        await kStarCoin.methods.kscTransfer(
            accounts[2],
            web3.utils.toWei('6', 'ether'),
            ''
        ).send({
            from: accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

    });
});


//
// #3. 꼼꼼하게 보는 차원에서,
//    관리자 권한인 함수들은 관리자가 아닌 계정에서 실행할 때
//    에러가 나는 것을 그래도 한번 더 체크해보면 좋겠음.
//    관리자 제한이 누락되는 경우가 종종 발생하는 중요한 실수이기 때문임.

/**
 * @Test Unit Test 3
 * 꼼꼼하게 보는 차원에서,
 *    - 관리자 권한인 함수들은 관리자가 아닌 계정에서 실행할 때
 *    - 에러가 나는 것을 그래도 한번 더 체크해보면 좋겠음.
 *    - 관리자 제한이 누락되는 경우가 종종 발생하는 중요한 실수이기 때문임.
 */

describe('꼼꼼하게 보는 차원에서,', () => {
    it('관리자 권한인 함수들은 관리자가 아닌 계정에서 실행할 때 에러 체크 해보기', async () => {

        // 10 케이케이스타코인 accounts[1] 보유 - constuctor에서 컨트랙트 소유주는 자동으로 unlockAddrs 맵핑 테이블에 담김
        await kStarCoin.methods.kscTransfer(
            accounts[1],
            web3.utils.toWei('10', 'ether'),
            ''
        ).send({
            from: accounts[0]
        });

        // changeSuperOwnerByDAO onlyOwner 테스트
        await kStarCoin.methods.changeSuperOwnerByDAO(accounts[2]).send({
            from : accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // lock onlyOwner 테스트
        await kStarCoin.methods.lock(accounts[2]).send({
            from : accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // unlock onlyOwner 테스트
        await kStarCoin.methods.unlock(accounts[2]).send({
            from : accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // lockTo onlyOwner 테스트
        await kStarCoin.methods.lockTo(accounts[2],'').send({
            from : accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // unlockTo onlyOwner 테스트
        await kStarCoin.methods.unlockTo(accounts[2],'').send({
            from : accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // setLockValue onlyOwner 테스트
        await kStarCoin.methods.setLockValue(accounts[2],0,'').send({
            from : accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // kscMintTo onlyOwner 테스트
        await kStarCoin.methods.kscMintTo(accounts[2], 10000, '').send({
            from : accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // kscBurnFrom onlyOwner 테스트
        await kStarCoin.methods.kscBurnFrom(accounts[1], 10000, '').send({
            from : accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // kscSell은 transferFrom을 실행하기 때문에 approve를 먼저 실행함
        await kStarCoin.methods.kscApprove(accounts[1], web3.utils.toWei('10','ether'),'')
            .send({
                from : accounts[0]
            });

        // kscSell onlyOwner 테스트
        await kStarCoin.methods.kscSell(
            accounts[0],
            accounts[2],
            web3.utils.toWei('10','ether'),
            ''
        ).send({
            from : accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // kscBatchSellByOtherCoin onlyOwner 테스트
        await kStarCoin.methods.kscBatchSellByOtherCoin(
            accounts[0],
            [accounts[2],accounts[3]],
            [web3.utils.toWei('1','ether'),web3.utils.toWei('1','ether')],
            1,
            [1,2],
            'note'
        ).send({
            from : accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // kscTransferToTeam onlyOwner 테스트
        await kStarCoin.methods.kscTransferToTeam(
            accounts[0],
            accounts[2],
            web3.utils.toWei('10','ether'),
            'note'
        ).send({
            from : accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // kscTransferToPartner onlyOwner 테스트
        await kStarCoin.methods.kscTransferToPartner(
            accounts[0],
            accounts[2],
            web3.utils.toWei('10','ether'),
            'note'
        ).send({
            from : accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // kscBatchTransferToEcosystem onlyOwner 테스트
        await kStarCoin.methods.kscBatchTransferToEcosystem(
            accounts[0],
            [accounts[2],accounts[3]],
            [web3.utils.toWei('1','ether'),web3.utils.toWei('1','ether')],
            1,
            [1,2],
            'note'
        ).send({
            from : accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // kscBatchTransferToBounty onlyOwner 테스트
        await kStarCoin.methods.kscBatchTransferToBounty(
            accounts[0],
            [accounts[2],accounts[3]],
            [web3.utils.toWei('1','ether'),web3.utils.toWei('1','ether')],
            1,
            [1,2],
            'note'
        ).send({
            from : accounts[1]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

        // owner 와 슈퍼 권한 없애기
        await kStarCoin.methods.deleteOwner(accounts[0]).send({
            from : accounts[0]
        });
        await kStarCoin.methods.changeSuperOwner(accounts[2]).send({
            from : accounts[0]
        });

        // destroy onlyRoot 테스트
        await kStarCoin.methods.destroy().send({
            from : accounts[0]
        }).catch((error) => {
            assert.equal('revert', error.results[error.hashes[0]].error);
        });

    });
});


/**
 * @Test Unit Test 4
 * LockableToken > DelayLockableToken 으로 Override 된 getMyUnlockValue() 테스트
 *
 */

describe('Unit Test 4 : LockableToken > DelayLockableToken 으로 Override 된 getMyUnlockValue() 테스트', () => {
    it('-', async () => {
        // 10 케이케이스타코인 accounts[1] 보유 - constuctor에서 컨트랙트 소유주는 자동으로 unlockAddrs 맵핑 테이블에 담김
        await kStarCoin.methods.kscTransfer(
            accounts[1],
            web3.utils.toWei('10', 'ether'),
            ''
        ).send({
            from: accounts[0]
        });

        await kStarCoin.methods.unlockTo(accounts[1],'').send({from:accounts[0]});


        await kStarCoin.methods.setLockValue(
            accounts[1],
            web3.utils.toWei('3', 'ether'),
            ''
        ).send({
            from : accounts[0]
        });

        // 내 계좌에서 동일하게 5 코인 delayLock을 걸어봄
        await kStarCoin.methods.delayLock(
            web3.utils.toWei('5', 'ether')
        ).send({
            from : accounts[1]
        });

        // 내 계좌에서 동일하게 4 코인 delayLock을 걸어봄
        await kStarCoin.methods.delayLock(
            web3.utils.toWei('4', 'ether')
        ).send({
            from : accounts[1]
        });

        // lockValue 5에서 4 송금 해봄...
        await kStarCoin.methods.kscTransfer(
            accounts[2],
            web3.utils.toWei('2', 'ether'),
            ''
        ).send({
            from: accounts[1]
        });

        let getBalance = await kStarCoin.methods.balanceOf(accounts[1]).call();
        let getMyUnlockValue = await kStarCoin.methods.getMyUnlockValue().call({from:accounts[1]});

        console.log(getBalance + ' / ' + getMyUnlockValue);

    });
});