const path = require('path');
const fs = require('fs');
const solc = require('solc');

const kstarCoinPath = path.join(__dirname, 'contract', 'KStarCoin.sol');
const source = fs.readFileSync(kstarCoinPath, 'utf-8');
const compiledSource = solc.compile(source, 1);
console.log(compiledSource);
module.exports = compiledSource;