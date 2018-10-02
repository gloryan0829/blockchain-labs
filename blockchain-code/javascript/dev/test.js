const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

const bc1 = {
    chain: [
        {
            index: 1,
            timestamp: 1538435800242,
            transactions: [ ],
            nonce: 100,
            hash: "0",
            previousBlockHash: "0"
        },
        {
            index: 2,
            timestamp: 1538435808572,
            transactions: [ ],
            nonce: 5672,
            hash: "00002b62f1205be4a02b5f13b07344e7dbbe80088ec44327c34971412405da12",
            previousBlockHash: "0"
        },
        {
            index: 3,
            timestamp: 1538435853500,
            transactions: [
                {
                    amount: 12.5,
                    sender: "00",
                    recipent: "0d55b3f0c5d011e8af703763de321ecb",
                    transactionId: "12506c10c5d011e8af703763de321ecb"
                },
                {
                    amount: 50,
                    sender: "AAA",
                    recipent: "BBB",
                    transactionId: "237b1b20c5d011e882cc754b44786459"
                },
                {
                    amount: 60,
                    sender: "AAA",
                    recipent: "BBB",
                    transactionId: "270aaa80c5d011e882cc754b44786459"
                },
                {
                    amount: 70,
                    sender: "AAA",
                    recipent: "BBB",
                    transactionId: "2a4ed900c5d011e882cc754b44786459"
                }
            ],
            nonce: 34472,
            hash: "00003179411376e187a6b821d1a693baa7a969045566bf797c3899e96609dec5",
            previousBlockHash: "00002b62f1205be4a02b5f13b07344e7dbbe80088ec44327c34971412405da12"
        },
        {
            index: 4,
            timestamp: 1538435894032,
            transactions: [
                {
                    amount: 12.5,
                    sender: "00",
                    recipent: "0d55b3f0c5d011e8af703763de321ecb",
                    transactionId: "2d15c130c5d011e8af703763de321ecb"
                },
                {
                    amount: 70,
                    sender: "AAA",
                    recipent: "BBB",
                    transactionId: "3735eaf0c5d011e882cc754b44786459"
                },
                {
                    amount: 1,
                    sender: "AAA",
                    recipent: "BBB",
                    transactionId: "3aecff80c5d011e882cc754b44786459"
                },
                {
                    amount: 5,
                    sender: "AAA",
                    recipent: "BBB",
                    transactionId: "3cce90c0c5d011e882cc754b44786459"
                },
                {
                    amount: 11,
                    sender: "AAA",
                    recipent: "BBB",
                    transactionId: "3e82a960c5d011e882cc754b44786459"
                }
            ],
            nonce: 34833,
            hash: "0000d0601bcdbd3ce6b7de28f683c58d38c5a112aaddd3cb24130dd587ae2dcb",
            previousBlockHash: "00003179411376e187a6b821d1a693baa7a969045566bf797c3899e96609dec5"
        }
    ]
};

console.log('VALID : ' + bitcoin.chainIsValid(bc1['chain']));

