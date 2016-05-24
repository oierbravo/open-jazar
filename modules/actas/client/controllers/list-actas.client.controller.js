(function () {
  'use strict';

  angular
    .module('actas')
    .controller('ActasListController', ActasListController);

  ActasListController.$inject = ['ActasService'];

  function ActasListController(ActasService) {
    var vm = this;

    vm.actas = ActasService.query();
  }
})();
