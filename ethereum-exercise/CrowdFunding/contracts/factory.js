import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x6cEb5bD3184BDDE3Ce9E64563Dd0840765454541'
);


export default instance;