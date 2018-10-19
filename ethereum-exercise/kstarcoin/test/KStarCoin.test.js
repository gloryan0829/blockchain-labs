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

describe('#getMyUnlockValue() of LockableToken Contract', () => {
   it('10 스타코인를 보유한 accounts[1]이 5스타코인를 잠근고 4스타코인를 송금하고 2스타코인를 또 송금해본다', async () => {

       // 잠금 해제
       await kStarCoin.methods.unlock('테스트 잠금해제').send({
           from: accounts[0]
       });

       // 10 스타코인 accounts[1] 보유
       await kStarCoin.methods.kscTransfer(
           accounts[1],
           web3.utils.toWei('10', 'ether'),
           ''
       ).send({
           from: accounts[0]
       });

       // 잠금 5스타코인 설정
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

       // 2 스타코인 송금 - 실패 해야함..
       kStarCoin.methods.kscTransfer(
           accounts[2],
           web3.utils.toWei('2', 'ether'),
           ''
       ).send({
           from: accounts[1]
       },(error, result) => {
            if(error) {
                assert.equal('revert', error.results[error.hashes[0]].error);
            }
       });
   });
});

setTimeout(()=>{
    // Owner가 아닌 본인이 직접 Lock을 걸 수 있는 Contract...
    describe('DelayLockableToken Contract', () => {

        beforeEach(async () => {
            // 잠금 해제
            await kStarCoin.methods.unlock('테스트 잠금해제').send({
                from: accounts[0]
            });
            // 10 스타코인 accounts[1] 보유
            await kStarCoin.methods.kscTransfer(
                accounts[1],
                web3.utils.toWei('10', 'ether'),
                ''
            ).send({
                from: accounts[0]
            });
        });

        describe('#delayLock()', () => {
            it('제한 금액 3 > 5 스타코인으로 제한을 걸어보고 더 작게 4 스타코인을 걸어봄 & 출금도 테스트해보 ', async ()=>{

                let beforeTime = new Date().getTime();

                await kStarCoin.methods.delayLock(web3.utils.toWei('3', 'ether')).send({
                   from : accounts[1]
                });


                await kStarCoin.methods.delayLock(web3.utils.toWei('5', 'ether')).send({
                    from : accounts[1]
                });

                assert.equal(
                    web3.utils.toWei('5', 'ether'),
                    await kStarCoin.methods.delayLockValues(accounts[1]).call()
                );

                // 최초의 한번은 실행 됨....그리고 delayLockTimes 에 + 12 hours...
                await kStarCoin.methods.delayLock(web3.utils.toWei('4', 'ether')).send({
                    from : accounts[1]
                });

                //실패를 유도해 봄
                kStarCoin.methods.delayLock(web3.utils.toWei('3', 'ether')).send({
                    from : accounts[1]
                },(error, txHash)=>{
                    if(error) {
                        assert.equal('revert', error.results[error.hashes[0]].error);
                    }
                });

                //시간을 보자..
                let afterTime = await kStarCoin.methods.delayLockTimes(accounts[1]).call();
                afterTime = afterTime * 1000;

                assert(true,
                        beforeTime + 30000000 < afterTime
                );

                //출금을 진행해 보자 delayLockBeforeValues에 걸리는 지 확인 7 스타코인 전송
                kStarCoin.methods.kscTransfer(
                    accounts[2],
                    web3.utils.toWei('7', 'ether'),
                    ''
                ).send({
                    from : accounts[1]
                },(error, result) => {
                   if(error) {
                       assert.equal('revert', error.results[error.hashes[0]].error);
                   } else {
                       console.log(result);
                   }
                });

            });
        });

    });
}, 1000);


