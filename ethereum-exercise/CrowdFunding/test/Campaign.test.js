const {beforeEach} = require('mocha');

const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

require('events').EventEmitter.defaultMaxListeners = 0;


const compiledFactory = require('../contracts/build/CampaignFactory.json');
const compiledCampaign = require('../contracts/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
   accounts = await web3.eth.getAccounts();

   factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
       .deploy({ data: compiledFactory.bytecode })
       .send({ from : accounts[0], gas : '1000000' });

   await factory.methods.createCampaign('100').send({
       from : accounts[0],
       gas : '1000000'
   });

   [campaignAddress] = await factory.methods.getCampaigns().call();
   campaign = await new web3.eth.Contract(
       JSON.parse(compiledCampaign.interface),
       campaignAddress
   );
});

describe('Campaigns', () => {
   it('Factory와 캠패인 배포', () => {
       assert.ok(factory.options.address);
       assert.ok(campaign.options.address);
   });

   it('의도된 Manager 와 같은지 체크', async () => {
      const manager = await campaign.methods.manager().call();
      assert.equal(accounts[0],manager);
   });

   it('컨트리뷰트를 실행함과 동시에 승인자로 등록하기', async () => {
       await campaign.methods.contribute().send({
           value : '200',
           from : accounts[1]
       });

       const isContributer = await campaign.methods.approvers(accounts[1]).call();
       assert.equal(true, isContributer);
   });

   it('최소한의 컨트리뷰트의 금액..', async () => {
       try {
            await campaign.methods.contribute().send({
                value : '5',
                from : accounts[1]
            });
            assert(false);
       } catch (error) {
            assert(error);
       }
   });

   it('캠페인에서 특정 지불에 대한 요청해보기', async () => {
       await campaign.methods
           .createRequest('부품 사기', '100', accounts[1])
           .send({
               from : accounts[0],
               gas : '1000000'
           });

       const request = await campaign.methods.requests(0).call();

        assert.equal('부품 사기', request['description']);
   });

   it('request 에 승인하기', async () => {
      await campaign.methods.contribute().send({
          from : accounts[0],
          value : web3.utils.toWei('10', 'ether')
      });

       await campaign.methods
           .createRequest(
               '부품 사기',
               web3.utils.toWei('5','ether'),
               accounts[1]
           ).send({
               from : accounts[0],
               gas : '1000000'
           });

       await campaign.methods.approveRequest(0).send({
           from : accounts[0],
           gas : '1000000'
       });

       await campaign.methods.finalizeRequest(0).send({
           from : accounts[0],
           gas : '1000000'
       });

       let balance = await web3.eth.getBalance(accounts[1]);
       balance = web3.utils.fromWei(balance, 'ether');
       balance = parseFloat(balance);
       console.log(balance);

       assert(balance == 105);

   });
});


