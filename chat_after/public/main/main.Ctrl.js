(function() {
  'use strict';

  angular
    .module('app')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$localStorage', 'socket', 'lodash'];

  function MainCtrl($scope, $localStorage, socket, lodash) {
    $scope.users = [];
    $scope.messages = [];
    $scope.likes = [];
    $scope.mynickname = $localStorage.nickname;
    var nickname = $scope.mynickname;

    $scope.sendMessage = function(data) {
      var newMessage = {
        message: $scope.message,
        from: $scope.mynickname
      }
      socket.emit('send-message', newMessage);
      $scope.messages.push(newMessage);
      $scope.message = '';
    };

    $scope.sendLike = function(e) {
      var toLike = $scope.users.filter(function(f) {
        if(e.socketid === f.socketid)
        return f.socketid;
      });
      var result = lodash.get(toLike, '[0].socketid');
      var likeObj = {
        from: $scope.mynickname,
        like: result
      }
      socket.emit('send-like', likeObj);
    }

    socket.on('all-users', function(data) {
      console.log(data);
      $scope.users = data.filter(function(item) {
        return item.nickname !== nickname;
      });
    });

    socket.on('user-liked', function(data) {
      console.log(data);
      console.log(data.from);
      $scope.likes.push(data.from);
    });

    socket.on('message-received', function(data) {
      $scope.messages.push(data);
    });

    socket.on('update', function(data) {
      $scope.users = [];
      $scope.users = data.filter(function(item) {
        return item.nickname !== nickname;
      });
    });

  };
})();