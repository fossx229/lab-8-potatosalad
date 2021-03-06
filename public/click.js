angular.module('register',[])
.controller('registerCtrl',registerCtrl)
.factory('registerApi',registerApi)
.constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

function registerCtrl($scope,registerApi){
  $scope.buttons=[]; //Initially all was still
  $scope.items=[];  // Also empty initally
  $scope.total=function(items) {
    var total = 0;
    // converts total from a string to a float
    parseFloat(total).toFixed(2);
    for (var i = 0; i < items.length; i++) {
      total = parseFloat(total) + parseFloat(findSum(items[i].price, items[i].quantity));
    }
    return total.toFixed(2);
  };
  // Defining which functions are visible in the HTML
  $scope.errorMessage='';
  $scope.isLoading=isLoading;
  $scope.refreshButtons=refreshButtons;
  $scope.buttonClick=buttonClick;
  $scope.findSum=findSum;
  $scope.itemClick=itemClick;

  var loading = false;
  function isLoading(){
    return loading;
  }

  // Sends a request to the server for button information. Upon a successfully recieved response, the controllers button array will become the new information from the server
  // Otherwise a error will be shown and loading will be set to false.
  function refreshButtons(){
    loading=true;
    $scope.errorMessage='';
    registerApi.getButtons()
    .success(function(data){
      $scope.buttons=data;
      loading=false;
      console.log(items);
    })
    .error(function () {
      $scope.errorMessage="Unable to load Buttons:  Database request failed";
      loading=false;
    });
  }
  // Sends a request to the server for item information. Upon a successfully recieved response, the controllers item array will become the new information from the server
  // Otherwise a error will be shown and loading will be set to false.
  function retrieveItems(){
    loading = true;
    $scope.errorMessage='';
    registerApi.getItems()
    .success(function(data){
      $scope.items = data;
      loading=false;
    }
  )
  .error(function(){$scope.errorMessage="Unable click"; loading=false;});
}

// Sends a request to the server that indicates a button has been clicked. Upon a successfully recieved response, the controller will update its button and item arrays
// from the server. Otherwise a error will be shown and loading will be set to false.
function buttonClick($event){
  $scope.errorMessage='';
  registerApi.clickButton($event.target.id)
  .success(function(data){
    retrieveItems();
    refreshButtons();
  })
  .error(function(){$scope.errorMessage="Unable click";});

}
refreshButtons();  //makes sure the buttons are loaded
retrieveItems();  // makes sure the items are loaded

// Tells the server that an item has been pressed and includes the corresponding id of the item. Upon a successfully recieved response, the controllers item array will be
// updated from the server. Otherwise a error will be shown
function itemClick(id){
  $scope.errorMessage='';
  registerApi.clickItem(id)
  .success(function(){
    retrieveItems();
  })
  .error(function(){$scope.errorMessage="Error clicking on item -- Can't Delete!"});
}

// Helper function that multiples an items price by its quantity to provide information about the subtotal of a specific item
function findSum(price, quantity) {
  return (price * quantity).toFixed(2);
}

}

// function that accesses the server API endpoints in the server based on which function is called in this controller
function registerApi($http,apiUrl){
  return{
    getButtons: function(){
      var url = apiUrl + '/buttons';
      return $http.get(url);
    },
    getItems: function(){
      var url = apiUrl + '/items';
      return $http.get(url)
    },
    clickButton: function(id){
      var url = apiUrl+'/click?id='+id;
      return $http.get(url); // Easy enough to do this way
    },
    clickItem: function(id){
      var url = apiUrl +'/itemclick?id='+id
      return $http.get(url);
    }
  };
}
