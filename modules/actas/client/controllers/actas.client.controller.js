(function () {
  'use strict';

  // Actas controller
  angular
    .module('actas')
    .controller('ActasController', ActasController);

  ActasController.$inject = ['$scope', '$state', 'Authentication', 'actaResolve'];

  function ActasController ($scope, $state, Authentication, acta) {
    var vm = this;

    vm.authentication = Authentication;
    vm.acta = acta;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

$scope.dateOptions = {
    changeYear: true,
    changeMonth: true,
    regional: 'es'
    };
    $scope.content = vm.acta.content;
    // Remove existing Acta
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.acta.$remove($state.go('actas.list'));
      }
    }

    // Save Acta
    function save(isValid) {
      console.log(vm.acta);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.actaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.acta._id) {
        vm.acta.$update(successCallback, errorCallback);
      } else {
        vm.acta.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('actas.view', {
          actaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
