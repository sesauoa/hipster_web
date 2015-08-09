/**
 * Created by chris on 16/05/15.
 */
/* global angular */

var hipsterTodo = angular.module('hipsterTodo', []);

function mainController($scope, $http) {
  $scope.newItemName = '';

  $http.get('/api/todo').then(
  function (data) {
    $scope.todos = data.data;
  });

  $scope.createTodo = function () {
    var newTodo = {
      name: $scope.newItemName,
      completed: false,
      datetimeCreated: Date.now()
    };

    $scope.todos.push(newTodo);
    $scope.newItemName = '';

    $http.post('/api/todo', newTodo)
      .success(function (data) {
        console.log('Todo saved successfully: ', data);
        newTodo._id = data._id
      })
      .error(function (data) {
        console.error('Failed to save todo: ', data)
      })
  };
  
  $scope.checkTodo = function (todo) {
    todo.datetimeCompleted = Date.now();
    todo.completed = true;

    $http.post('/api/todo/' + todo._id + '/complete',{
      datetimeCompleted: todo.datetimeCompleted
    });
  };

  $scope.uncheckTodo = function (todo) {
    todo.completed = false;
    delete todo.datetimeCompleted;

    $http.post('/api/todo/' + todo._id + '/uncomplete');
  }

}