angular.module('unigps.controllers', ['ionic', 'unigps.services'])


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope,User,Recommendations,$window) {
  // expose the number of new favorites to the scope
  $scope.favCount = User.favoriteCount;
  // stop audio when going to favorites page
  $scope.enteringFavorites = function() {
    User.newFavorites = 0;
    Recommendations.haltAudio();
  }
  $scope.leavingFavorites = function() {
    Recommendations.init();
  }

  $scope.logout = function() {
    User.destroySession();

    // instead of using $state.go, we're going to redirect.
    // reason: we need to ensure views aren't cached.
    $window.location.href = 'index.html';
  }

})
.controller('AccountCtrl', function($scope, $state, User) {
  // attempt to signup/login via User.auth
  $scope.submitForm = function(username, signingUp) {
    User.auth(username, signingUp).then(function(){
      // session is now set, so lets redirect to discover page
      $state.go('tab.vehicle');

    }, function() {
      // error handling here
      alert('Hmm... try another username.');

    });
  }

});
