(function () {
  'use strict';

  // Bazkides controller
  angular
    .module('bazkides')
    .controller('BazkidesController', BazkidesController);

  BazkidesController.$inject = ['$scope', '$state', 'Authentication', 'bazkideResolve'];

  function BazkidesController ($scope, $state, Authentication, bazkide) {
    var vm = this;

    vm.authentication = Authentication;
    vm.bazkide = bazkide;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Bazkide
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.bazkide.$remove($state.go('bazkides.list'));
      }
    }

    // Save Bazkide
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.bazkideForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.bazkide._id) {
        vm.bazkide.$update(successCallback, errorCallback);
      } else {
        vm.bazkide.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('bazkides.view', {
          bazkideId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
