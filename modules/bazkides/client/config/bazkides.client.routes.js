(function () {
  'use strict';

  angular
    .module('bazkides')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('bazkides', {
        abstract: true,
        url: '/bazkides',
        template: '<ui-view/>'
      })
      .state('bazkides.list', {
        url: '',
        templateUrl: 'modules/bazkides/client/views/list-bazkides.client.view.html',
        controller: 'BazkidesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Bazkides List'
        }
      })
      .state('bazkides.create', {
        url: '/create',
        templateUrl: 'modules/bazkides/client/views/form-bazkide.client.view.html',
        controller: 'BazkidesController',
        controllerAs: 'vm',
        resolve: {
          bazkideResolve: newBazkide
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Bazkides Create'
        }
      })
      .state('bazkides.edit', {
        url: '/:bazkideId/edit',
        templateUrl: 'modules/bazkides/client/views/form-bazkide.client.view.html',
        controller: 'BazkidesController',
        controllerAs: 'vm',
        resolve: {
          bazkideResolve: getBazkide
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Bazkide {{ bazkideResolve.name }}'
        }
      })
      .state('bazkides.view', {
        url: '/:bazkideId',
        templateUrl: 'modules/bazkides/client/views/view-bazkide.client.view.html',
        controller: 'BazkidesController',
        controllerAs: 'vm',
        resolve: {
          bazkideResolve: getBazkide
        },
        data:{
          pageTitle: 'Bazkide {{ articleResolve.name }}'
        }
      });
  }

  getBazkide.$inject = ['$stateParams', 'BazkidesService'];

  function getBazkide($stateParams, BazkidesService) {
    return BazkidesService.get({
      bazkideId: $stateParams.bazkideId
    }).$promise;
  }

  newBazkide.$inject = ['BazkidesService'];

  function newBazkide(BazkidesService) {
    return new BazkidesService();
  }
})();
