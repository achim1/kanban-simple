
var app = angular.module('app', ['ngRoute','ngAnimate','ui.bootstrap']);
//var app = angular.module('controllers.header', ['ngRoute', 'ui.bootstrap']);

//app.controller("HeaderCtrl", function($scope, $location) {
app.controller('HeaderCtrl', function($scope, $http) {
    //$scope.isActive = function (viewLocation) {
    //    var active = (viewLocation === $location.path());
    //    return active;
    //};
    $scope.deleteAllBoards = function(){
        $http.delete('api/boards/delete')
            .success(function(data) {
                console.log(data);
            })
            .error(function(data){
                console.log(data)
            });
    };
    $scope.createBoard = function(){
        $http.post('api/boards/')
            .success(function(data) {
                console.log(data);
            })
            .error(function(data){
                console.log(data)
            });
    };

});
app.controller('mainController',function($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('api/todos')
        .success(function(data) {
            $scope.todos = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

});
app.controller('DropdownCtrl', function ($scope, $log) {
  $scope.items = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third!'
  ];

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
});