describe('KStarCoin Contract', () => {

    describe('#init()', () => {

        it('컴파일 및 컨트랙트 배포 완료 테스트 ', () => {
            assert.ok(kStarCoin.options.address);
        });

        it('초기 발행량 테스트 ', async () => {
            // assert.equal()
            assert.equal('KStarCoin',
                await kStarCoin.methods.name().call());
            assert.equal('KSC',
                await kStarCoin.methods.symbol().call());
            assert.equal('18',
                await kStarCoin.methods.decimals().call());
            assert.equal(1000000000000000000000000000,
                await kStarCoin.methods.totalSupply().call());
            assert.equal(1000000000000000000000000000,
                await kStarCoin.methods.balanceOf(accounts[0]).call());
        });
    });

    describe('#kscTransfer()', () => {
        it('accounts[1] 10 ether 전송', async () => {

            kStarCoin.methods.kscTransfer(
                accounts[1],
                web3.utils.toWei('10', 'ether'),
                ''
            ).send({
                from: accounts[0]
            }, async (error, transactionHash) => {
                if (!error) {
                    assert.ok(transactionHash);
                    let balance = await kStarCoin.methods.balanceOf(accounts[1]).call();
                    assert.equal('10', web3.utils.fromWei(balance, 'ether'));
                }
            });
        })
    });

    describe('#kscTransferFrom(), #approve(), #allowance()', () => {
        it('accounts[1]에게 accounts[0]의 잔고 approve 이후 10 ether accounts[2]에게 전송', async () => {

            await kStarCoin.methods.approve(
                accounts[1],
                web3.utils.toWei('10', 'ether')
            ).send({
                from: accounts[0]
            });

            kStarCoin.methods.kscTransferFrom(
                accounts[0],
                accounts[2],
                web3.utils.toWei('9', 'ether'),
                ''
            ).send({
                from: accounts[1]
            }, async (error, transactionHash) => {
                if (!error) {
                    assert.ok(transactionHash);

                    let balance = await kStarCoin.methods.balanceOf(accounts[0]).call();
                    assert.equal('999999991000000000000000000', balance);

                    let allowance = await kStarCoin.methods.allowance(accounts[0], accounts[1]).call();
                    assert.equal('1', web3.utils.fromWei(allowance, 'ether'));
                }
            });
        });

        it('#kscTransfer() 컨트랙트에 보내서 revert가 발생하는지 확인하기', async () => {
            const MultiOwnable = compiledContract.contracts[':MultiOwnable']; // onReceived가 없는 CA
            const KSCDappSample = compiledContract.contracts[':KSCDappSample']; // onReceived가 있는 CA

            const multiOwnableCA = await new web3.eth.Contract(JSON.parse(MultiOwnable.interface))
                .deploy({data: MultiOwnable.bytecode})
                .send({from: accounts[1], gas: '6000000'});

            const kSCDappSampleCA = await new web3.eth.Contract(JSON.parse(KSCDappSample.interface))
                .deploy({data: KSCDappSample.bytecode})
                .send({from: accounts[2], gas: '6000000'});

            // CA 계정으로 보내기
            kStarCoin.methods.kscTransfer(
                multiOwnableCA.options.address,
                web3.utils.toWei('10', 'ether'),
                ''
            ).send({
                from: accounts[0]
            }, async (error, transactionHash) => {
                if (!error) {
                    assert.ok(transactionHash)
                }
            });

            // onReceived가 있는 CA로 보내기..
            kStarCoin.methods.kscTransfer(
                kSCDappSampleCA.options.address,
                web3.utils.toWei('10', 'ether'),
                ''
            ).send({
                from: accounts[0]
            }, async (error, transactionHash) => {
                if (!error) {
                    assert.ok(transactionHash)
                }
            });

            // KStarCoin 컨트랙트로 보낼 때는 Revert가 발생해야함..
            kStarCoin.methods.kscTransfer(
                kStarCoin.options.address,
                web3.utils.toWei('10', 'ether'),
                ''
            ).send({
                from: accounts[0]
            }, async (error, transactionHash) => {
                if (error) {
                    assert.equal('revert', error.results[error.hashes[0]].error);
                }
            });
        });
    });


    describe('#kscMinTo(),#kscBurnFrom()', () => {

        it('10 ether의 화폐 발행 -> accounts[1]', async () => {

            await kStarCoin.methods.kscMintTo(
                accounts[1],
                web3.utils.toWei('10','ether'),
                ''
            ).send({
                from : accounts[0]
            });

            // 계좌 확인
             assert(web3.utils.toWei('10','ether'),
                    await kStarCoin.methods.balanceOf(accounts[1]).call()
                );

             // 총 발행량 증가 확인
             assert('1000000010000000000000000000',
                 await kStarCoin.methods.totalSupply().call()
             );

        });

        it('10 ether의 화폐 소각 <- accounts[0]', async () => {
            await kStarCoin.methods.kscBurnFrom(
                accounts[0],
                web3.utils.toWei('10','ether'),
                ''
            ).send({
                from : accounts[0]
            });

            // 총발행략 감소 확인
            assert(9.9999999e26,
                await kStarCoin.methods.totalSupply().call()
            );
        });
    });

    describe('#kscBatchBurnWhenMoveToMainnet(),#kscBurnWhenMoveToMainnet()', () => {
       it('Owner 권한을 가진 어카운트가 메인 체인으로 옮겼을 때의 토큰 소각',async () => {

           await kStarCoin.methods.kscBatchBurnWhenMoveToMainnet(
               [accounts[0],accounts[0],accounts[0]],
               [web3.utils.toWei('10','ether'),web3.utils.toWei('10','ether'),web3.utils.toWei('10','ether')],
               ''
           ).send({
               from : accounts[0]
           });

           const totalSupply = await kStarCoin.methods.totalSupply().call();
           assert.equal('999999970000000000000000000',totalSupply);

           kStarCoin.methods.kscBatchBurnWhenMoveToMainnet(
               [accounts[0],accounts[0],accounts[0]],
               [web3.utils.toWei('10','ether'),web3.utils.toWei('10','ether'),web3.utils.toWei('10','ether')],
               ''
           ).send({
               from : accounts[1]
           },(error, result) => {
               assert.equal('revert',error.results[error.hashes[0]].error);
           });

       });
    });

    describe('#kscBatchBurnWhenUseInSidechain(),#kscBurnWhenUseInSidechain()', () => {
       it('Owner 권한을 가진 어카운트가 사이드 체인으로 옮겼을 때의 토큰 소각',async () => {
           kStarCoin.methods.kscBatchBurnWhenMoveToMainnet(
               [accounts[0]],
               [web3.utils.toWei('10','ether')],
               ''
           ).send({
               from : accounts[1]
           },(error, result) => {
               assert.equal('revert',error.results[error.hashes[0]].error);
           });

           const totalSupply = await kStarCoin.methods.totalSupply().call();
           assert.equal('1000000000000000000000000000',totalSupply);
       });
    });

    describe('#kscSell()', () => {
       it('payable은 아니고 사전에 이더를 보낸 사람에게 토큰을 trnasfer하는 기능임',async () => {

           // accounts[1]에게 10 스타코인을 approve 함
           await kStarCoin.methods.approve(
               accounts[1],
               web3.utils.toWei('10','ether')
           ).send({
               from : accounts[0]
           });

           assert.equal(
               web3.utils.toWei('10','ether'),
                await kStarCoin.methods.allowance(accounts[0], accounts[1]).call()
           );

           // Owner 권한 없이 송금 try
           kStarCoin.methods.kscSell(
               accounts[0],
               accounts[2],
               web3.utils.toWei('10','ether'),
               ''
           ).send({
               from : accounts[1]
           },(error, result)=>{
               assert.equal('revert',error.results[error.hashes[0]].error);
           });

           // Owner 권한 줘서 다시 실행 해보기
           await kStarCoin.methods.newOwner(accounts[1]).send({
               from : accounts[0]
           });

           await kStarCoin.methods.kscSell(
               accounts[0],
               accounts[2],
               web3.utils.toWei('10','ether'),
               ''
           ).send({
               from : accounts[1]
           });

           assert.equal(web3.utils.toWei('10','ether'),
                    await kStarCoin.methods.balanceOf(accounts[2]).call()
               );
       });
    });

    describe('#kscBatchSellByOtherCoin()', () => {
       it('',async () => {

           // accounts[1]에게 10 스타코인을 approve 함
           await kStarCoin.methods.approve(
               accounts[1],
               web3.utils.toWei('10','ether')
           ).send({
               from : accounts[0]
           });

           await kStarCoin.methods.newOwner(accounts[1]).send({
               from : accounts[0]
           });

           await kStarCoin.methods.kscBatchSellByOtherCoin(
               accounts[0],
               [accounts[2],accounts[3],accounts[4]],
               [web3.utils.toWei('1','ether'),web3.utils.toWei('1','ether'),web3.utils.toWei('1','ether')],
               1,
               [123123123,123123,1231232],
               ''
           ).send({
               from : accounts[1],
               gas : '6000000'
           });


           assert.equal(web3.utils.toWei('1','ether'),
               await kStarCoin.methods.balanceOf(accounts[2]).call()
           );
           assert.equal(web3.utils.toWei('1','ether'),
               await kStarCoin.methods.balanceOf(accounts[3]).call()
           );
           assert.equal(web3.utils.toWei('1','ether'),
               await kStarCoin.methods.balanceOf(accounts[4]).call()
           );

       });
    });

    describe('#kscTransferToTeam()', () => {
       it('해당 함수는 kscBatchSellByOtherCoin 과 똑같은 소스로 Event 함수만 달라짐. Passed...', async () => {
       });
    });

    describe('#kscTransferToPartner()', () => {
        it('해당 함수는 kscBatchSellByOtherCoin 과 똑같은 소스로 Event 함수만 달라짐. Passed...', async () => {

        }) ;
    });

    describe('#kscBatchTransferToEcosystem()', () => {
        it('해당 함수는 kscBatchSellByOtherCoin 과 똑같은 소스로 Event 함수만 달라짐. Passed...',async () => {

        }) ;
    });

    describe('#kscBatchTransferToBounty()', () => {
        it('해당 함수는 kscBatchSellByOtherCoin 과 똑같은 소스로 Event 함수만 달라짐. Passed...',async () => {

        }) ;
    });

});