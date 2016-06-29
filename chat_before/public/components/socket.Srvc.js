(function() {
  'use strict';

  angular
    .module('app')
    .factory('socket', socket);

  socket.$inject = ['$rootScope'];

  function socket($rootScope) {
    return {}
    // Socket 'on' and 'emit' methods here
  };
})();