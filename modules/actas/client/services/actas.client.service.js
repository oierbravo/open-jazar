//Actas service used to communicate Actas REST endpoints
(function () {
  'use strict';

  angular
    .module('actas')
    .factory('ActasService', ActasService);

  ActasService.$inject = ['$resource'];

  function ActasService($resource) {
    return $resource('api/actas/:actaId', {
      actaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
