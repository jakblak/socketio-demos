(function() {
  'use strict';

  angular
    .module('app')
    .factory('socket', socket);

  socket.$inject = ['$rootScope'];

  function socket($rootScope) {
    var socket = io.connect();

    return {
      on: on,
      emit: emit,
      init: init
    }

    function init() {
      socket.emit('trigger', function() {
        console.log('triggered ...');
        // socket.on('init', function(data) {
        //   $scope.users = data.users;
        //   console.log(data.users);
        // });
      });
    }

    function on(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    };

    function emit(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    };

  };
})();