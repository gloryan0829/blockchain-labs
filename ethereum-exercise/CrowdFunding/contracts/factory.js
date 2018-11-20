import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x56b6f9057ba75B1cB24b144195c279a63facF34d'
);


export default instance;