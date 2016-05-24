//Reports service used to communicate Reports REST endpoints
(function () {
  'use strict';

  angular
    .module('reports')
    .factory('ReportsService', ReportsService);

  ReportsService.$inject = ['$resource'];

  function ReportsService($resource) {
    return $resource('api/reports/:reportId', {
      reportId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
