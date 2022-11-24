var ChainList = artifacts.require("./ChainList.sol");

contract('ChainList', function(accounts) {
  // declare variable for test sell methods
  var chainListInstance;
  var seller = accounts[2];
  var name = "Gundam";
  var description = "masterpiece ..."
  var price = '1000';

    it("should be initialized with empty values", function() {
         return ChainList.deployed().then(function(instance) {
             return instance.getArticle();
         }).then(function(data) {
             assert.equal(data[0], 0x0, "seller must be empty");
             assert.equal(data[1], "", "name must be empty");
             assert.equal(data[3].toNumber(), 0, "price must be zero");
        })
    });

    it("should upload selling article successfully", function() {
         return ChainList.deployed().then(function(instance) {
           chainInstance = instance;
             return chainInstance.sellArticle(
               name,
               description,
               web3.utils.toWei(price, 'ether'),
               {from: seller}
             );
         })
         .then(function() {
            return chainInstance.getArticle();
           }).then(function(data) {
               assert.equal(data[0], seller, "seller must be account 2");
               assert.equal(data[1], "Gundam", "name must be Gundam");
               assert.equal(data[3], web3.utils.toWei(price, 'ether'), "price must be 1000");
             });
    });

});
