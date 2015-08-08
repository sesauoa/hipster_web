/**
 * Created by chris on 16/05/15.
 */
/* global angular */

var hipsterTodo = angular.module('hipsterTodo', []);

function mainController($scope, $http) {
  $scope.newItemName = '';
  $scope.todos = [
    {
      id: 1,
      name: 'Buy potatoes',
      completed: true,
      datetimeCreated: 1431737332288,
      datetimeCompleted: 1431737371434
    },
    {
      id:2,
      name: 'Create hipster web tutorial',
      completed: false,
      datetimeCreated: 1431737359923
    },
    {
      id:3,
      name: 'Drink beer',
      completed: false,
      datetimeCreated: 1431737372434
    }
  ];

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

    console.log('New todo: ', newTodo);
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

    $http.put('/api/todo/' + todo.id, todo)
      .success(function (data) {
        console.log('Todo saved successfully: ', data);
      })
      .error(function (data) {
        console.error('Failed to save todo: ', data);
      });
  };

  $scope.uncheckTodo = function (todo) {
    todo.completed = false;
    delete todo.datetimeCompleted;

    $http.put('/api/todo/' + todo.id, todo)
      .success(function (data) {
        console.log('Todo saved successfully: ', data);
      })
      .error(function (data) {
        console.error('Failed to save todo: ', data);
      });
  }

}