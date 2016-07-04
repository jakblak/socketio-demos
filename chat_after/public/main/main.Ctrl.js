(function() {
  'use strict';

  angular
    .module('app')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$localStorage', 'socket', 'lodash'];

  function MainCtrl($scope, $localStorage, socket, lodash) {
    $scope.message = '';
    $scope.users = [];
    $scope.messages = [];
    $scope.likes = [];
    $scope.mynickname = $localStorage.nickname;
    var nickname = $scope.mynickname;

     $scope.joinPrivate = function() {
      socket.emit('join-private', {
        nickname: nickname
      });
      console.log('private room joined!');
    }

    $scope.groupPm = function() {
      socket.emit('private-chat', {
        message: 'hello everybody!'
      });
    }

    socket.on('show-message', function(data) {
      console.log(data);
    });

    socket.emit('get-users');

    $scope.sendMessage = function(data) {
      var newMessage = {
        message: $scope.message,
        from: nickname
      }
      socket.emit('send-message', newMessage);
      // $scope.messages.push(newMessage);
      $scope.message = '';
    };

    $scope.sendLike = function(user) {
      console.log(user);
      var id = lodash.get(user, 'socketid');
      var likeObj = {
        from: nickname,
        like: id
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