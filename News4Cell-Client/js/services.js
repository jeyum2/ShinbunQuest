
angular.module('starter.services', [])

.factory('Articles', function($http, $q) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var articles = {};
  var title = '記事を選んでください。';
  // var friends = [
  //   { id: 0, name: 'Scruff McGruff' },
  //   { id: 1, name: 'G.I. Joe' },
  //   { id: 2, name: 'Miss Frizzle' },
  //   { id: 3, name: 'Ash Ketchum' }
  // ];

  // $http.defaults.transformRequest.push(function (data, headersGetter) {
//             headersGetter().Accept = "application/json, text/javascript";
//             return data;
//     });
  var dfd = $q.defer();

  $http.get(API_SERVER+'/list.json')
  .then(function (res) {
      articles = res.data;
      dfd.resolve();
    }, function (res) {
        alert("Server is down!");
  });

  return {
    promise: function(){
      return dfd.promise;
    },
    title: function(){
      return title;
    },
    all: function() {
      return articles;
    },
    get: function(articleId) {
      // Simple index lookup
      return articles[articleId];
    }
  }
})
.factory('Mangas', function($http , $q) {
  var mangas = {};

  var dfd = $q.defer();

  $http.get(API_SERVER+'/product_list.json')
  .then(function (res) {
      articles = res.data;
      dfd.resolve();
    }, function (res) {
        alert("Server is down!");
  });

  return {
    promise: function(){
      return dfd.promise;
    },
    title: function(){
      return title;
    },
    all: function() {
      return articles;
    },
    get: function(articleId) {
      // Simple index lookup
      return articles[articleId];
    }
  }
});
