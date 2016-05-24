(function () {
  'use strict';

  angular
    .module('reports')
    .controller('ReportsListController', ReportsListController);

  ReportsListController.$inject = ['ReportsService'];

  function ReportsListController(ReportsService) {
    var vm = this;

    vm.reports = ReportsService.query();
  }
})();
