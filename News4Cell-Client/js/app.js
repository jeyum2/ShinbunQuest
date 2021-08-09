// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var API_SERVER = 'http://192.168.100.126:3000/documents';

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {
    

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    // if(window.cordova && window.cordova.plugins.Keyboard) {
    //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    // }
    // if(window.StatusBar) {
    //   // org.apache.cordova.statusbar required
    //   StatusBar.styleDefault();
    // }
  });
})
.config(function ( $httpProvider) {        
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
})
// .config(['$sceDelegateProvider', function($sceDelegateProvider) {
//      $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://192.168.100.126:3000/**', 'http://localhost/**', '**', '*']);
//  }])
// .config(function($sceDelegateProvider) {
//      $sceDelegateProvider.resourceUrlWhitelist([
//        // Allow same origin resource loads.
//        'self',
//        // Allow loading from our assets domain.  Notice the difference between * and **.
//        'http://192.168.100.126:3000/**']);

//      // // The blacklist overrides the whitelist so the open redirect here is blocked.
//      // $sceDelegateProvider.resourceUrlBlacklist([
//      //   'http://myapp.example.com/clickThru**']);
// })
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.post', {
      url: '/post',
      views: {
        'tab-post': {
          templateUrl: 'templates/tab-post.html',
          controller: 'PostCtrl'
        }
      }
    })
  .state('tab.post-article', {
      url: '/post/:articleId',
      views: {
        'tab-post': {
          templateUrl: 'templates/post-article.html',
          controller: 'PostArticleCtrl'
        }
      }
    })
    .state('tab.mangas', {
      url: '/mangas',
      views: {
        'tab-mangas': {
          templateUrl: 'templates/tab-mangas.html',
          controller: 'MangaListCtrl'
        }
      }
    })
    .state('tab.manga-detail', {
      url: '/manga/:mangaId',
      views: {
        'tab-mangas': {
          templateUrl: 'templates/manga-detail.html',
          controller: 'MangaDetailCtrl'
        }
      }
    })

    .state('tab.weare', {
      url: '/weare',
      views: {
        'tab-weare': {
          templateUrl: 'templates/tab-weare.html',
          controller: 'WeAreCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/post');

});

