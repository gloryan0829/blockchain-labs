import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x0C4a25015801097c1Dd57385A001727339035fb1'
);


export default instance;