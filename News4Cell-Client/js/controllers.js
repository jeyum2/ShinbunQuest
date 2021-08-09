var isTitleShown = false;


angular.module('starter.controllers', [])

.controller('PostCtrl', function($scope, $ionicModal, $location, $http, $q, Articles) {	

	Articles.promise().then(
		function(){
			$scope.articles = Articles.all();
			$scope.title = Articles.title();
		}
	);

	$scope.modalHide = function(location){
		
		if(location == 'post'){
			// alert("post");
			$location.path('/tab/post');
		}else if(location == 'mangas'){
			// alert("mangas");
			$location.path('/tab/mangas');		

		}else{
			// alert("Wrong location");
		}
		$scope.modal.hide();
	}

  $scope.$on('$viewContentLoaded', function(){
  	if(!isTitleShown){
	  isTitleShown = true;
	  $ionicModal.fromTemplateUrl('templates/title-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	    modal.show();
	  });
	}
  });

})

.controller('PostArticleCtrl', function($scope, $stateParams, $http, $ionicPopup, $location, Articles) {
	var contents = Articles.get($stateParams.articleId);
	$scope.title = contents.title;
	$scope.paragraphs = 
	[{contents:contents.sent1.trim(), image:'img/tapicon.png'},
	 {contents:contents.sent2.trim(), image:'img/tapicon.png'},
	 {contents:contents.sent3.trim(), image:'img/tapicon.png'},
	 {contents:contents.sent4.trim(), image:'img/tapicon.png'}]; 

	 $scope.inputURL = '';
	$scope.selectImage = function(paragraph){
		$scope.data = {}

		// An elaborate, custom popup
	   var myPopup = $ionicPopup.show({
	     template: '<input type="text" ng-model="data.inputURL">',
	     title: 'Enter Image URL',
	     scope: $scope,
	     buttons: [
	       { text: 'Cancel' },
	       {
	         text: '<b>Use</b>',
	         type: 'button-positive',
		       onTap: function(e) {
	           if (!$scope.data.inputURL) {
	             //don't allow the user to close unless he enters wifi password
	             e.preventDefault();
	           } else {
	           	 paragraph.image = $scope.data.inputURL;
	           	 return $scope.data.inputURL;
	           }
	         }
       },
     ]
   });
   myPopup.then(function(res) {
     console.log('Tapped!', res);
   });

	}
	$scope.postArticle = function(){

		var data = {
			title:$scope.title,
			date:contents.date,
			sent1:$scope.paragraphs[0].contents,
			sent2:$scope.paragraphs[1].contents,
			sent3:$scope.paragraphs[2].contents,
			sent4:$scope.paragraphs[3].contents,
			image1:$scope.paragraphs[0].image,
			image2:$scope.paragraphs[1].image,
			image3:$scope.paragraphs[2].image,
			image4:$scope.paragraphs[3].image
		}
		$http.post(API_SERVER, data).then(function (res) {
	     	alert("Post Success");
	     	$location.path('/tab/mangas');		
	    }, function (res) {
	    	alert("Thank you for Posting!");
	    	$location.path('/tab/mangas');		
		});

	}
		


})
.controller('ListCtrl', function($scope) {
})
.controller('WeAreCtrl', function($scope) {
})
.controller('ListDetailCtrl', function($scope) {
})

.controller('MangaListCtrl', function($scope, Mangas) {

	Mangas.promise().then(
		function(){
			$scope.mangas = Mangas.all();
		}
	);
})

.controller('MangaDetailCtrl', function($scope, $stateParams, Mangas) {
	// mangaId
	var contents = Mangas.get($stateParams.mangaId);
	// $scope.title = contents.title;
	$scope.paragraphs = [
		{image:contents.image1, contents:contents.sent1.trim()},
		{image:contents.image2, contents:contents.sent2.trim()},
		{image:contents.image3, contents:contents.sent3.trim()},
		{image:contents.image4, contents:contents.sent4.trim()}
	]; 

	// Mangas.promise().then(
	// 	function(){
	// 		$scope.mangas = Mangas.all();
	// 	}
	// );
})


