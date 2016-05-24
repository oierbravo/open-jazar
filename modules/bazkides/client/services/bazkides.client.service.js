//Bazkides service used to communicate Bazkides REST endpoints
(function () {
  'use strict';

  angular
    .module('bazkides')
    .factory('BazkidesService', BazkidesService);

  BazkidesService.$inject = ['$resource'];

  function BazkidesService($resource) {
    return $resource('api/bazkides/:bazkideId', {
      bazkideId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
