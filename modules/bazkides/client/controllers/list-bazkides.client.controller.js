(function () {
  'use strict';

  angular
    .module('bazkides')
    .controller('BazkidesListController', BazkidesListController);

  BazkidesListController.$inject = ['BazkidesService'];

  function BazkidesListController(BazkidesService) {
    var vm = this;

    vm.bazkides = BazkidesService.query();
  }
})();
