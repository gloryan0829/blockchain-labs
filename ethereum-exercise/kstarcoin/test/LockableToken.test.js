const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const compiledContract = require('../compile');
const web3 = new Web3(ganache.provider());
const LockableToken = compiledContract.contracts[':LockableToken'];

require('events').EventEmitter.defaultMaxListeners = 0;

let lockableToken;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lockableToken = await new web3.eth.Contract(JSON.parse(LockableToken.interface))
        .deploy({ data : LockableToken.bytecode })
        .send({ from : accounts[0], gas : '3000000' })
});

describe('LockableToken Contract', () => {

    describe('#init()', () => {

        it('컴파일 및 컨트랙트 배포 완료 테스트 ', () => {
            assert.ok(lockableToken.options.address);
            console.log(accounts);
        });

        it('생성자 실행 후 msg.sender UnlockAddr 포함 되어있는지 확인', async () => {
            assert.equal(true,
                await lockableToken.methods.unlockAddrs(accounts[0]).call());
        });

    });

    describe('#unlock()', () => {
        it('Owner 권한이 있는 accounts[0]이 전체 계정의 밸런스 출금을 해제함', async () => {

            await lockableToken.methods.unlock('테스트 잠금 해제').send({
                from: accounts[0]
            });

            assert.equal(false,
                await lockableToken.methods.locked().call()
            );
        });
    });

    describe('#lock()', () => {

        it('Owner 권한이 있는 accounts[0]이 전체 계정의 밸런스 출금을 잠금', async () => {

            await lockableToken.methods.unlock('테스트 잠금 해제').send({
                from: accounts[0]
            });
            // 잠금 해제 후
            assert.equal(false,
                await lockableToken.methods.locked().call()
            );

            await lockableToken.methods.lock('테스트 잠금').send({
                from: accounts[0]
            });

            // 잠금 확인
            assert.equal(true,
                await lockableToken.methods.locked().call()
            );

        });
    });

    describe('#unlockTo(), #setLockValue()', () => {

        it('Owner 권한이 있는 accounts[0]이 accounts[1]의 계좌를 잠근다.', async () => {

            // Owner 권한이 없는 계정에서 시도해본다 modifier 테스트..onlyOwner

            lockableToken.methods.unlockTo(accounts[1], '테스트로 잠금 실패 예상').send({
                from: accounts[2]
            }, (error, result) => {
                if (error) {
                    assert.equal('revert',
                        error.results[error.hashes[0]].error
                    );
                }
            });

            await lockableToken.methods.unlockTo(accounts[1], '테스트로 잠금').send({
                from: accounts[0]
            });

            // unlock 시 lockValue 가 0 으로 Setting 되었는지 확인 함

            assert.equal(0,
                await lockableToken.methods.lockValues(accounts[1]).call()
            );

            // unlock 시 unlockAddr[address] mapping type 변수에 true 값이 출력 되는 지 확인함

            assert.equal(true,
                await lockableToken.methods.unlockAddrs(accounts[1]).call()
            );

        });
    });

    // getMyUnlockValue의 경우 Token 발행 시 테스트를 다시 해야함 - balance 가 없기 때문에..
    describe('#getMyUnlockValue()', () => {

        it('우선 이체 가능 금액이 0이 출력 되는지만 확인하자. 향후 토큰 발행 후 erc20 토큰 balance 가 있어야 테스트가 가능함', async () => {

            // accounts[0] 잠금 후
            await lockableToken.methods.lock('테스트 잠금').send({
                from: accounts[0]
            });

            // 이체 불가능 확인
            // assert.equal(0,
            //     await lockableToken.methods.getMyUnlockValue().send({
            //         from: accounts[1]
            //     })
            // );

            await lockableToken.methods.unlock('테스트 잠금해제').send({
                from: accounts[0]
            });

            lockableToken.methods.getMyUnlockValue().call({
                from: accounts[1]
            },(error, result) => {
                if(!error) {
                    assert.equal(0, result);
                }
            });
        });
    });
});
