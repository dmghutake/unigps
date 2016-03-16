angular.module('unigps.controllers', ['ionic', 'unigps.services'])

/*
Controller for the discover page
*/
.controller('VehicleCtrl', function($scope, $timeout,User,Recommendations,$ionicLoading) {
  // helper functions for loading
  var showLoading = function() {
    $ionicLoading.show({
      template: '<i class="ion-loading-c"></i>',
      noBackdrop: true
    });
  }

  var hideLoading = function() {
    $ionicLoading.hide();
  }

  // set loading to true first time while we retrieve songs from server.
  showLoading();
  // our first tree songs
  // get our first songs
    Recommendations.init()
      .then(function(){
        $scope.currentSong = Recommendations.queue[0];
        Recommendations.playCurrentSong();

    }).then(function(){
      //turn off loading
        hideLoading();
        $scope.currentSong.loaded =true;
    });

// fired when we favorite / skip a song.
  $scope.sendFeedback = function (bool) {
    // first, add to favorites if they favorited
    if (bool) User.addSongToFavorites($scope.currentSong);

    // set variable for the correct animation sequence
    $scope.currentSong.rated = bool;
    $scope.currentSong.hide = true;
    // prepare the next song
       Recommendations.nextSong();


    $timeout(function() {
      // $timeout to allow animation to complete before changing to next song
      // set the current song to one of our three songs
        // var randomSong = Math.round(Math.random() * ($scope.songs.length - 1));
    // $timeout to allow animation to complete
      $scope.currentSong = Recommendations.queue[0];
      }, 250);
      Recommendations.playCurrentSong().then(function(){
        $scope.currentSong.loaded =true;
      });
  }
  // used for retrieving the next album image.
  // if there isn't an album image available next, return empty string.
  $scope.nextAlbumImg = function() {
    if (Recommendations.queue.length > 1) {
      return Recommendations.queue[1].image_large;
    }

    return '';
  }
})


/*
Controller for the favorites page
*/
.controller('GroupVehiclesCtrl', function($scope,User) {
  $scope.username = User.username;
  // get the list of our favorites from the user service
  $scope.favorites = User.favorites;
  $scope.removeSong = function(song, index) {
    User.removeSongFromFavorites(song, index);
  }
  $scope.openSong = function(song) {
    $window.open(song.open_url, "_system");
  }
})
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

})
.controller('UniGPSCtrl',function($scope, $ionicPlatform, $location) {

	// init gps array
    $scope.whoiswhere = [];
    $scope.basel = { lat: 47.55633987116614, lon: 7.576619513223015 };


    // check login code
	$ionicPlatform.ready(function() {	navigator.geolocation.getCurrentPosition(function(position) {
		    $scope.position=position;
	        var c = position.coords;
	        $scope.gotoLocation(c.latitude, c.longitude);
		    $scope.$apply();
		    },function(e) { console.log("Error retrieving position " + e.code + " " + e.message) });
	    $scope.gotoLocation = function (lat, lon) {
	        if ($scope.lat != lat || $scope.lon != lon) {
	            $scope.basel = { lat: lat, lon: lon };
	            if (!$scope.$$phase) $scope.$apply("basel");
				}
			};

		    // some points of interest to show on the map
		    // to be user as markers, objects should have "lat", "lon", and "name" properties
		    $scope.whoiswhere = [
		        { "name": "My Marker", "lat": $scope.basel.lat, "lon": $scope.basel.lon },
				];

			});

});
