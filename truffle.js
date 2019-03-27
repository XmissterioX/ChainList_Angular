const HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config();
module.exports = {
    networks: {
         ganache: {
              host: "localhost",
              port: 7545,
              network_id: "*" // Match any network id
            },
          ropsten: {
            provider: function () {
            return new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY);
   },
            network_id: 3,
            gas: 4500000,
            gasPrice: 10000000000
}
       }
};
