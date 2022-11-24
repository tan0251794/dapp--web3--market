App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:1234');
    web3 = new Web3(App.web3Provider);
    App.displayAccountInfo();
    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $('#account').text(`My Address: ${account}`);
        web3.eth.getBalance(account, function(err, balance) {
          if (err === null) {
            $('#accountBalance').text(`My Balance: ${Math.round(web3.fromWei(balance, 'ether').toString())} ETH`);
          }
        })
      }
    })
  },

  initContract: function() {
    $.getJSON('ChainList.json', function(chainListArtifact) {
      App.contracts.ChainList = TruffleContract(chainListArtifact);
      App.contracts.ChainList.setProvider(App.web3Provider);
      return App.reloadArticles();
    });
  },

  reloadArticles: function(){

    App.displayAccountInfo();

    $('#petsRow').empty();

    App.contracts.ChainList.deployed().then(function(instance) {
      // sell
      chainInstance = instance;
      // return chainInstance.sellArticle(
      //   "Scrappy",
      //   "two years old ...",
      //   web3.toWei('10'),
      //   {from: '0x885c7106408E4Cd8b3f9AD28aaAD706d2eF19128', gas: '1000000000' }
      // )
    })
    .then(function() {
      // get
      return chainInstance.getArticle();
      }).then(function(article) {
        console.log(article);
        if (article[0] == 0x0) {
          return ;
        }
        var petsRow = $('#petsRow');
        var petTemplate = $('#petTemplate');

        petTemplate.find('.panel-title').text(article[1]);
        petTemplate.find('.pet-breed').text(article[2]);
        petTemplate.find('.pet-age').text(`${web3.fromWei(article[3], 'ether').toString()} ETH`);
        petTemplate.find('.btn-adopt').attr('data-id', article[0]);

        petsRow.append(petTemplate.html());
      })
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleBuy);
  },


  handleBuy: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
