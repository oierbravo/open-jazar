(function () {
  'use strict';

  // Reports controller
  angular
    .module('reports')
    .controller('ReportsController', ReportsController);

  ReportsController.$inject = ['$scope', '$state', 'Authentication', 'reportResolve'];

  function ReportsController ($scope, $state, Authentication, report) {
    var vm = this;

    vm.authentication = Authentication;
    vm.report = report;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Report
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.report.$remove($state.go('reports.list'));
      }
    }

    // Save Report
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.reportForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.report._id) {
        vm.report.$update(successCallback, errorCallback);
      } else {
        vm.report.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('reports.view', {
          reportId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
