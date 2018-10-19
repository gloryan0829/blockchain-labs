const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const compiledContract = require('../compile');
const web3 = new Web3(ganache.provider());
const MultiOwnable = compiledContract.contracts[':MultiOwnable'];

require('events').EventEmitter.defaultMaxListeners = 0;

let multiOwnableContract;
let accounts;

beforeEach(async () => {

    accounts = await web3.eth.getAccounts();

    multiOwnableContract = await new web3.eth.Contract(JSON.parse(MultiOwnable.interface))
        .deploy({ data : MultiOwnable.bytecode })
        .send({ from : accounts[0], gas : '3000000' })
});


describe('MultiOwnable Contract', () => {

    describe('#init()', () => {
        it('컴파일 및 컨트랙트 배포 완료 테스트 ', () => {
            assert.ok(multiOwnableContract.options.address);
        });

        it('Root, SuperOwner, Owner, owners 의 초기값이 msg.sender로 셋팅 되는지 확인', async () => {

            const root = await multiOwnableContract.methods.root().call();
            const superOwner = await multiOwnableContract.methods.superOwner().call();
            const isOwner = await multiOwnableContract.methods.owners(accounts[0]).call();
            const ownerOfOwnerList = await multiOwnableContract.methods.ownerList(0).call();
            assert.equal(accounts[0], root);
            assert.equal(accounts[0], superOwner);
            assert.equal(true, isOwner);
            assert.equal(accounts[0], ownerOfOwnerList);
        });
    });

    describe('#changeRoot()', () => {
        it('Root 권한은 Root 권한을 가진 사람만이 다른 계정으로 설정할 수 있음', async () => {
          let root = await multiOwnableContract.methods.root().call();
            assert.equal(accounts[0], root);

            await multiOwnableContract.methods.changeRoot(accounts[1]).send({
                from : root
            });

            root = await multiOwnableContract.methods.root().call();
            assert.equal(accounts[1], root);

            //실패 케이스
            multiOwnableContract.methods.changeRoot(accounts[2]).send({
                from : accounts[0]
            },(error, result)=>{
                if(error){
                   assert.equal('revert',error.results[error.hashes[0]].error);
                }
            });
        });
    });

    describe('#changeSuperRoot()', () => {
        it('SuperOwner 권한은 Root 권한을 가진 사람만이 다른 계정으로 설정할 수 있음 ', async() => {

            let root = await multiOwnableContract.methods.root().call();
            let superOwner = await multiOwnableContract.methods.superOwner().call();

            assert.equal(accounts[0], superOwner);

            await multiOwnableContract.methods.changeSuperOwner(accounts[2]).send({
                from : root
            });

            superOwner = await multiOwnableContract.methods.superOwner().call();
            assert.equal(accounts[2], superOwner);

            //실패 케이스
            multiOwnableContract.methods.changeSuperOwner(accounts[2]).send({
                from : accounts[0]
            },(error, result)=>{
                if(error){
                    assert.equal('revert',error.results[error.hashes[0]].error);
                }
            });
        });
    });

    describe('#newOwner()', () => {
        it('owner 3명 더 추가하고 accounts[3] 확인하기 ', async()=> {
            await multiOwnableContract.methods.newOwner(accounts[1]).send({
                from : accounts[0]
            });
            await multiOwnableContract.methods.newOwner(accounts[2]).send({
                from : accounts[0]
            });
            await multiOwnableContract.methods.newOwner(accounts[3]).send({
                from : accounts[0]
            });
            await multiOwnableContract.methods.newOwner(accounts[4]).send({
                from : accounts[0]
            });

            const ownerAccount = await multiOwnableContract.methods.ownerList(3).call();
            assert.equal(accounts[3], ownerAccount);

            // multiOwnableContract.methods.ownerList(5).call({
            // },(error, result)=>{
            //     if(error) {
            //         console.log(error.results[error.hashes[0]].error);
            //     }
            // });
        });
    });

    describe('#deleteOwner()', () => {
        it('owner 2명 추가하고 account[0] 삭제 후 ownerList[0] == accounts[2] 확인하기 ', async()=> {

            await multiOwnableContract.methods.newOwner(accounts[1]).send({
                from : accounts[0]
            });

            await multiOwnableContract.methods.newOwner(accounts[2]).send({
                from : accounts[0]
            });

            await multiOwnableContract.methods.deleteOwner(accounts[0]).send({
                from : accounts[0]
            });

            const address = await multiOwnableContract.methods.ownerList(0).call();

            assert.equal(accounts[2], address);

            // multiOwnableContract.methods.ownerList(5).call({
            // },(error, result)=>{
            //     if(error) {
            //         console.log(error.results[error.hashes[0]].error);
            //     }
            // });
        });
    });

    describe('#changeSuperOwnerByDAO()', () => {

       it(' Owner (accounts[1:3] 총 4명) 로 설정 후 SuperOwner 후보(accounts[4]) 과반 수 이상으로 선출하기 ',
           async () => {

               await multiOwnableContract.methods.newOwner(accounts[1]).send({
                   from : accounts[0]
               });

               await multiOwnableContract.methods.newOwner(accounts[2]).send({
                   from : accounts[0]
               });

               await multiOwnableContract.methods.newOwner(accounts[3]).send({
                   from : accounts[0]
               });

               // 이미 등록 된 Address..
               multiOwnableContract.methods.newOwner(accounts[0]).send({
                   from : accounts[0]
               },(error, result)=>{
                   if(error){
                       assert.equal('revert',error.results[error.hashes[0]].error);
                   }
               });

               //현재 슈퍼오너
               assert.equal(accounts[0], await multiOwnableContract.methods.superOwner().call());

               await multiOwnableContract.methods.changeSuperOwnerByDAO(accounts[4]).send({
                   from : accounts[1]
               });
               await multiOwnableContract.methods.changeSuperOwnerByDAO(accounts[4]).send({
                   from : accounts[2]
               });
               await multiOwnableContract.methods.changeSuperOwnerByDAO(accounts[4]).send({
                   from : accounts[3]
               });

               //슈퍼오너가 바뀌었는가
               assert.equal(accounts[4], await multiOwnableContract.methods.superOwner().call());

               //초기화 되었는지 확인하기.
               multiOwnableContract.methods.candidateSuperOwnerMap(accounts[1]).call({
               },(error, result)=>{
                   if(!error){
                       assert('0x0000000000000000000000000000000000000000', result);
                   }
               });

           });
    });

});