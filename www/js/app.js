// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('unigps', ['ionic', 'unigps.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router, which uses the concept of states.
  // Learn more here: https://github.com/angular-ui/ui-router.
  // Set up the various states in which the app can be.
  // Each state's controller can be found in controllers.js.
  $stateProvider

  // splash page
  .state('account', {
    url: '/',
    templateUrl: 'templates/account.html',
    controller: 'AccountCtrl',
    onEnter: function($state, User){
         User.checkSession().then(function(hasSession) {
           if (hasSession) $state.go('tab.vehicle');
         });
    }
  })

  // Set up an abstract state for the tabs directive:
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabsCtrl',
    // don't load the state until we've populated our User, if necessary.
     resolve: {
       populateSession: function(User) {
         return User.checkSession();
       }
     },
     onEnter: function($state, User){
       User.checkSession().then(function(hasSession) {
         if (!hasSession) $state.go('account');
       });
     }
  })

  // Each tab has its own nav history stack:

  .state('tab.vehicle', {
    url: '/vehicle',
    views: {
      'tab-vehicle': {
        templateUrl: 'templates/vehicle.html',
        controller: 'VehicleCtrl'
      }
    }
  })

  .state('tab.groupvehicles', {
      url: '/groupvehicles',
      views: {
        'tab-groupvehicles': {
          templateUrl: 'templates/groupvehicles.html',
          controller: 'GroupVehiclesCtrl'
        }
      }
    })
  // If none of the above states are matched, use this as the fallback:
  // $urlRouterProvider.otherwise('/tab/discover');
  $urlRouterProvider.otherwise('/');

})


.constant('SERVER', {
  // Local server
  //url: 'http://localhost:3000'

  // Public Heroku server
  url: 'https://ionic-songhop.herokuapp.com'
});
